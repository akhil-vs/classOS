import { NextResponse, type NextRequest } from "next/server";

/**
 * LMS L0 — cookie presence gate for protected surfaces.
 * Full role checks run in Node (pages + API) against the auth store.
 */
const PROTECTED_PREFIXES = [
  "/class",
  "/school",
  "/author",
  "/progress",
  "/join",
];

const COOKIE_NAME = "classos_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (!needsAuth) return NextResponse.next();

  const session = request.cookies.get(COOKIE_NAME)?.value;
  if (session) return NextResponse.next();

  const login = new URL("/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/class/:path*",
    "/school",
    "/school/:path*",
    "/author",
    "/author/:path*",
    "/progress",
    "/progress/:path*",
    "/join/:path*",
  ],
};
