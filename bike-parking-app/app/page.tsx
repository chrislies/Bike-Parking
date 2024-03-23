"use client";
import LoginModal from "@/components/auth/LoginModal";
import AuthPage from "./(auth)/page";
import AuthLayout from "./(auth)/layout";

export default function Home() {
  return (
    <AuthLayout>
      <LoginModal />
    </AuthLayout>
  );
}
