'use client';
import { useState, useTransition } from 'react';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Loader2, LockIcon, UserIcon } from 'lucide-react';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import FormErrorMessage from '@/components/form-error';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FormSucessMessage from '@/components/form-success';
import { adminLoginFormSchema } from '@/lib/form-schema';
import { useRouter } from 'next/navigation';
import { login } from '@/app/action/login';

const Login = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSucess] = useState<string | undefined>('');
  const [isPending, setTransition] = useTransition();

  const router = useRouter();

  const form = useForm<z.infer<typeof adminLoginFormSchema>>({
    resolver: zodResolver(adminLoginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  /**
   * Handle form submission.
   * @param values - The form values.
   *
   * This function will call the `login` server action with the form values and then
   * set the `error` and `success` state variables with the server action's response.
   */
  const onSubmit = (values: z.infer<typeof adminLoginFormSchema>) => {
    setError('');
    setTransition(() => {
      login(values).then((data) => {
        setError(data?.error);
        setSucess(data?.success);

        if (data?.success) {
          router.push('/dashboard');
        }
      });
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto flex flex-col justify-center p-6 bg-white rounded gab-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-start items-center">
            <Image
              src="/logo.png"
              alt="dfcu logo"
              width={80}
              height={80}
              priority
            />
          </div>
          <div className="flex flex-col gap-4 mt-3">
            <div className="flex flex-col justify-start items-start">
              <h2 className="text-sm font-bold">Admin Login</h2>
              <small>Welcome back!</small>
            </div>
            <hr className="border-neutral-100" />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              disabled={isPending}
                              placeholder="Username"
                              {...field}
                              className="pl-8"
                            />
                            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              disabled={isPending}
                              type="password"
                              placeholder="Password"
                              {...field}
                              className="pl-8"
                            />
                            <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormErrorMessage message={error} />
                  <FormSucessMessage message={success} />

                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Admin Login'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <Button onClick={() => router.back()} variant="link" className="group">
          <ArrowLeft className="w-8 h-4 transition duration-300 ease-in-out group-hover:translate-x-1" />{' '}
          Back to home
        </Button>
      </div>
    </div>
  );
};
export default Login;
