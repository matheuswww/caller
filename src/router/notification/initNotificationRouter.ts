import type { Express } from 'express-serve-static-core'
import getNotificationsController from '../../controller/notification/getNotificationController.js'
import UpdateNotificationStatusController from '../../controller/notification/updateNotificationStatusController.js'

export default function initNotificationRouter(app: Express) {
  console.log("Init initFriendRoutes")
  app.get('/notification/getNotifications', getNotificationsController)
  app.patch('/notification/updateNotificationStatus', UpdateNotificationStatusController)
}