import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const user = req.cookies.get("user");
  const path = req.nextUrl.pathname
  
  if (path === "/signin" || path === "/signup") {
    if (user) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  } else if (path === "/") {
    if (!user) {
      return NextResponse.redirect(new URL("/signin", req.url))
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signup", "/signin"],
};
