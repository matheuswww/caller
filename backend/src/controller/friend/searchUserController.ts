import type { Request, Response } from "express"
import type { messages } from "../../response/response.js"
import response, { getErrors } from "../../response/response.js"
import z from "zod"
import SearchUserService from "../../service/user/searchUserService.js"
import { searchUserValidator } from "../../validator/user/searchUser.js"

export default async function searchUserController(req: Request, res: Response) {
  console.log("Init searchUserController")
  try {
   const user = req.query["user"];
    const userRequest = searchUserValidator.parse({
      user,
    })
    const userResponse = await SearchUserService(userRequest.user)
    if(userResponse.length == 0) {
      res.status(404).send()
      return
    }
    res.status(200).send(userResponse)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg: messages = "validation error"
      const errors = getErrors(error.issues)
      console.log(msg)
      res.status(400).send(response(msg, 400, errors))
      return
    }
    console.log(error)
    const msg: messages = "server error"
    res.status(500).send(response(msg, 500, null))
  }
}