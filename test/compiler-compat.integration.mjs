#!/usr/bin/env node

// Exercise the publishable dist/ package in isolated consumer installations.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'typroof-compiler-compat-'));

/**
 * @param {string} command
 * @param {string[]} args
 * @param {string} cwd
 * @param {number} [expectedExitCode]
 */
function run(command, args, cwd, expectedExitCode = 0) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, npm_config_audit: 'false', npm_config_fund: 'false' },
    maxBuffer: 4 * 1024 * 1024,
  });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  assert.equal(
    result.status,
    expectedExitCode,
    `${command} ${args.join(' ')} returned ${result.status}, expected ${expectedExitCode}:\n${output}`,
  );
  return output;
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {string} cwd
 */
function execute(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
  });
  return { output: `${result.stdout ?? ''}${result.stderr ?? ''}`, status: result.status };
}

/** @param {string} directory */
function writeFixtures(directory) {
  fs.mkdirSync(path.join(directory, 'proof'), { recursive: true });
  fs.writeFileSync(
    path.join(directory, 'package.json'),
    JSON.stringify({ name: 'typroof-consumer-fixture', private: true, type: 'module' }, null, 2),
  );
  fs.writeFileSync(
    path.join(directory, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          lib: ['esnext'],
          strict: true,
          noEmit: true,
          skipLibCheck: true,
        },
        include: ['proof/**/*.ts'],
      },
      null,
      2,
    ),
  );
  fs.writeFileSync(
    path.join(directory, 'proof', 'compat.proof.ts'),
    `
import { equal, error, expect, test } from 'typroof';

type OnlyNumbers<T extends number> = T;

test('positive assertion and expected diagnostic', () => {
  expect<1>().to(equal<1>);
  // @ts-expect-error: test the TypeScript error matcher
  expect<OnlyNumbers<'wrong'>>().to(error);
});

// TypeScript 6.0 added Temporal to lib.esnext; 5.9 reports TS2304.
const instant = Temporal.Now.instant();
void instant;
`,
  );
  fs.writeFileSync(
    path.join(directory, 'proof', 'plugin.proof.ts'),
    `
import { expect, test } from 'typroof';
import { match } from 'typroof/plugin';
import type { Validator } from 'typroof/plugin';

declare module 'typroof/plugin' {
  interface ValidatorRegistry {
    compilerProbe: CompilerProbeValidator;
  }
}

interface CompilerProbeValidator extends Validator {
  return: false;
}

const compilerProbe = match<'compilerProbe'>();

test('custom plugin receives the selected TypeScript API', () => {
  // @ts-expect-error: deliberately trigger the runtime matcher analyzer
  expect<1>().to(compilerProbe);
});
`,
  );
  fs.writeFileSync(
    path.join(directory, 'typroof.config.mjs'),
    `
export default {
  plugins: [{
    name: 'compiler-identity-fixture',
    analyzers: {
      compilerProbe(_actual, _expected, { ts }) {
        throw 'plugin-api-compiler:' + ts.version;
      },
    },
  }],
};
`,
  );
  fs.writeFileSync(
    path.join(directory, 'probe.mjs'),
    `
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import typroof, { createTyproofProject, formatGroupResult } from 'typroof';

const projectRequire = createRequire(import.meta.url);
const typroofRequire = createRequire(import.meta.resolve('typroof'));
const projectTs = projectRequire('typescript');
const typroofTs = typroofRequire('typescript');

assert.strictEqual(projectTs, typroofTs, 'typroof must load the consumer compiler');
assert.equal(typeof typroofTs.createProgram, 'function');

const project = createTyproofProject({ check: true, testFiles: 'proof/compat.proof.ts' });
assert.equal(project.testFiles.length, 1);
assert.equal(project.checkFiles.length, 1);
assert.ok(project.program.getTypeChecker());

const diagnostics = project.performTypeCheck(project.checkFiles[0]);
const expectedCode = process.argv[2];
if (expectedCode === 'TS2304') {
  assert.ok(diagnostics.some((message) => message.includes('TS2304')));
} else {
  assert.deepEqual(diagnostics, []);
}

const results = await typroof({ testFiles: 'proof/compat.proof.ts' });
assert.equal(results.length, 1);
const summary = formatGroupResult(results[0].rootGroupResult);
assert.ok(summary.includes('positive assertion and expected diagnostic'));
assert.ok(!summary.includes('×'), summary);
console.log('api=' + typroofTs.version + '; diagnostics=' + diagnostics.length + '; assertions=pass');
`,
  );
}

/**
 * @param {string} directory
 * @param {string} name
 */
function executable(directory, name) {
  return path.join(
    directory,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? `${name}.cmd` : name,
  );
}

/**
 * @param {string} name
 * @param {string[]} versionSpecs
 * @param {string} expectedAPI
 * @param {string | null} expectedDiagnostic
 * @param {string} tarball
 * @param {string} [nativeVersion]
 */
