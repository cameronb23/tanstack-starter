import type { ReactNode } from 'react';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { Outlet, ScrollRestoration } from '@tanstack/react-router';
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import type { QueryClient } from '@tanstack/react-query';
import { getAuthQueryOptions } from '@/services/auth';

import globalCss from '@/styles/globals.css?url';
import geist from 'non.geist?url';
import geistMono from 'non.geist/mono?url';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  meta: () => [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      title: 'TanStack Start Starter',
    },
  ],
  component: RootComponent,
  links: () => [
    { rel: 'stylesheet', href: globalCss },
    { rel: 'stylesheet', href: geist },
    { rel: 'stylesheet', href: geistMono },
  ],
  scripts: () =>
    import.meta.env.DEV
      ? [
          {
            type: 'module',
            children: `import RefreshRuntime from "/_build/@react-refresh";
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type`,
          },
        ]
      : [],
  beforeLoad: async ({ context }) => {
    const auth = await context.queryClient.ensureQueryData(
      getAuthQueryOptions(),
    );

    return { auth };
  },
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
