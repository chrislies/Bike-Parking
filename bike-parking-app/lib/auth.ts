// // using nextAuth for authentication

// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import prisma from "./db";
// import { compare } from "bcrypt";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/login",
//   },
//   providers: [
//     CredentialsProvider({
//       // The name to display on the sign in form (e.g. "Sign in with...")
//       name: "Credentials",
//       // `credentials` is used to generate a form on the sign in page.
//       // You can specify which fields should be submitted, by adding keys to the `credentials` object.
//       // e.g. domain, username, password, 2FA token, etc.
//       // You can pass any HTML attribute to the <input> tag through the object.
//       credentials: {
//         email: {
//           label: "Email",
//           type: "email",
//           placeholder: "example@email.com",
//         },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         // return null if email or password fields are empty
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         const existingUser = await prisma.user.findUnique({
//           where: { email: credentials?.email },
//         });
//         if (!existingUser) {
//           return null;
//         }

//         const passwordMatch = await compare(
//           credentials.password,
//           existingUser.password
//         );

//         if (!passwordMatch) {
//           return null;
//         }

//         return {
//           id: `${existingUser.id}`,
//           username: existingUser.username,
//           email: existingUser.email,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         return {
//           ...token,
//           username: user.username,
//         };
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           username: token.username,
//         },
//       };
//     },
//   },
// };
