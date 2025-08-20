import type { Request, Response } from "express"
import addFriendService from "../../service/friend/addFriendService.js"
import { addFriendValidator } from "../../validator/friend/addFriend.js"
import { validateCookie } from "../../cookie/cookie.js"
import z from "zod"
import response, { getErrors, type messages } from "../../response/response.js"
import { CookieError } from "../../cookie/cookie-customError.js"
import { UserNotFound } from "../../error/user/userError.js"
import { AlreadyFriends, AlreadySent, SelfFriendError } from "../../error/friend/friendError.js"

export default async function addFriendController(req: Request, res: Response) {
  console.log("Init addFriendController")
  try {
    const user_id = validateCookie(req)
    const friend = addFriendValidator.parse(req.body)
    await addFriendService(user_id, friend.friend)
    res.status(201).send()
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
    if (error instanceof UserNotFound) {
      const msg: messages = "user not found"
      console.log(msg)
      res.status(404).send(response(msg, 404, null))
      return
    }
    if (error instanceof SelfFriendError) {
      const msg: messages = "you cannot be your friend"
      console.log(msg)
      res.status(400).send(response(msg, 400, null))
      return
    }
    if (error instanceof AlreadyFriends) {
      const msg: messages = "you are already friends"
      console.log(msg)
      res.status(400).send(response(msg, 400, null))
      return
    }
    if (error instanceof AlreadySent) {
      const msg: messages = "friend request already sent"
      console.log(msg)
      res.status(400).send(response(msg, 400, null))
      return
    }
    console.error(error)
    const msg: messages = "server error"
    res.status(500).send(response(msg, 500, null))
  }
}