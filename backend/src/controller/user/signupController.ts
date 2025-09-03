import type { Request, Response } from 'express';
import signupService from '../../service/user/signupService.js';
import { signupValidator } from '../../validator/user/signup.js';
import { z } from 'zod';
import response, { getErrors, type messages } from '../../response/response.js';
import { sendCookie } from '../../cookie/cookie.js';
import { ConflictEmailError, ConflictUserError } from '../../error/user/userError.js';
import path from 'path';
import fs from 'fs'

export default async function signupController(req: Request, res: Response) {
  console.log("Init signupController")
  try {
    const data = {
      ...req.body,
      img: req.file 
    }
    const user = signupValidator.parse(data)  
    const id = await signupService(user, saveImg)
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
      const msg: messages = "email already exists"
      console.log(msg)
      res.status(409).send(response(msg, 409, null))
      return
    }
    if (error instanceof ConflictUserError) {
      const msg: messages = "user already exists"
      console.log(msg)
      res.status(409).send(response(msg, 409, null))
      return
    }
    console.error(error)
    const msg: messages = "server error"
    res.status(500).send(response(msg, 500, null))
  }
}

function saveImg(id: string, img: Express.Multer.File) {
  if (!img.buffer) {
    throw new Error("File buffer is missing");
  }

  const IMG_FOLDER = path.join(process.cwd(), "img"); 
  const ext = path.extname(img.originalname);
  const filename = `${id}${ext}`;
  const filepath = path.join(IMG_FOLDER, filename);

  fs.writeFileSync(filepath, img.buffer);

  return filename;
}