import { NextRequest, NextResponse } from "next/server";


export async function middleware(request: NextRequest) {

   const pathname = request.nextUrl.pathname;

  const pathnameIsMissingLocale = !/^\/(en|fr|nl)(\/|$)/.test(pathname);
  if (!pathnameIsMissingLocale) {
    return NextResponse.next();
  }

  const cookieLocale = request.cookies.get("locale")?.value;

  const acceptLanguage = request.headers.get("accept-language");
  const fallbackLocale = acceptLanguage?.split(",")[0].split("-")[0] || "en";

  const locale = cookieLocale || fallbackLocale;

  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  );

    
};


export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|login|sign-up|en|fr|nl|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}