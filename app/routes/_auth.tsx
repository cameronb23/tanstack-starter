import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { zodSearchValidator } from '@tanstack/router-zod-adapter';
import { z } from 'zod';

function AuthLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export const Route = createFileRoute('/_auth')({
  validateSearch: zodSearchValidator(
    z.object({
      callbackUrl: z.string().default('/'),
    }),
  ),
  beforeLoad: async ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        code: 302,
        to: search.callbackUrl,
      });
    }
  },
  component: AuthLayout,
});
