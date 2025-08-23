import z from "zod"

export interface updateNotificationRequest {
  id?: string
}

export const updateNotificationRequestValidator = z.object({
  id: z.string()
    .min(36, { message: "id is required" })
    .max(36, { message: "id must be at most 36 characters long" })
})