import z from "zod"

export interface friendShipAction {
  friend_id: string
}

export const friendshipActionValidator = z.object({
  friend_id: z.string()
    .min(1, { message: "friend_id is required" })
    .max(36, { message: "friend_id must be at most 36 characters long" }),
  action: z.enum(["accept", "reject", "delete"], {
    message: "invalid action. Must be one of: accept, reject, or delete."
  })
})