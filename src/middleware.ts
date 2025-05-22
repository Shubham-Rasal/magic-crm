import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is for authentication or public routes
  if (pathname.startsWith("/signin") || 
      pathname.startsWith("/api/auth") || 
      pathname.includes(".") ||  // Static files
      pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXT_PUBLIC_AUTH_SECRET 
  });
  
  // If no token and user is trying to access protected route, redirect to signin
  if (!token) {
    const signInUrl = new URL("/signin", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Check if user has completed setup
  // If trying to access routes other than setup pages, check setup status
  if (!pathname.startsWith("/setup") && !pathname.startsWith("/setup-new") && !pathname.startsWith("/api/")) {
    try {
      // Check if user has completed setup
      const setupCheckResponse = await fetch(new URL("/api/user/setup", request.url).toString(), {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
      
      if (setupCheckResponse.ok) {
        const setupData = await setupCheckResponse.json();
        
        // If setup is not complete, redirect to setup page
        if (!setupData.setupComplete) {
          const setupUrl = new URL("/setup-new", request.url);
          return NextResponse.redirect(setupUrl);
        }
      }
    } catch (error) {
      console.error("Error checking setup status:", error);
    }
  }

  // Continue if the user is authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
