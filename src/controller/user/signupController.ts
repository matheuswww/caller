import type { Request, Response } from 'express';
import signupService from '../../service/user/signupService.js';
import { signupValidator } from '../../validator/user/signup.js';
import { z } from 'zod';
import response, { getErrors, type messages } from '../../response/response.js';

export default async function signupController(req: Request, res: Response) {
  console.log("Init signupController")
  try {
    const user = signupValidator.parse(req.body);    
    const id = await signupService(user)
    res.status(201).send()
    console.log(`User created with sucess! user id: ${id}`)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg: messages = "validation error"
      const errors = getErrors(error.issues)
      res.status(400).send(response(msg, 400, errors))
      return
    }
    console.error(error)
    const msg: messages = "server error"
    res.status(500).send(response(msg, 500, null))
  }
}