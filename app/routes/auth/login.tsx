import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authSchemas, useSignInMutation } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Alert } from '@/components/ui/alert';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { Link } from '@tanstack/react-router';

function Login() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { mutateAsync } = useSignInMutation();
  const form = useForm<z.infer<typeof authSchemas.signIn>>({
    resolver: zodResolver(authSchemas.signIn),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const signUpPromise = mutateAsync(data, {
      onSuccess: () => {
        router.navigate({ to: '/' });
      },
      onError: () => {},
    });

    toast.promise(signUpPromise, {
      loading: 'Signing in...',
      error: 'Failed to sign in',
    });

    try {
      await signUpPromise;
    } catch (error) {
      try {
        if (!(error instanceof Error)) throw new Error('Unknown error');
        const parsedError = JSON.parse(error.message);
        setError(parsedError.body.body.message);
      } catch (e) {
        setError('Failed to sign in');
      }
    }
  });

  return (
    <div className="container flex flex-col h-screen space-y-6 justify-center items-center">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2 pl-2">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <span className="text-sm text-muted-foreground">
            Sign back into your account
          </span>
        </div>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <Card className="w-full md:w-[36rem] justify-self-center pt-6">
              <CardContent className="grid gap-4">
                {error && <Alert variant="destructive">{error}</Alert>}
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="john@datalog.io"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Sign in</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
        <Button asChild className="w-min self-center" variant="ghost">
          <Link to="/auth/register">
            New here? Get started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/auth/login')({
  component: Login,
});
