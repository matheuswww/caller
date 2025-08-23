
import type { Request, Response } from "express";
import { validateCookie } from "../../cookie/cookie.js";
import getNotificationsService from "../../service/notification/getNotificationsService.js";
import { CookieError } from "../../cookie/cookie-customError.js";
import type { messages } from "../../response/response.js";
import response from "../../response/response.js";

export default async function getNotificationsController(req: Request, res: Response) {
  console.log("Init getNotificationsController")
  try {
    const user_id = validateCookie(req)
    const notifications = await getNotificationsService(user_id)
    if (notifications.length == 0) {
      res.status(404).send()
      return
    }
    res.status(200).send(notifications)
  } catch (error) {
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