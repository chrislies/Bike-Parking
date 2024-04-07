// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
// import { NextResponse } from "next/server";

// import type { NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next();
//   const supabase = createMiddlewareClient({ req, res });

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   // If user is signed in and the current path is '/' redirect the user to '/map'
//   if (user && req.nextUrl.pathname === "/") {
//     return NextResponse.redirect(new URL("/map", req.url));
//   }

//   // If user is not signed in and the current path is not '/' redirect the user to '/'
//   // if (!user && req.nextUrl.pathname !== "/") {
//   //   return NextResponse.redirect(new URL("/", req.url));
//   // }

//   // If user is not signed in and the current path is '/favorites' redirect the user to '/register'
//   if (!user && req.nextUrl.pathname === "/favorites") {
//     return NextResponse.redirect(new URL("/register", req.url));
//   }

//   // If user is not signed in and the current path is '/account' redirect the user to '/'
//   if (!user && req.nextUrl.pathname === "/account") {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   return res;
// }

// export const config = {
//   matcher: ["/", "/map", "/favorites", "/account", "/register"],
// };

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

  // If user is signed in and the current path is '/' redirect the user to '/map'
  if (user && request.nextUrl.pathname === "/") {
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

  return response;
}

export const config = {
  matcher: ["/", "/map", "/favorites", "/account", "/register"],
};
