import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/signin",
  "/signup",
  "/reset-password",
  "/change-password",
  "/verify-email",
  "/forms",
];

const PUBLIC_PREFIXES = [
  "/_next",
  "/media",
  "/favicon",
  "/api-proxy",
  "/ion-user-service",
  "/ion-branch-service",
  "/ion-order-service",
  "/ion-networking-service",
  "/ion-rule-scheme-service",
];

const LOGGED_IN_COOKIE = "logged_in";
const LOGGED_IN_VALUE = "1";

function isPublic(pathname: string): boolean {
  if (pathname === "/") return true;
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const loggedIn = req.cookies.get(LOGGED_IN_COOKIE)?.value === LOGGED_IN_VALUE;

  if (loggedIn && (pathname === "/signin" || pathname === "/signup")) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!loggedIn && !isPublic(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    url.search = `?redirectTo=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|media|.*\\..*).*)",
  ],
};
