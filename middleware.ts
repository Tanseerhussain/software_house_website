import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, verifySession } from "@/lib/auth/jwt"
import { canAccessRoute } from "@/lib/auth/roles"

const AUTH_ROUTES = ["/auth/login", "/auth/register"]
const PROTECTED_PREFIX = "/dashboard"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = token ? await verifySession(token) : null

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  const isProtected = pathname.startsWith(PROTECTED_PREFIX)
  const isPending = pathname.startsWith("/auth/pending-approval")

  if (isPending && !session) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  if (isProtected && !session) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && session) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  if (isProtected && session && !canAccessRoute(session.role, pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/login",
    "/auth/register",
    "/auth/pending-approval",
  ],
}
