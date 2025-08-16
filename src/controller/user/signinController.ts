import type { Request, Response } from "express"
import signinService from "../../service/user/signinService.js"
import { signinValidator } from "../../validator/user/signin.js"
import response, { getErrors, type messages } from "../../response/response.js"
import z from "zod"
import { sendCookie } from "../../cookie/cookie.js"
import { UserInvalidPassword, UserNotFound } from "../../error/user/userError.js"

export default async function signinController(req: Request, res: Response) {
  console.log("Init signinController")
  try {
    const user = signinValidator.parse(req.body)
    const id = await signinService(user)
    console.log(`User logged with sucess! user id: ${id}`)
    sendCookie(res, id)
    res.status(200).send()
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg: messages = "validation error"
      const errors = getErrors(error.issues)
      console.log(msg)
      res.status(400).send(response(msg, 400, errors))
      return
    }
    if (error instanceof UserNotFound) {
      const msg: messages = "not found"
      console.log(msg)
      res.status(404).send(response(msg, 404, [{
        Field: "email",
        Message: "email not found"
      }]))
      return
    }
    if (error instanceof UserInvalidPassword) {
      const msg: messages = "bad request"
      console.log(msg)
      res.status(400).send(response(msg, 400, [{
        Field: "password",
        Message: "invalid password"
      }]))
      return
    }
    console.error(error)
    const msg: messages = "server error"
    res.status(500).send(response(msg, 500, null))
  }
}