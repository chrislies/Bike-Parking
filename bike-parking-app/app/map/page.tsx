"use client";
import SupabaseProvider from "@/components/providers/supabase-provider";
import UserProvider from "@/components/providers/user-provider";
import dynamic from "next/dynamic";
const DynamicMapComponent = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
});

export default function page() {
  return (
    <SupabaseProvider>
      <UserProvider>
        <DynamicMapComponent />
      </UserProvider>
    </SupabaseProvider>
  );
}
