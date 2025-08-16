export class CookieError extends Error {
  public statusCode: number;

  constructor() {
    super("invalid cookie"); 
    this.statusCode = 401;
    this.name = 'CookieError';
    Error.captureStackTrace(this, this.constructor);
  }
}
