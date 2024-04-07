import LoginModal from "@/components/auth/LoginModal";
import AuthLayout from "./(entry)/layout";

export default async function Home() {
  return (
    <AuthLayout>
      <LoginModal />
    </AuthLayout>
  );
}
