import addFriendRepository from "../../repository/friend/addFriendRepository.js"

export default async function addFriendService(user_id: string, friend: string) {
  console.log("Init addFriendService")
  await addFriendRepository(user_id, friend);
}