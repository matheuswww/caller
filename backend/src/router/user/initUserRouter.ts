import type { Express } from 'express-serve-static-core'
import signupController from '../../controller/user/signupController.js'
import signinController from '../../controller/user/signinController.js'
import searchUserController from '../../controller/friend/searchUserController.js'
import getUserController from '../../controller/user/getUserController.js'

export default function initUserRoutes(app: Express) {
  console.log("Init initUserRoutes")
  app.post('/user/signup', signupController)
  app.post('/user/signin', signinController)
  app.get('/user/searchUser', searchUserController)
  app.get('/user/getUser', getUserController)
}