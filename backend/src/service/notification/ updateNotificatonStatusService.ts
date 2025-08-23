import updateNotificationStatusRepository from "../../repository/notification/updateNotificationStatusRepository.js"

export default async function updateNotificationsStatusService(user_id: string, id: string) {
  console.log("Init updateNotificationsStatusService")
  updateNotificationStatusRepository(user_id, id)
}