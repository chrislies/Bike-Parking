// import prisma from "@/lib/db";
// import { NextResponse } from "next/server";
// import { hash } from "bcrypt";
// import * as z from "zod";

// // Define a schema for input validation
// const userSchema = z.object({
//   username: z.string().min(1, "Username is required").max(36),
//   email: z.string().min(1, "Email is required").email("Invalid email"),
//   password: z
//     .string()
//     .min(1, "Password is required")
//     .min(8, "Password must have more than 8 characters"),
// });

// // POST request for user registration
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { email, username, password } = userSchema.parse(body);

//     // check if email already exists
//     const existingUserByEmail = await prisma.user.findUnique({
//       where: { email: email },
//     });
//     if (existingUserByEmail) {
//       return NextResponse.json(
//         {
//           user: null,
//           message: "User with this email already exists.",
//           id: "email",
//         },
//         { status: 409 }
//       );
//     }

//     // check if username already exists (case-insensitive)
//     const existingUserByUsername = await prisma.user.findFirst({
//       where: {
//         username: {
//           equals: username,
//           mode: "insensitive",
//         },
//       },
//     });
//     if (existingUserByUsername) {
//       return NextResponse.json(
//         { user: null, message: "Username already exists.", id: "username" },
//         { status: 409 }
//       );
//     }

//     // store data in prisma
//     const hashedPassword = await hash(password, 10);
//     const newUser = await prisma.user.create({
//       data: {
//         username,
//         email,
//         password: hashedPassword,
//       },
//     });

//     const { password: newUserPassword, ...rest } = newUser;

//     return NextResponse.json(
//       { user: rest, message: "User created successfully!" },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Something went wrong!" },
//       { status: 500 }
//     );
//   }
// }
