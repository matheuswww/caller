import { API_URL } from "../api"
import { AppError } from "../error"
import error from "../errorType"

interface signupRequest {
  name: string
  user: string
  email: string
  password: string
}

export default async function signup(user: signupRequest) {
  const url = `${API_URL}/user/signup`
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
    credentials: "include",
  }).then(async (res) => {
    if(res.status == 201) {
      return
    }
    const text = await res.text()
    if(text) {
      const res: error = JSON.parse(text)
      if (res.message) {
        if(res.message == "email already exists") {
          throw new ConfictEmailError()
        }
        if(res.message == "user already exists") {
          throw new ConfictUserError()
        }
      }
    }
    throw new Error()
  }) 
}

export class ConfictEmailError extends AppError {
  constructor(message = "Conlifct email error") {
    super(message, 409)
    this.name = "ConflicEmailError"
  }
}

export class ConfictUserError extends AppError {
  constructor(message = "Conlifct user error") {
    super(message, 409)
    this.name = "ConflicUserError"
  }
}