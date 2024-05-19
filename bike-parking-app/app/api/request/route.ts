import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { NextResponse } from "next/server";
const supabase = createSupabaseBrowserClient();

export async function POST(req: Request) {
  try {
    const {
      id,
      x_coord,
      y_coord,
      request_type,
      created_at,
      image,
      email,
      description,
      selectedOption,
    } = await req.json();

    const { data, error } = await supabase.from("Pending").insert(
      {
        image: image,
        request_type: request_type,
        email: email,
        x_coord: x_coord,
        y_coord: y_coord,
        description: description,
        selectedOption: selectedOption,
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
