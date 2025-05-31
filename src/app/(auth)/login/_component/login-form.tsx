"use client";

import AuthFormLayout from "@/app/(auth)/_component/auth-form-layout";
import { loginSchema } from "@/app/(auth)/login/_schema/login-schema";
import PasswordInput from "@/components/common/input/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSX } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


export default function LoginForm(): JSX.Element {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(
    formData: z.infer<typeof loginSchema>
  ): Promise<void> {
    console.log(formData);
  }

  return (
    <AuthFormLayout
        title="Login"
        description="A gentle companion, inspired by a little soul full of love."
    >
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(handleLogin)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="johndoe@gmail.com"
                  />
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
                <FormControl className="relative">
                  <PasswordInput
                    placeholder="******"
                    onChange={(e) => field.onChange(e)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
      </Form>
    </AuthFormLayout>
  );
}
