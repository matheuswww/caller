import * as cookie from 'cookie';
import type { Request, Response } from 'express';
import { CookieError } from './cookie-customError.js';
import { createRequire } from 'module';
import type { IncomingMessage } from 'http';
import { parse as parseUrl } from "url"

const require = createRequire(import.meta.url);
const signature = require('cookie-signature');

const secret = process.env.COOKIE_SECRET || ""
const cookieName = "user"

export function sendCookie(res: Response, id: string) {
  const signedValue = 's:' + signature.sign(id, secret);
  const serialized = cookie.serialize(cookieName, signedValue, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  res.setHeader('Set-Cookie', serialized);
}

export function validateCookie(req: Request): string {
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const value = cookies[cookieName];

  if (!value) throw new CookieError();
  
  if (!value.startsWith('s:')) throw new CookieError();
  const id = signature.unsign(value.slice(2), secret);
  if (!id) throw new CookieError();
  
  return id;
}

export function validateWSCookie(req: IncomingMessage): string {
  
  if (!req.url) throw new CookieError();

  const url = parseUrl(req.url, true);
  const value = url.query[cookieName] as string | undefined;
  if (!value) throw new CookieError()
  const decoded = decodeURIComponent(value)
  if (!decoded.startsWith("s:")) throw new CookieError();
  const id = signature.unsign(decoded.slice(2), secret);
  if (!id) throw new CookieError();
  return id;
}