import prisma from "@/lib/db";
import * as z from "zod";
import { NextResponse } from "next/server";


const locationSchema = z.object({
  x_coordinate: z.string(),
  y_coordinate: z.string(),
  site_id: z.string(),
  racktype: z.string(),
  ifoaddress: z.string(),
});

// POST request for saving favorite location
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Request body:", body); 


    const { x_coordinate, y_coordinate, site_id, racktype, ifoaddress } = locationSchema.parse(body);

    // Convert coordinates from string to number
    const parsedXCoordinate = parseFloat(x_coordinate);
    const parsedYCoordinate = parseFloat(y_coordinate);

    if (isNaN(parsedXCoordinate) || isNaN(parsedYCoordinate)) {
      throw new Error("Invalid coordinates provided"); 
    }

    console.log("Parsed request body:", { x_coordinate: parsedXCoordinate, y_coordinate: parsedYCoordinate, site_id, racktype, ifoaddress });
    const newLocation = await prisma.favorite_table.create({
      data: {
        x_coordinate: parsedXCoordinate,
        y_coordinate: parsedYCoordinate,
        site_id,
        racktype,
        ifoaddress,
      },
    });

    console.log("New location:", newLocation); 

    return NextResponse.json(
      { location: newLocation, message: "Location saved successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error occurred:", error); 
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
