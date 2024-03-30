import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function SignOutButton() {
  const Logout = async () => {
    "use server";
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    signOut();
    redirect("/");
  };
  return (
    <form action={Logout}>
      <button className="border-2 border-red-600 rounded-lg p-3 bg-red-500 text-xl">
        Sign Out
      </button>
    </form>
  );
}
