import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/components/Provider"; // NextAuth.js provider

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
      <Provider>
        <body className={inter.className}>{children}</body>
      </Provider>
    </html>
  );
}
