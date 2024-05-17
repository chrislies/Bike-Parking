"use client";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { Spinner } from "../svgs";
import styles from './LoginModal.module.css';

const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const LoginModal = () => {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof LoginSchema>> = async (values) => {
    setLoading(true);
    console.log("Received values:", values);  // Check the exact input values
  
    try {
      console.log("Checking admin credentials:", values.email, values.password);
      if (values.email === "bikeparkingbikou@gmail.com" && values.password === "P@ssw0rdP@ssw0rd") {
        console.log("Redirecting to admin");  // Confirm if it enters this block
        const result = await router.push("/admin");
        console.log("Admin redirect result:", result);  // Verify if redirect succeeds
        return;
      }
  
      console.log("Proceeding with normal login");  // Confirm the flow
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error && 'message' in error) {
        console.log("Login error:", error.message);
        toast.error(error.message);
        return;
      } else {
        console.log("Redirecting to map");
        await router.push("/map");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error);
        toast.error(`Sign-in error: ${error.message}`);
      } else {
        console.error("Unknown error type caught during login:", error);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className={`fixed inset-0 z-0 ${styles.backgroundImageFade}`}></div>
      <div className="fixed inset-x-0 top-0 z-10 flex justify-between items-center p-6 bg-transparent">
  <div className="flex items-center space-x-2">
    <img src="bike_parking_logo.webp" alt="BikOU Logo" className="h-8 w-auto" />
    <h2 className="text-xl font-bold text-white">BikOU</h2>
  </div>
  <div className="flex items-center space-x-4">
    <Link href="/about-us">
      <button className="py-2 px-4 rounded-md text-white bg-green-500 hover:bg-green-700 font-semibold">
        About Us
      </button>
    </Link>
    <Link href="/login">
      <button className="py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-700 font-semibold">
        Login
      </button>
    </Link>
  </div>
</div>
      <div className="w-full max-w-sm z-20 mx-auto pt-20">
        <form className="bg-white shadow-md rounded px-8 py-6" onSubmit={form.handleSubmit(onSubmit)}>
          <h1 className="text-center text-2xl pb-3 font-bold">Log In</h1>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-1">
              Email
            </label>
            <input
              {...form.register("email")}
              className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${form.formState.errors.email ? "border-red-500" : ""}`}
              type="text"
              id="email"
              placeholder="Email"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs italic">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-1">
              Password
            </label>
            <input
              {...form.register("password")}
              className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${form.formState.errors.password ? "border-red-500" : ""}`}
              type="password"
              id="password"
              placeholder="Password"
            />
            {form.formState.errors.password && (
              <p className="text-red-500 text-xs italic">{form.formState.errors.password.message}</p>
            )}
            <Link href="#" className="font-bold text-sm text-blue-500 hover:text-blue-800">
              Forgot Password?
            </Link>
          </div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center">
                <Spinner className="animate-spin h-6" />
              </div>
            ) : (
              "Sign In"
            )}
          </button>
          <div className="flex justify-center my-4">
            <div className="w-full text-gray-400 flex items-center">
              <div className="border-t-2 w-full" />
            </div>
            <p className="text-gray-400 px-4">Or</p>
            <div className="w-full text-gray-400 flex items-center">
              <div className="border-t-2 w-full" />
            </div>
          </div>
          <button
            className="flex w-full border-2 py-2 mb-5 rounded-md justify-center items-center font-semibold hover:bg-gray-50"
            onClick={loginWithGoogle}
          >
            <FcGoogle className="h-6 w-6 mr-3" /> Continue with Google
          </button>
          <p className="text-center text-sm font-semibold text-gray-400 mb-3">
            {"Don't have an account?"}{' '}
            <Link href="/register" className="text-blue-500 hover:text-blue-800">
              Sign up
            </Link>
          </p>
          <Link href="/map" className="flex justify-center text-sm font-semibold text-gray-400 hover:text-gray-500">
            Continue as Guest
          </Link>
        </form>
      </div>
    </>
  );
};

export default LoginModal;
