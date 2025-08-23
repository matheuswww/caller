import type { Request, Response } from "express";
import { validateCookie } from "../../cookie/cookie.js";
import getFriendsService from "../../service/friend/getFriendsService.js";
import { CookieError } from "../../cookie/cookie-customError.js";
import type { messages } from "../../response/response.js";
import response, { getErrors } from "../../response/response.js";
import { getFriendsRequestValidator } from "../../validator/friend/getFriends.js";
import z from "zod";

export default async function getFriendsController(req: Request, res: Response) {
  console.log("Init getFriendsController")
  try {
    const user_id = validateCookie(req)
    const lastUserCursor = req.query["last_user_cursor"];
    const getFriendsRequest = getFriendsRequestValidator.parse({
      last_user_cursor: lastUserCursor ?? undefined
    })
    const getFriends = await getFriendsService(user_id, getFriendsRequest.last_user_cursor)
    if (getFriends.friends.length == 0 && getFriends.requests.length == 0) {
      res.status(404).send()
      return
    }
    res.status(200).send(getFriends)
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
    console.error(error)
    const msg: messages = "server error"
    res.status(500).send(response(msg, 500, null))
  }
}