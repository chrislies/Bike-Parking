import { supabaseClient } from "@/config/supabaseClient";
import { NextResponse } from "next/server";
const supabase = supabaseClient;

export async function POST(req: Request) {
  try {
    const { email, x_coord, y_coord, image, request_type } = await req.json();

    const { data, error } = await supabase.from("Pending").insert([
      {
        email: email,
        x_coord: x_coord,
        y_coord: y_coord,
        image: image,
        request_type: request_type,
      },
    ]);

    if (error) {
      console.log("Error submitting to Pending:", error);
      return new NextResponse("Error submitting to Pending", { status: 500 });
    }

    console.log("Data successfully submitted to Pending:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.log("Server error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}