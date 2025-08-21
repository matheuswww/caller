import type { Request, Response } from "express";
import { validateCookie } from "../../cookie/cookie.js";
import { updateNotificationRequestValidator } from "../../validator/notification/updateNotificationStatus.js";
import updateNotificationsStatusService from "../../service/notification/ updateNotificatonStatusService.js";
import z from "zod";
import response, { getErrors, type messages } from "../../response/response.js";
import { CookieError } from "../../cookie/cookie-customError.js";

export default async function UpdateNotificationStatusController(req: Request, res: Response) {
  console.log("Init UpdateNotificationStatusController")
  try {
    const user_id = validateCookie(req)
    const updateNotificationRequest = updateNotificationRequestValidator.parse(req.body)
    await updateNotificationsStatusService(user_id, updateNotificationRequest.id)
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
    console.error(error)
    const msg: messages = "server error"
    res.status(500).send(response(msg, 500, null))
  }
}