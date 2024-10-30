import { createServerFn } from '@tanstack/start';
import type { Session, User } from 'better-auth/types';
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import prisma from '@/db';
import type {
  SignInEmailInput,
  SignUpEmailInput,
} from '@/services/auth/schemas';
import { authSchemas } from '@/services/auth/schemas';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { getEvent } from 'vinxi/http';

const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
  },
  // Uncomment below line to enable Redis for caching sessions and ratelimiting
  // secondaryStorage: redisSecondaryStorage
});

type InferAuthApi<API extends keyof typeof auth.api> =
  API extends keyof typeof auth.api
    ? Parameters<(typeof auth.api)[API]>[0]
    : never;

type Auth =
  | { isAuthenticated: false; user: null; session: null }
  | { isAuthenticated: true; user: User; session: Session };

const authKeys = {
  auth: () => ['auth'],
};

const getAuthQueryOptions = () => {
  return queryOptions({
    queryKey: authKeys.auth(),
    queryFn: () => getAuth(),
  });
};

const useAuthQuery = () => useSuspenseQuery(getAuthQueryOptions());

const useInvalidateAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries(getAuthQueryOptions());
    await router.invalidate();
  };
};

const getAuth = createServerFn('GET', async (): Promise<Auth> => {
  const event = getEvent();
  return event.context.auth;
});

const signUpEmail = createServerFn(
  'POST',
  async (input: SignUpEmailInput, ctx) => {
    return await auth.api.signUpEmail({
      headers: ctx.request.headers,
      body: input,
      asResponse: true,
    });
  },
);

const signInEmail = createServerFn(
  'POST',
  async (input: SignInEmailInput, ctx) => {
    return await auth.api.signInEmail({
      headers: ctx.request.headers,
      body: input,
      asResponse: true,
    });
  },
);

const signOut = createServerFn('POST', async (_, ctx) => {
  return await auth.api.signOut({
    headers: ctx.request.headers,
    asResponse: true,
  });
});

const useSignUpMutation = () => {
  const invalidateAuth = useInvalidateAuth();

  return useMutation({
    mutationFn: signUpEmail,
    onSuccess: invalidateAuth,
  });
};

const useSignInMutation = () => {
  const invalidateAuth = useInvalidateAuth();

  return useMutation({
    mutationFn: signInEmail,
    onSuccess: invalidateAuth,
  });
};

const useSignOutMutation = () => {
  const invalidateAuth = useInvalidateAuth();

  return useMutation({
    mutationFn: signOut,
    onSuccess: invalidateAuth,
  });
};

export {
  auth,
  authSchemas,
  getAuth,
  getAuthQueryOptions,
  useAuthQuery,
  useInvalidateAuth,
  useSignInMutation,
  useSignOutMutation,
  useSignUpMutation,
};
export type { Auth, InferAuthApi };
