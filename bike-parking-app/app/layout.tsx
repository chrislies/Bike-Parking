import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/components/providers/Provider"; // NextAuth.js provider
import UserProvider from "@/components/providers/user-provider";
import SupabaseProvider from "@/components/providers/supabase-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bike Parking",
  description: "Bike Parking App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SupabaseProvider>
        <UserProvider>
          {/* <Provider> */}
          <body className={inter.className}>{children}</body>
          {/* </Provider> */}
        </UserProvider>
      </SupabaseProvider>
    </html>
  );
}
