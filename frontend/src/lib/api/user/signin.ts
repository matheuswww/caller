import { API_URL } from "../api"
import { AppError } from "../error"
import error from "../errorType"

interface signinRequest {
  email: string
  password: string
}

export default async function signin(user: signinRequest) {
  const url = `${API_URL}/user/signin`
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
    credentials: "include",
  }).then(async (res) => {
    if(res.status == 200) {
      return
    }
    const text = await res.text()
    if(text) {
      const res: error = JSON.parse(text)
      if (res.message) {
        if(res.message == "email not found") {
          throw new EmailNotFound()
        }
        if(res.message == "invalid password") {
          throw new InvalidPassword()
        }
      }
    }
    throw new Error()
  }) 
}

export class EmailNotFound extends AppError {
  constructor(message = "Email not found") {
    super(message, 409)
    this.name = "EmailNotFound"
  }
}

export class InvalidPassword extends AppError {
  constructor(message = "Invalid password user error") {
    super(message, 409)
    this.name = "InvalidPassword"
  }
}