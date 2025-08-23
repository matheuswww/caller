import SearchUserRepository from "../../repository/user/searchUserRepository.js";
import type { searchUserResponse } from "../../response/user/searchUser.js";

export default async function SearchUserService(user: string): Promise<searchUserResponse[]> {
  return await SearchUserRepository(user)
}