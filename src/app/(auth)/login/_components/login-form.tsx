"use client";

import AuthFormLayout from "@/app/(auth)/_components/auth-form-layout";
import { loginSchema } from "@/app/(auth)/login/_schema/login-schema";
import PasswordInput from "@/components/common/input-elements/password-input";
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
import { setCookieValue } from "@/lib/cookies/cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { AXIOS_CLIENT } from "@/lib/api/client/axios.client";
import { Check, LoaderCircle } from "lucide-react";
import { ICON_SIZE } from "@/lib/utils";

type Data = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
};

export default function LoginForm(): JSX.Element {
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const isSubmitting = form.formState.isSubmitting;

  const submitted = form.formState.isSubmitted;

  async function handleLogin(
    formData: z.infer<typeof loginSchema>
  ): Promise<void> {
    const m_data: Data = {
      email: formData.email,
      password: formData.password,
    };

    if (m_data) {
      const response = await AXIOS_CLIENT.post<Data, LoginResponse>(
        "/auth/login",
        m_data,
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      if (!response) return;

      if (!response.success) {
        // do something when there is an error;
        return;
      }

      setSuccess(() => true);

      const isCookieSet = await setCookieValue({
        key: "lillyToken",
        value: response.data.token,
      });

      if (isCookieSet) router.push("/dashboard/workspace");
    }
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
            <Button
              disabled={isSubmitting || success}
              type="submit"
              className={`w-full ${isSubmitting && "animate-pulse"}`}
            >
              {isSubmitting && !submitted && !success && (
                <LoaderCircle className={`${ICON_SIZE.medium} animate-spin`} />
              )}
              {!isSubmitting && !submitted && "Login"}
              {!isSubmitting && submitted && success && (
                <Check className={ICON_SIZE.medium} />
              )}
              {/* todo: need to re-work the login handling */}
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </AuthFormLayout>
  );
}
