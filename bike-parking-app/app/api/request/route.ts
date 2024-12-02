import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { NextResponse } from "next/server";
const supabase = createSupabaseBrowserClient();

export async function POST(req: Request) {
  try {
    const {
      site_id,
      request_type,
      selectedOption,
      description,
      y_coord,
      x_coord,
      user_id,
      username,
      email,
      image,
    } = await req.json();

    const { data, error } = await supabase.from("Pending").insert(
      {
        site_id: site_id,
        request_type: request_type,
        selectedOption: selectedOption,
        description: description,
        y_coord: y_coord,
        x_coord: x_coord,
        user_id: user_id,
        username: username,
        email: email,
        image: image,
      },
      { returning: "minimal" } as any
    );

    if (error) {
      console.log("Error in spot request:", error);
      return new NextResponse("Error in spot request", { status: 500 });
    }

    console.log("Request successful:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.log("Server error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
