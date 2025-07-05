"use client";

import AuthFormLayout from "@/app/(auth)/_components/auth-form-layout";
import { signUpSchema } from "@/app/(auth)/sign-up/_schema/sign-up-schema";
import InputRow from "@/components/common/input-elements/input-row";
import PasswordInput from "@/components/common/input-elements/password-input";
import Spinner from "@/components/common/spinner/spinner";
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
import { AXIOS_CLIENT } from "@/lib/api/client/axios.client";
import { setCookie } from "@/lib/cookies/cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { JSX } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

type Response = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: Record<string, string | number | unknown>;
  };
};

type Data = {
  userName: string;
  password: string;
  email: string;
};

export default function SignupForm(): JSX.Element {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();
  const isSubmitting = form.formState.isSubmitting;

  async function handleSignUp(
    formData: z.infer<typeof signUpSchema>
  ): Promise<void> {
    const m_data: Data = {
      userName: formData.userName,
      password: formData.password,
      email: formData.email,
    };

    const response = await AXIOS_CLIENT.post<Data, Response>(
      "/auth/sign-up",
      m_data,
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    if (!response) return;

    if (!response.success) {
      return;
    }

    const storeCookie = await setCookie(response.data.token);

    if (storeCookie) {
      form.reset();
      setTimeout(() => router.push("/dashboard/workspace"), 3500);
    }
  }

  return (
    <AuthFormLayout
      title="Sign up"
      description="A gentle companion, inspired by a little soul full of love."
    >
      <Form {...form}>
        <form
          className="space-y-6 w-full"
          onSubmit={form.handleSubmit(handleSignUp)}
        >
          <InputRow>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
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
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User name*</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      {...field}
                      type="text"
                      placeholder="JohnDoe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </InputRow>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password*</FormLabel>
                <FormControl>
                  <PasswordInput onChange={(e) => field.onChange(e)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password*</FormLabel>
                <FormControl>
                  <PasswordInput
                    disabled={isSubmitting}
                    onChange={(e) => field.onChange(e)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Spinner /> : "Sign up"}
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </AuthFormLayout>
  );
}
