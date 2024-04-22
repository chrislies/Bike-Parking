import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseReqResClient } from "./utils/supabase/server-client";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createSupabaseReqResClient(request, response);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  // If user is signed in and the current path is '/', 'login', or 'register' redirect the user to '/map'
  if (
    (user && request.nextUrl.pathname === "/") ||
    (user && request.nextUrl.pathname === "/login") ||
    (user && request.nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/map", request.url));
  }

  // If user is not signed in and the current path is '/favorites' redirect the user to '/register'
  if (!user && request.nextUrl.pathname === "/favorites") {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  // If user is not signed in and the current path is '/account' redirect the user to '/'
  if (!user && request.nextUrl.pathname === "/account") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is not signed in and the current path is '/reset-password'
  if (!user && request.nextUrl.pathname === "/reset-password") {
    // Check if the request contains the 'token' query parameter
    if (request.nextUrl.searchParams.has("token")) {
      const tokenHash = request.nextUrl.searchParams.get("token");

      if (tokenHash) {
        // Verify the token hash using Supabase's verifyOtp method with type 'recovery'
        const { data: verificationData, error } = await supabase.auth.verifyOtp(
          { token_hash: tokenHash, type: "recovery" }
        );

        if (error || !verificationData) {
          // if token hash is invalid or expired, redirect unauthenticated users to '/'
          return NextResponse.redirect(new URL("/", request.url));
        }

        return response; // Allow access to the reset password page when the token hash is valid
      } else {
        // Redirect unauthenticated users to '/' if tokenHash is null
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      // Redirect unauthenticated users to '/'
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/map",
    "/favorites",
    "/account",
    "/register",
    "/reset-password",
  ],
};
