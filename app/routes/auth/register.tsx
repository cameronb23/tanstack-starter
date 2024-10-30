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
import { authSchemas, useSignUpMutation } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

function Register() {
  const router = useRouter();
  const { mutateAsync } = useSignUpMutation();
  const form = useForm<z.infer<typeof authSchemas.signUp>>({
    resolver: zodResolver(authSchemas.signUp),
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const signUpPromise = mutateAsync(data, {
      onSuccess: () => {
        router.navigate({ to: '/' });
      },
    });

    toast.promise(signUpPromise, {
      loading: 'Creating account...',
      success: 'Account created successfully',
      error: 'Failed to create account',
    });

    await signUpPromise;
  });

  return (
    <div className="container flex flex-col space-y-6 justify-center items-center h-screen">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2 pl-2">
          <h1 className="text-2xl font-semibold">Get started on My app</h1>
          <span className="text-sm text-muted-foreground">
            The fastest way to kickstart your TanStack application.
          </span>
        </div>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <Card className="w-full md:w-[36rem] justify-self-center pt-6">
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="John Doe" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                <Button className="w-full">Create account</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>

        <Button asChild className="w-min self-center" variant="ghost">
          <Link to="/auth/login">
            Already have an account?
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/auth/register')({
  component: Register,
});
