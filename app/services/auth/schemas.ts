import { z } from 'zod';

const signUpEmailSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

type SignUpEmailInput = z.infer<typeof signUpEmailSchema>;

const signInEmailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type SignInEmailInput = z.infer<typeof signInEmailSchema>;

const authSchemas = {
  signUp: signUpEmailSchema,
  signIn: signInEmailSchema,
};

export type { SignUpEmailInput, SignInEmailInput };
export { authSchemas };
