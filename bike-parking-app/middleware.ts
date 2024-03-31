import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is signed in and the current path is '/' redirect the user to '/map'
  if (user && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/map", req.url));
  }

  // If user is not signed in and the current path is not '/' redirect the user to '/'
  // if (!user && req.nextUrl.pathname !== "/") {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  // If user is not signed in and the current path is '/favorites' redirect the user to '/register'
  if (!user && req.nextUrl.pathname === "/favorites") {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  // If user is not signed in and the current path is '/account' redirect the user to '/'
  if (!user && req.nextUrl.pathname === "/account") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/", "/map", "/favorites", "/account", "/register"],
};

// import { createServerClient, type CookieOptions } from "@supabase/ssr";
// import { NextResponse, type NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return request.cookies.get(name)?.value;
//         },
//         set(name: string, value: string, options: CookieOptions) {
//           request.cookies.set({
//             name,
//             value,
//             ...options,
//           });
//           response = NextResponse.next({
//             request: {
//               headers: request.headers,
//             },
//           });
//           response.cookies.set({
//             name,
//             value,
//             ...options,
//           });
//         },
//         remove(name: string, options: CookieOptions) {
//           request.cookies.set({
//             name,
//             value: "",
//             ...options,
//           });
//           response = NextResponse.next({
//             request: {
//               headers: request.headers,
//             },
//           });
//           response.cookies.set({
//             name,
//             value: "",
//             ...options,
//           });
//         },
//       },
//     }
//   );

//   await supabase.auth.getUser();
//   await supabase.auth.getSession();

//   return response;
// }
