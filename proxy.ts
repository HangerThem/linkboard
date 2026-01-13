import { NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  if (
    process.env.NODE_ENV === "production" &&
    (request.nextUrl.pathname.startsWith("/editor") ||
      request.nextUrl.pathname.startsWith("/api"))
  ) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/editor/:path*", "/api/:path*"],
}