function testConsumer(name, versionSpecs, expectedAPI, expectedDiagnostic, tarball, nativeVersion) {
  const cwd = path.join(scratch, name);
  writeFixtures(cwd);
  run(
    'npm',
    ['install', '--ignore-scripts', '--no-audit', '--no-fund', '-D', tarball, ...versionSpecs],
    cwd,
  );

  const tree = run('npm', ['ls', 'typescript', '--all'], cwd);
  assert.ok(tree.includes('typroof@0.6.0'), tree);
  assert.ok(!tree.includes('node_modules/typroof/node_modules/typescript'), tree);

  const tscVersion = run(executable(cwd, 'tsc'), ['--version'], cwd);
  assert.ok(tscVersion.includes(nativeVersion ?? expectedAPI), tscVersion);
  const tsc = execute(executable(cwd, 'tsc'), ['--noEmit'], cwd);
  assert.equal(tsc.status, expectedDiagnostic ? 2 : 0, tsc.output);
  if (expectedDiagnostic) assert.ok(tsc.output.includes(expectedDiagnostic), tsc.output);

  const probe = run('node', ['probe.mjs', expectedDiagnostic ?? 'none'], cwd);
  assert.ok(probe.includes(`api=${expectedAPI};`), probe);
  const cli = execute(
    process.execPath,
    [
      path.join(cwd, 'node_modules', 'typroof', 'cli.js'),
      '--check',
      '--files',
      'proof/compat.proof.ts',
    ],
    cwd,
  );
  assert.equal(cli.status, expectedDiagnostic ? 1 : 0, cli.output);
  if (expectedDiagnostic) assert.ok(cli.output.includes(expectedDiagnostic), cli.output);
  else assert.ok(cli.output.includes('Test Files'), cli.output);

  const plugin = execute(
    process.execPath,
    [path.join(cwd, 'node_modules', 'typroof', 'cli.js'), '--files', 'proof/plugin.proof.ts'],
    cwd,
  );
  assert.equal(plugin.status, 1, plugin.output);
  assert.ok(plugin.output.includes(`plugin-api-compiler:${expectedAPI}`), plugin.output);

  console.log(
    `[PASS] ${name}: tsc=${tscVersion.trim()}, API=${expectedAPI}, tsc=${tsc.status}, CLI=${cli.status}, plugin=${plugin.status}`,
  );
  return { name, tree, tscVersion: tscVersion.trim(), probe, tsc, cli, plugin };
}

try {
  assert.ok(
    fs.existsSync(path.join(root, 'dist', 'package.json')),
    'Run npm run build first to create dist/',
  );
  const packed = JSON.parse(
    run('npm', ['pack', './dist', '--json', '--pack-destination', scratch], root),
  );
  const tarball = path.join(scratch, packed[0].filename);
  const evidence = [];

  evidence.push(testConsumer('ts5', ['typescript@5.9.3'], '5.9.3', 'TS2304', tarball));
  evidence.push(testConsumer('ts6', ['typescript@6.0.3'], '6.0.3', null, tarball));
  evidence.push(
    testConsumer(
      'ts7-native-ts6-api',
      ['typescript@npm:@typescript/typescript6@6.0.3', '@typescript/native@npm:typescript@7.0.2'],
      '6.0.3',
      null,
      tarball,
      '7.0.2',
    ),
  );

  // TS7.0 alone cannot satisfy typroof's peer requirement or its Compiler API.
  const direct = path.join(scratch, 'ts7-direct');
  writeFixtures(direct);
  run(
    'npm',
    [
      'install',
      '--legacy-peer-deps',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      '-D',
      tarball,
      'typescript@7.0.2',
    ],
    direct,
  );
  const tsc7 = run(executable(direct, 'tsc'), ['--version'], direct);
  assert.ok(tsc7.includes('7.0.2'), tsc7);
  const unsupported = execute(
    process.execPath,
    [path.join(direct, 'node_modules', 'typroof', 'cli.js')],
    direct,
  );
  assert.equal(unsupported.status, 1);
  assert.ok(unsupported.output.includes('does not expose createProgram'), unsupported.output);
  console.log('[PASS] ts7-direct: native compiler works; clear unsupported-API diagnostic');
  evidence.push({ name: 'ts7-direct', tscVersion: tsc7.trim(), cli: unsupported });

  fs.writeFileSync(
    path.join(scratch, 'matrix-results.json'),
    JSON.stringify(evidence, null, 2) + '\n',
  );
  console.log(
    `All compiler compatibility cases passed. Evidence: ${path.join(scratch, 'matrix-results.json')}`,
  );
} finally {
  if (!process.env.TYPROOF_KEEP_MATRIX) fs.rmSync(scratch, { recursive: true, force: true });
}
