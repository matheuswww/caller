import getFriendsRepository from "../../repository/friend/getFriendsRepository.js";
import type getFriendsResponse from "../../response/friends/getFriends/getFriends.js";

export default async function getFriendsService(user_id: string, last_user_cursor?: string): Promise<getFriendsResponse> {
  console.log("Init getFriendsService")
  return await getFriendsRepository(user_id, last_user_cursor)
}