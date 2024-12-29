import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content needs to be of minimun 10 characters" })
    .max(200, "Content cannot exceed 200 characters"),
});
