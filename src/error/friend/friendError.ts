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

export class AlreadySent extends AppError {
  constructor(msg = 'already sent error') {
    super(msg, 400);
    this.name = 'AlreadySent';
  }
}

export class FriendshipNotFoundError extends AppError {
  constructor(msg = 'friendship not found error') {
    super(msg, 404);
    this.name = 'NotFound';
  }
}
