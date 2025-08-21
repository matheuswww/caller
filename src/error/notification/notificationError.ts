import { AppError } from "../AppError.js";

export class NotificationNotFound extends AppError {
  constructor(msg = 'not found error') {
    super(msg, 400);
    this.name = 'Not Found';
  }
}