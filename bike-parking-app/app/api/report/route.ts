import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { user_id, username, option, site_id, description, x, y } = await req.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.id !== user_id) {
      return new NextResponse("You must be authenticated to add a report", { status: 403 });
    }

    const { data, error } = await supabase.from("Report").insert([
      {
        user_id,
        username,
        option,
        description,
        location_id: site_id,
        x,
        y,
      },
    ]);

    if (error) {
      console.error("Error inserting report:", error);
      return new NextResponse("Error adding report", { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
