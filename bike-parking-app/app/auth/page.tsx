import LoginModal from "@/components/auth/LoginModal";
import AuthLayout from "./layout";

export default function AuthPage() {
  return (
    <AuthLayout>
      <LoginModal />
    </AuthLayout>
  );
}
