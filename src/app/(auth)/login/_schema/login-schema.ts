import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(4, { message: "Email is required" }).email({ message: "Enter valid email" }),
    password: z.string().min(8, { message: "Minimum 8 characters" })
});