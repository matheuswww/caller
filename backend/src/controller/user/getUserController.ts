import type { Request, Response } from "express"
import type { messages } from "../../response/response.js"
import response from "../../response/response.js"
import { validateCookie } from "../../cookie/cookie.js"
import getUserService from "../../service/user/getUserService.js"

export default async function getUserController(req: Request, res: Response) {
  try {
    const user_id = validateCookie(req)
    const user = await getUserService(user_id)
    res.status(200).send(user)
  } catch (error) { 
    console.error(error)
    const msg: messages = "server error"
    res.status(500).send(response(msg, 500, null))
  }
}