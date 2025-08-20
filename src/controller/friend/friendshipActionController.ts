import type { Request, Response } from "express"
import { validateCookie } from "../../cookie/cookie.js"
import { friendshipActionValidator } from "../../validator/friend/friendshipAction.js"
import friendshipActionService from "../../service/friend/addFriendshipActionService.js"
import z from "zod"
import response, { getErrors, type messages } from "../../response/response.js"
import { CookieError } from "../../cookie/cookie-customError.js"
import { FriendshipNotFoundError } from "../../error/friend/friendError.js"

export default async function friendShipActionController(req: Request, res: Response) {
  try {
    const user_id = validateCookie(req)
    const data = friendshipActionValidator.parse(req.body)
    await friendshipActionService(user_id, data.friend_id, data.action)
    console.log("")
    res.status(200).send()
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg: messages = "validation error"
      const errors = getErrors(error.issues)
      console.log(msg)
      res.status(400).send(response(msg, 400, errors))
      return
    }
    if (error instanceof CookieError) {
      const msg: messages = "invalid cookie"
      console.log(msg)
      res.status(401).send(response(msg, 401, null))
      return
    }
    if (error instanceof FriendshipNotFoundError) {
      const msg: messages = "friendship not found"
      console.log(msg)
      res.status(400).send(response(msg, 400, null))
      return
    }
    console.error(error)
    const msg: messages = "server error"
    res.status(500).send(response(msg, 500, null))
  }
  
}