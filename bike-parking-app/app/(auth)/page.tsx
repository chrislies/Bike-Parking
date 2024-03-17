import AuthLayout from "./layout";
import LoginModal from "@/components/auth/LoginModal";

export default function AuthPage() {
  return (
    <AuthLayout>
      <LoginModal />
    </AuthLayout>
  );
}
