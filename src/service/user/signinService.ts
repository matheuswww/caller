import signinRepository from "../../repository/user/signinRepository.js";
import type { signinRequest } from "../../validator/user/signin.js";

export default async function signinService(user: signinRequest): Promise<string> {
  console.log("Init signinService")
  return await signinRepository(user)
}