import { z } from 'zod';

export const userSignUpSchema = z.object({
  password: z.string(),
  username: z.string().min(3),
  email: z.string().email(),
});
export const userSignInSchema = z.object({
  password: z.string(),
  email: z.string().email(),
});
