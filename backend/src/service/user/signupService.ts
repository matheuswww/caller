import signupRepository from "../../repository/user/signupRepository.js"
import type { signupRequest } from "../../validator/user/signup.js"

export default async function signupService(user: signupRequest, saveImg: (id: string, img: Express.Multer.File) => void): Promise<string> {
  console.log("Init signupService")
  return await signupRepository(user, saveImg)
}