"use client";

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
import { Check, LoaderCircle } from "lucide-react";
import { ICON_SIZE } from "@/lib/utils";
import { useSetAvatar, useSetUsername } from "@/store/user";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import Spinner from "@/components/common/spinner/spinner";
import { LoginFormData } from "@/types/auth/auth.types";
import { authServices } from "@/services/auth/auth.services";
import { loginSchema } from "@/schema/auth/auth.schema";
import AuthFormContainer from "@/app/(auth)/_components/auth-form-container";

export default function LoginForm(): JSX.Element {
  const [success, setSuccess] = useState<boolean>(false);
  const [oAuthSubmitting, setOAuthSubmitting] = useState<boolean>(false);

  const setUsername = useSetUsername();
  const setUserAvatar = useSetAvatar();

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
    const m_data: LoginFormData = {
      email: formData.email,
      password: formData.password,
    };

    if (m_data) {
      const response = await authServices.login(m_data);

      if (!response) return; // do something when error logging in

      setSuccess(() => true);
      const isCookieSet = await setCookieValue({
        key: "lillyToken",
        value: response.data.token,
      });

      const isUserIdSet = await setCookieValue({
        key: "lillyUser",
        value: response.data.userId,
      });

      setUserAvatar(response.data.avatar);
      setUsername(response.data.userName);

      if (isCookieSet && isUserIdSet) router.push("/dashboard/workspace");
    }
  }

  async function handleOAuthLogin() {
    setOAuthSubmitting(true);

    const response = await authServices.oAuth();

    if (!response || !response.success) {
      console.error("Error with OaUTH RESponse");
      setOAuthSubmitting(false);
      return;
    }

    setOAuthSubmitting(false);
    router.push(`${response.data.googleAuthUrl}`);

    return;
  }

  return (
    <AuthFormContainer
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
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Sign up
        </Link>
      </div>
    </AuthFormContainer>
  );
}
