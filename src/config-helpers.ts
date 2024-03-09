import fs from 'node:fs';
import path from 'node:path';

import esbuild from 'esbuild';
import { getTsconfig } from 'get-tsconfig';

import { registerAnalyzer } from './assertions/matcher';
import { omit } from './utils/object';

import type { Validator } from './assertions';
import type { Config } from './config';

export const loadConfig = async ({ cwd = process.cwd() }: { cwd?: string } = {}): Promise<
  Omit<Config, 'plugins'>
> => {
  const extensions = ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs'];
  const configBaseName = 'typroof.config';
  const tsConfig = getTsconfig(path.join(cwd, 'tsconfig.json')) ?? {};

  for (const ext of extensions) {
    const filePath = path.join(cwd, `${configBaseName}${ext}`);
    if (fs.existsSync(filePath)) {
      let config: Config;
      if (ext === '.ts' || ext === '.mts' || ext === '.cts')
        config = await compileConfig({ filePath, tsConfig });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      else if (ext === '.mjs') config = (await import(filePath)).default;
      else if (ext === '.cjs') config = require(filePath);
      else
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          config = (await import(filePath)).default;
        } catch (e) {
          config = require(filePath);
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
    const ext = path.extname(filePath);
    if (ext === '.mts')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return (await import(moduleUrl)).default;
    else if (ext === '.cts') return require(moduleUrl);
    else
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return (await import(moduleUrl)).default;
      } catch (e) {
        return require(moduleUrl);
      }
  } else {
    throw new Error('No output from esbuild.');
  }
};
