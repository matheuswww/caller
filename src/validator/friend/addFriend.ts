import z from "zod"

export interface addFriendRequest {
  friend: string
}

export const addFriendValidator = z.object({
  friend: z.string()
    .min(1, { message: "User is required" })
    .max(20, { message: "User must be at most 20 characters long" }),
})