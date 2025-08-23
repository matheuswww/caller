import z from "zod"

export interface addFriendRequest {
  friend: string
}

export const addFriendValidator = z.object({
  friend: z.string()
    .min(1, { message: "user is required" })
    .max(20, { message: "user must be at most 20 characters long" }),
})