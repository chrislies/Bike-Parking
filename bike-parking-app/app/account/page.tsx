"use client";

import Link from "next/link";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
      return;
    }
    console.log("Sign out successful");
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold underline mt-5 text-center">
        Account Page
      </h1>
      <div className="flex flex-col h-screen items-center justify-center gap-5">
        <button
          className="bg-red-500 text-white p-4 rounded-xl"
          onClick={signOutUser}
        >
          Log Out
        </button>
        <Link href="/" className="hover:underline font-bold text-lg">
          {`<-- Go back to map`}
        </Link>
      </div>
    </div>
  );
}
