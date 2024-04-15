import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { NextResponse } from "next/server";
const supabase = createSupabaseBrowserClient();

export async function POST(req: Request) {
  try {
    const {
      username,
      option,
      site_id,
      description
    } = await req.json();

    
    const { data, error } = await supabase.from("Report").insert([
      {
        username: username,
        option: option,
        description: description,
        location_id: site_id,
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


// Temp Version
export async function DELETE(req: Request) {
  try {
    const { reportId } = await req.json();

    const { data, error } = await supabase
      .from("Report")
      .delete()
      .match({ id: reportId });

    if (error) {
      console.error("Error deleting report:", error);
      return new NextResponse("Error deleting report", { status: 500 });
    }

    console.log("Report successfully deleted:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
