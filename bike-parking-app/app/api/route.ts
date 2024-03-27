import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Get session on API route
export const GET = async (req: Request) => {
  const session = await getServerSession(authOptions);

  return NextResponse.json({ authenticated: !!session }); // The !! ensures the resulting type is a boolean (true or false).
};
