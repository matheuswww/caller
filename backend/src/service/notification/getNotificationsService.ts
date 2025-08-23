import getNotificationsRepository from "../../repository/notification/getNotifications.js";
import type getNotifications from "../../response/notification/getNotifications.js";

export default async function getNotificationsService(user_id: string): Promise<getNotifications[]> {
  console.log("Init getNotificationsService")
  return await getNotificationsRepository(user_id)
}