"use client";

import AuthFormLayout from "@/app/(auth)/_component/auth-form-layout";
import { loginSchema } from "@/app/(auth)/login/_schema/login-schema";
import PasswordInput from "@/components/common/input/password-input";
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
import { AXIOS } from "@/lib/api/axios";
import { setCookieValue } from "@/lib/cookies/cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { JSX } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FaCheck } from "react-icons/fa";

type Data = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
  }
}

export default function LoginForm(): JSX.Element {

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
      password: formData.password
    };

    if(m_data) {

      const response = await AXIOS.post<Data, LoginResponse>("/auth/login", m_data, {
        headers: {
          "Content-type": "application/json"
        }
      });

      if(!response.success) {
        toast.error(response.message);
        return; 
      }

      toast.success(response.message);

      const isCookieSet = await setCookieValue({
        key: "lillyToken",
        value: response.data.token
      });

      if(isCookieSet) router.push("/dashboard/workspace");

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
            <Button type="submit" className="w-full">
              {isSubmitting && !submitted && (
                <Spinner />
              )}
              {!isSubmitting && !submitted && (
                "Login"
              )}
              {!isSubmitting && submitted && (
                <FaCheck />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </AuthFormLayout>
  );
}
