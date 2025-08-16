import { AppError } from "../AppError.js";

export class ConflictUserError extends AppError {
  constructor(msg = 'conflict error') {
    super(msg, 409);
    this.name = 'Conflict';
  }
}