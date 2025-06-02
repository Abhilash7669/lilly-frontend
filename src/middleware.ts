import { NextRequest, NextResponse } from "next/server";


export async function middleware(request: NextRequest) {

  console.log(request, "REQUEST");

  return NextResponse.redirect(new URL("/work-space/qr-camera-test", request.url));

  // const isAuthenticated = await getAuthStatus();

  // if(!isAuthenticated) return NextResponse.redirect(new URL("/login", request.url));
  
  // if(isAuthenticated && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/sign-up" || request.nextUrl.pathname === "/")) {
  //   return NextResponse.redirect(new URL("/work-space", request.url));
  // };

  // return NextResponse.next();

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