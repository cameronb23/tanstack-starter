import { createRequire } from 'module';
import path from 'path';
import { defineConfig } from '@tanstack/start/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { type App } from 'vinxi';

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

const startConfig = defineConfig({
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

const routers = startConfig.config.routers.map((r) => {
  return {
    ...r,
    middleware: r.target === 'server' ? './app/middleware.tsx' : undefined,
  };
});

const app: App = {
  ...startConfig,
  config: {
    ...startConfig.config,
    routers: routers,
  },
};

export default app;
