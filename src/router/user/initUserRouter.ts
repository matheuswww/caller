import type { Express } from 'express-serve-static-core'
import signupController from '../../controller/user/signupController.js'

export default function initUserRoutes(app: Express) {
  console.log("Init initUserRoutes")
  app.post('/user/signup', signupController)
}