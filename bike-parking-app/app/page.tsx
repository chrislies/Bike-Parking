import LoginModal from "@/components/auth/LoginModal";
import AuthLayout from "./(entry)/layout";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Home() {
  return (
    <AuthLayout>
      <LoginModal />
    </AuthLayout>
  );
}

// export default async function Home() {
//   const supabase = createServerComponentClient({ cookies }); // Pages inside app/ are 'server' components by deufalt
//   const { data: User } = await supabase.from("User").select();

//   return <pre>{JSON.stringify(User, null, 2)}</pre>;
// }
