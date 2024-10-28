import { createRequire } from 'module';
import path from 'path';
import { defineConfig } from '@tanstack/start/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const require = createRequire(import.meta.url);
const prismaClientDirectory = path.normalize(
  path.relative(
    process.cwd(),
    require
      .resolve('@prisma/client')
      .replace(/@prisma(\/|\\)client(\/|\\).*/, '.prisma/client'),
  ),
);
const prismaIndexBrowserPath = path.join(
  prismaClientDirectory,
  'index-browser.js',
);

export default defineConfig({
  server: {
    preset: 'vercel',
  },
  vite: {
    plugins: [tsconfigPaths({ projects: ['./tsconfig.json'] })],
    resolve: {
      alias: {
        '.prisma/client/index-browser': prismaIndexBrowserPath,
      },
    },
  },
});
