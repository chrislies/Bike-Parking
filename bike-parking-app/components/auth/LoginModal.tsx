"use client";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "../svgs";
// import { signInWithEmailAndPassword } from "@/app/(auth)/actions";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { useUser } from "@/hooks/useUser";
import styles from './LoginModal.module.css';

const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const LoginModal = () => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push("/map");
    }
  };

  return (
    <>
      {/* Full-screen background and overlay content */}
      <div className={`fixed inset-0 z-0 ${styles.backgroundImageFade}`}></div>
      <div className="fixed inset-x-0 top-0 z-10 flex justify-between items-center p-6 bg-transparent">
        <h2 className="text-xl font-bold text-white">BikOU</h2>
        <Link href="/login">
          <button className="py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-700 font-semibold">
            Login
          </button>
        </Link>
      </div>

      {/* Main Modal */}
      <div className="flex justify-center items-center w-full h-screen z-10">
        <div className="w-full max-w-md bg-white bg-opacity-90 shadow-md rounded px-8 pt-6 pb-8">
          <h1 className="text-center text-2xl font-bold">Log In</h1>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                {...form.register("email")}
                type="text"
                placeholder="Email"
                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs italic">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                {...form.register("password")}
                type="password"
                placeholder="Password"
                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs italic">{form.formState.errors.password.message}</p>
              )}
            </div>
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>
          <div className="flex justify-center my-4">
            <div className="border-t border-gray-300 w-full"></div>
            <p className="text-center text-gray-500 mx-4">or</p>
            <div className="border-t border-gray-300 w-full"></div>
          </div>
          <button className="flex w-full border-2 border-gray-300 py-2 mb-5 rounded-md justify-center items-center font-semibold hover:bg-gray-50">
            <FcGoogle className="h-6 w-6 mr-3"/> Continue with Google
          </button>
          <div className="text-center text-sm font-semibold text-gray-500 mb-3">
            Don't have an account? <Link href="/register"><span className="text-blue-500 hover:text-blue-700 cursor-pointer">Sign up</span></Link>
          </div>
          <div className="flex justify-center text-sm font-semibold text-gray-500 hover:text-gray-700">
            <Link href="/map"><span className="cursor-pointer">Continue as Guest</span></Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;