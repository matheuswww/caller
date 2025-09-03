import getUserRepository from "../../repository/user/getUserRepository.js";
import type { getUserResponse } from "../../response/user/getUserResponse.js";

export default async function getUserService(user_id: string): Promise<getUserResponse> {
  return await getUserRepository(user_id)
}