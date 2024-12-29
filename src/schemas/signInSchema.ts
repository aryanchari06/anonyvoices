import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string().trim(), //identifier: username/email
  password: z.string(),
});
