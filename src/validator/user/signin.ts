import z from "zod"

export interface signinRequest {
  email: string
  password: string
}

export const signinValidator = z.object({
  email: z.string()
    .max(255, { message: "Email must be at most 255 characters long" }),
  password: z.string()
    .max(60, { message: "Password must be at most 60 characters long" }),
})