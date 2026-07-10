import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = [
  "/dashboard",
  "/lesson",
  "/assessment",
  "/certificates",
  "/profile",
  "/results",
  "/calendar",
  "/announcements",
];

function isDeploymentArtifact(pathname: string) {
  return (
    pathname === "/php.zip" ||
    pathname === "/php" ||
    pathname.startsWith("/php/") ||
    pathname === "/sql" ||
    pathname.startsWith("/sql/")
  );
}

function isProtectedPage(pathname: string) {
  return (
    protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) ||
    /^\/courses\/[^/]+\/(assignments|discussion)(?:\/|$)/.test(pathname) ||
    /^\/vr-practice\/[^/]+(?:\/|$)/.test(pathname)
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/vowsupport") {
    return NextResponse.redirect(new URL("/support", request.url), 308);
  }

  if (isDeploymentArtifact(pathname)) {
    return new NextResponse(null, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (isProtectedPage(pathname) && !request.cookies.has("vowlms_token")) {
    const signIn = new URL("/auth/signin", request.url);
    signIn.searchParams.set("returnTo", `${pathname}${search}`);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|icons/|sw.js|manifest.webmanifest|opengraph-image).*)",
  ],
};
