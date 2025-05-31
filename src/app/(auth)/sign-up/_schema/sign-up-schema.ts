import { z } from "zod";

export const signUpSchema = z.object({
    email: z.string().min(3, { message: "Email is required" }).email(),
    userName: z.string().min(4, { message: "Minimum 4 characters required" }),
    password: z.string().min(8, { message: "Minimum 8 characters required" }),
    confirmPassword: z.string().min(8, { message: "Minimum 8 characters required" }) 
})
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"]
    })