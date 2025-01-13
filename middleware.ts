import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const targetPath = "/dashboard/templates/b146bcbf-5590-4e83-b685-1f284a979b28/edit";

  if (request.nextUrl.pathname.startsWith("/templates")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname !== targetPath) {
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
