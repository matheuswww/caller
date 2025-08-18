import friendshipActionRepository from "../../repository/friend/friendshipActionRepository.js";

export default async function friendshipActionService(user1_id: string, user2_id: string, action: "accept" | "reject" | "delete") {
  console.log("Init friendshipActionService")
  await friendshipActionRepository(user1_id, user2_id, action);
}