import { AppError } from "../AppError.js";

export class ConflictUserError extends AppError {
  constructor(msg = 'conflict error') {
    super(msg, 409);
    this.name = 'Conflict';
  }
}

export class UserNotFound extends AppError {
  constructor(msg = 'not found error') {
    super(msg, 400);
    this.name = 'Not Found';
  }
}

export class UserInvalidPassword extends AppError {
  constructor(msg = 'invalid password error') {
    super(msg, 400);
    this.name = 'Invalid Pasword';
  }
}