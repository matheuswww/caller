import type { Request, Response } from 'express';
import signupService from '../../service/user/signupService.js';
import { signupValidator } from '../../validator/user/signup.js';
import { z } from 'zod';
import response, { getErrors, type messages } from '../../response/response.js';
import { sendCookie } from '../../cookie/cookie.js';
import { ConflictEmailError, ConflictUserError } from '../../error/user/userError.js';

export default async function signupController(req: Request, res: Response) {
  console.log("Init signupController")
  try {
    const user = signupValidator.parse(req.body);    
    const id = await signupService(user)
    console.log(`User created with sucess! user id: ${id}`)
    sendCookie(res, id)
    res.status(201).send()
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg: messages = "validation error"
      console.log(msg)
      const errors = getErrors(error.issues)
      console.log(msg)
      res.status(400).send(response(msg, 400, errors))
      return
    }
    if (error instanceof ConflictEmailError) {
      const msg: messages = "conflict error"
      console.log(msg)
      res.status(409).send(response(msg, 409, [{
        Field: "email",
        Message: "email already exists"
      }]))
      return
    }
    if (error instanceof ConflictUserError) {
      const msg: messages = "conflict error"
      console.log(msg)
      res.status(409).send(response(msg, 409, [{
        Field: "user",
        Message: "user already exists"
      }]))
      return
    }
    console.error(error)
    const msg: messages = "server error"
    res.status(500).send(response(msg, 500, null))
  }
}