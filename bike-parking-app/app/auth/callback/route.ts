// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// import type { NextRequest } from "next/server";

// export const dynamic = "force-dynamic";

// export async function GET(request: NextRequest) {
//   const requestUrl = new URL(request.url);
//   const code = requestUrl.searchParams.get("code");

//   if (code) {
//     const supabase = createRouteHandlerClient<Database>({ cookies });
//     await supabase.auth.exchangeCodeForSession(code);
//   }

//   // URL to redirect to after sign in process completes
//   return NextResponse.redirect(requestUrl.origin);
// }

import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/map`);
}
