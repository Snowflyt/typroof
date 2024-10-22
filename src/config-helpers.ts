import fs from 'node:fs';
import path from 'node:path';

import esbuild from 'esbuild';
import { getTsconfig } from 'get-tsconfig';

import { registerAnalyzer } from './assertions/matcher';
import { omit } from './utils/object';

import type { Validator } from './assertions';
import type { Config } from './config';

const CONFIG_BASE_NAME = 'typroof.config';
const SUPPORTED_EXTENSIONS = ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs'];

export const loadConfig = async ({
  configPath,
  cwd = process.cwd(),
}: { cwd?: string; configPath?: string } = {}): Promise<Omit<Config, 'plugins'>> => {
  const candidatePaths =
    configPath ?
      [path.join(cwd, configPath)]
    : SUPPORTED_EXTENSIONS.map((ext) => path.join(cwd, `${CONFIG_BASE_NAME}${ext}`));
  const tsConfig = getTsconfig(path.join(cwd, 'tsconfig.json')) ?? {};

  for (const configPath of candidatePaths) {
    const ext = path.extname(configPath);
    if (fs.existsSync(configPath)) {
      let config: Config;
      if (ext === '.ts' || ext === '.mts' || ext === '.cts')
        config = await compileConfig({ configPath, tsConfig });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      else if (ext === '.mjs') config = (await import(configPath)).default;
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      else if (ext === '.cjs') config = require(configPath);
      else
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          config = (await import(configPath)).default;
        } catch (e) {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          config = require(configPath);
        }

      if (config.plugins) {
        for (const plugin of config.plugins) {
          if (plugin.analyzers)
            for (const [key, analyzer] of Object.entries(plugin.analyzers))
              registerAnalyzer(key as keyof Validator<unknown, unknown>, analyzer);
        }

        return omit(config, 'plugins');
      }

      return config;
    }
  }

  return {};
};

export const compileConfig = async ({
  configPath,
  tsConfig,
}: {
  configPath: string;
  tsConfig: object;
}): Promise<Config> => {
  const result = await esbuild.build({
    entryPoints: [configPath],
    bundle: true,
    platform: 'node',
    format: 'esm',
    tsconfigRaw: tsConfig,
    write: false,
  });

  const { outputFiles } = result;
  if (outputFiles && outputFiles.length > 0) {
    const code = outputFiles[0]!.text;
    const encodedCode = encodeURIComponent(code);
    const moduleUrl = `data:text/javascript;charset=utf-8,${encodedCode}`;
    const ext = path.extname(configPath);
    if (ext === '.mts')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return (await import(moduleUrl)).default;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    else if (ext === '.cts') return require(moduleUrl);
    else
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return (await import(moduleUrl)).default;
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require(moduleUrl);
      }
  } else {
    throw new Error('No output from esbuild.');
  }
};
