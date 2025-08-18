import { AppError } from "../AppError.js";

export class SelfFriendError extends AppError {
  constructor(msg = 'self friend error') {
    super(msg, 400);
    this.name = 'SelfFriend';
  }
}

export class AlreadyFriends extends AppError {
  constructor(msg = 'already friends error') {
    super(msg, 400);
    this.name = 'AlreadyFriends';
  }
}

export class FriendshipNotFoundError extends AppError {
  constructor(msg = 'friendship not found error') {
    super(msg, 404);
    this.name = 'NotFound';
  }
}

export class CannotDeleteError extends AppError {
  constructor(msg = 'cannot delete error') {
    super(msg, 400);
    this.name = 'CannotDelete';
  }
}