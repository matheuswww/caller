import signupRepository from "../../repository/user/signupRepository.js"
import type { signupRequest } from "../../validator/user/signup.js"

export default async function signupService(user: signupRequest): Promise<string> {
  console.log("Init signupService")
  return await signupRepository(user)
}