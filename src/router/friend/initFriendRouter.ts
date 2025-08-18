import type { Express } from 'express-serve-static-core'
import addFriendController from '../../controller/friend/addFriendController.js'
import friendShipActionController from '../../controller/friend/friendshipActionController.js'

export default function initFriendRoutes(app: Express) {
  console.log("Init initFriendRoutes")
  app.post('/friend/addFriend', addFriendController)
  app.patch('/friend/friendshipAction', friendShipActionController)
}