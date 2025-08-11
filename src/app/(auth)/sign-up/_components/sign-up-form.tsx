"use client";

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
import { setCookieValue } from "@/lib/cookies/cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useSetUsername } from "@/store/user";
import { Separator } from "@/components/ui/separator";
import { ENV } from "@/lib/config/env.config";
import axios from "axios";
import AuthFormContainer from "@/app/(auth)/_components/auth-form-container";
import { signUpSchema } from "@/schema/auth/auth.schema";
import { OAuthResponse, SignUpFormData } from "@/types/auth/auth.types";
import { authServices } from "@/services/auth/auth.services";


export default function SignupForm(): JSX.Element {
  const [oAuthSubmitting, setOAuthSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const setUsername = useSetUsername();

  const router = useRouter();
  const isSubmitting = form.formState.isSubmitting;

  async function handleSignUp(
    formData: z.infer<typeof signUpSchema>
  ): Promise<void> {
    const m_data: SignUpFormData = {
      userName: formData.userName,
      password: formData.password,
      email: formData.email,
    };

    const response = await authServices.signUp(m_data);


    if (!response || !response.success) return; // todo: handle error

    const isCookieSet = await setCookieValue({
      key: "lillyToken",
      value: response.data.token,
    });

    const isUserIdSet = await setCookieValue({
      key: "lillyUser",
      value: response.data.user.userId,
    });

    setUsername(response.data.user.userName);

    if (isCookieSet && isUserIdSet) {
      form.reset();
      setTimeout(() => router.push("/dashboard/workspace"), 3500);
    }
  }

  async function handleOAuthLogin() {
    setOAuthSubmitting(true);

    const response = (await axios.get<OAuthResponse>(`${ENV.BASE_ENDPOINT}/`))
      .data;

    if (!response.success) {
      console.error("Error with OaUTH RESponse");
      setOAuthSubmitting(false);
      return;
    }

    router.push(`${response.data.googleAuthUrl}`);
    setOAuthSubmitting(false);

    return;
  }

  return (
    <AuthFormContainer
      title="Sign up"
      description="A gentle companion, inspired by a little soul full of love."
    >
      <Form {...form}>
        <form
          className="space-y-5 w-full"
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
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-x-4 w-full">
          <Separator className="!w-[34%]" />
          <p className="text-xs text-muted-foreground">or</p>
          <Separator className="!w-[34%]" />
        </div>
        <Button
          disabled={oAuthSubmitting}
          onClick={handleOAuthLogin}
          className="w-full"
          variant="outline"
        >
          {oAuthSubmitting ? <Spinner /> : <FcGoogle />}
        </Button>
      </div>
      <div className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Login
        </Link>
      </div>
    </AuthFormContainer>
  );
}
