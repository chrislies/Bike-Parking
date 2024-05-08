import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { NextResponse } from "next/server";
const supabase = createSupabaseBrowserClient();

export async function POST(req: Request) {
  try {
    const {
      username,
      option,
      site_id,
      description,
      x,
      y
    } = await req.json();

    
    const { data, error } = await supabase.from("Report").insert([
      {
        username: username,
        option: option,
        description: description,
        location_id: site_id,
        x: x,
        y: y,
      }
    ], { returning: "minimal" } as any );

    if (error) {
      console.error("Error inserting report:", error);
      return new NextResponse("Error adding report", { status: 500 });
    }

    console.log("Report successfully inserted:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
