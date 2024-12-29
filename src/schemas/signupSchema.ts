import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username should have minimum 2 characters")
  .max(20, "Username can have maximum 20 characters")
  .regex(/^[a-zA-Z][a-zA-Z0-9_]{2,19}$/, "Please enter a valid username");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid Email address" }),
  password: z.string().min(6, {message:"Password should contain minimum 6 characters"}),
});
