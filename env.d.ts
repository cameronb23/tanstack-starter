import type { Auth } from '@/lib/auth/types';

declare module 'vinxi/http' {
  interface H3EventContext {
    auth: Auth;
  }
}
