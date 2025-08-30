export class AppError extends Error {
  status: number
  constructor(message: string, status = 500) {
    super(message)
    this.name = "AppError"
    this.status = status
  }
}

export class InvalidCookie extends AppError {
  constructor(message = "Invalid cookie") {
    super(message, 409)
    this.name = "InvalidCookie"
  }
}