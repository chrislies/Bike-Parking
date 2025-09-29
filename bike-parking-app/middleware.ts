import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseReqResClient } from "./utils/supabase/server-client";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Always allow access to auth callback route
  if (request.nextUrl.pathname === "/auth/callback") {
    return response;
  }

  const supabase = createSupabaseReqResClient(request, response);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  // If user is signed in and the current path is 'login', or 'register' redirect the user to '/map'
  if (
    (user && request.nextUrl.pathname === "/login") ||
    (user && request.nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/map", request.url));
  }

  // If user is not signed in and the current path is '/favorites' redirect the user to '/register'
  if (!user && request.nextUrl.pathname === "/favorites") {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  // If user is not signed in and the current path is '/admin' redirect the user to '/'
  // Or if user is signed in and not an admin and the current path is '/admin' redirect the user to '/'
  if (
    (!user && request.nextUrl.pathname === "/admin") ||
    (user && user.role !== "admin" && request.nextUrl.pathname === "/admin")
  ) {
    console.log(user, user?.role);
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is not signed in and the current path is '/account' redirect the user to '/'
  if (!user && request.nextUrl.pathname === "/account") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to reset-password page - authentication will be checked in the component
  // This is needed because the session might not be immediately available in middleware
  // after the auth callback redirect

  return response;
}

export const config = {
  matcher: [
    "/",
    "/map",
    "/favorites",
    "/account",
    "/login",
    "/register",
    "/reset-password",
    "/admin",
    "/auth/callback",
  ],
};
