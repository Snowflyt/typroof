import fs from 'node:fs';
import path from 'node:path';

import esbuild from 'esbuild';
import { getTsconfig } from 'get-tsconfig';

import type { Config } from './config';

export const loadConfig = async ({
  cwd = process.cwd(),
}: { cwd?: string } = {}): Promise<Config> => {
  const extensions = ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs'];
  const configBaseName = 'typroof.config';
  const tsConfig = getTsconfig(path.join(cwd, 'tsconfig.json')) ?? {};

  for (const ext of extensions) {
    const filePath = path.join(cwd, `${configBaseName}${ext}`);
    if (fs.existsSync(filePath)) {
      if (ext === '.ts' || ext === '.mts' || ext === '.cts') {
        return await compileConfig({ filePath, tsConfig });
      } else {
        return ext === '.mjs' ? import(filePath) : require(filePath);
      }
    }
  }

  return {};
};

export const compileConfig = async ({
  filePath,
  tsConfig,
}: {
  filePath: string;
  tsConfig: object;
}): Promise<Config> => {
  const result = await esbuild.build({
    entryPoints: [filePath],
    bundle: true,
    platform: 'node',
    format: 'esm',
    tsconfigRaw: tsConfig,
    write: false,
  });

  const { outputFiles } = result;
  if (outputFiles && outputFiles.length > 0) {
    const code = outputFiles[0]!.text;
    const moduleUrl = `data:text/javascript;charset=utf-8,${encodeURIComponent(code)}`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return (await import(moduleUrl)).default;
  } else {
    throw new Error('No output from esbuild.');
  }
};
