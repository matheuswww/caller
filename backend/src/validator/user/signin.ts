import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface signinRequest {
  email: string
  password: string
}

export const signinValidator = z.object({
  email: z.string()
    .regex(emailRegex, { message: "Invalid email format" })
    .max(255, { message: "Email must be at most 255 characters long" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(60, { message: "Password must be at most 60 characters long" }),
})