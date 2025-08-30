import { z } from 'zod';

export interface searchUserRequest {
  user: string
}

export const searchUserValidator = z.object({
  user: z.string()
    .min(1, { message: "user is required" })
    .max(20, { message: "user must be at most 20 characters long" }),
})