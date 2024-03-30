import { supabaseClient } from "@/config/supabaseClient";
import { NextResponse } from "next/server";
const supabase = supabaseClient;

export async function POST(req: Request) {
  try {
    const { uuid, username, location_id, x_coord, y_coord, location_address } =
      await req.json();

    const { data, error } = await supabase.from("Favorites").insert(
      {
        user_id: uuid,
        username: username,
        location_id: location_id,
        location_address: location_address,
        x_coord: x_coord,
        y_coord: y_coord,
      },
      { returning: "minimal" } as any
    );

    if (error) {
      console.log("Error favoriting spot:", error);
      return new NextResponse("Error favoriting spot", { status: 500 });
    }

    console.log("Spot successfully favorited:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.log("Server error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { uuid, location_id } = await req.json();

    const { data, error } = await supabase
      .from("Favorites")
      .delete()
      .eq("user_id", uuid)
      .eq("location_id", location_id);

    if (error) {
      console.log("Error deleting favorite spot:", error);
      return new NextResponse("Error deleting favorite spot", { status: 500 });
    }

    console.log("Spot successfully removed from favorites:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.log("Server error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
