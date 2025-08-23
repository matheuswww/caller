import z from "zod"

export interface getFriends {
  last_user_cursor?: string
}

export const getFriendsRequestValidator = z.object({
  last_user_cursor: z.string()
    .min(1, { message: "user is required" })
    .max(20, { message: "user must be at most 20 characters long" })
    .optional(),
})