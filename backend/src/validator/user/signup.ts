import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const MAX_FILE_SIZE = 4 * 1024 * 1024 
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"]

export interface signupRequest {
  name: string
  user: string
  email: string
  password: string
  img: Express.Multer.File
}

export const signupValidator = z.object({
  name: z.string()
    .min(1, { message: "name is required" })
    .max(20, { message: "name must be at most 20 characters long" }),
  user: z.string()
    .min(1, { message: "user is required" })
    .max(20, { message: "user must be at most 20 characters long" }),
  email: z.string()
    .regex(emailRegex, { message: "Invalid email format" })
    .max(255, { message: "email must be at most 255 characters long" }),
  password: z.string()
    .min(6, { message: "password must be at least 6 characters long" })
    .max(60, { message: "password must be at most 60 characters long" }),
  img: z.any().superRefine((file, ctx) => {
    if (!file) {
      ctx.addIssue({ code: "custom", message: "No file uploaded" });
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
      ctx.addIssue({ code: "custom", message: "Invalid file type" });
    }
    if (file.size > MAX_FILE_SIZE) {
      ctx.addIssue({ code: "custom", message: "File too large" });
    }
  }),
})