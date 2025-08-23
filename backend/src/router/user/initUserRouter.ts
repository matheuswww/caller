import type { Express } from 'express-serve-static-core'
import signupController from '../../controller/user/signupController.js'
import signinController from '../../controller/user/signinController.js'
import searchUserController from '../../controller/friend/searchUserController.js'

export default function initUserRoutes(app: Express) {
  console.log("Init initUserRoutes")
  app.post('/user/signup', signupController)
  app.post('/user/signin', signinController)
  app.get('/user/searchUser', searchUserController)
}