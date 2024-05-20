"use client";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { useState } from "react";
import LoginModal from "./LoginModal";

const RegisterSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .max(20)
      .refine(
        // (s) => /^(?=.{2,20}$)(?![_])(?!.*[_]{2})[a-zA-Z0-9_]+(?<![_])$/.test(s),
        (s) => /^[a-zA-Z0-9_]+$/.test(s),
        "Usernames may only contain letters, numbers, and _"
      )
      .refine(
        (s) => !s.startsWith("_") && !s.endsWith("_"),
        "Usernames cannot start or end with _"
      )
      .refine(
        (s) => (s.match(/_/g) || []).length <= 1,
        "Usernames can have at most one _"
      )
      .refine((s) => s.length > 1, "Usernames must have at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterModal: React.FC<{ insideModal: boolean }> = ({ insideModal }) => {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [registerView, setRegisterView] = useState(true);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    try {
      // Attempt to create the user manually in the database
      // const response = await fetch("/api/user", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     username: values.username,
      //     email: values.email.toLowerCase(),
      //     password: values.password,
      //   }),
      // });

      // if (!response.ok) {
      //   const responseData = await response.json();
      //   switch (responseData.id) {
      //     case "email":
      //       setError("email", { message: responseData.message });
      //       break;
      //     case "username":
      //       setError("username", { message: responseData.message });
      //       break;
      //     default:
      //       console.error("Unknown error ID:", responseData.id);
      //   }
      //   return; // Stop execution if manual creation fails
      // }

      // Manual creation successful, proceed with Supabase authentication
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
          data: {
            username: values.username,
          },
        },
      });
      if (error?.message) {
        setError("email", { message: error.message });
      } else {
        toast.success(
          "Successfully signed up. Please check your email to confirm your account.",
          {
            duration: 10000,
            id: "signUpSuccessful",
          }
        );

        // Registration successful, redirect to login
        router.push("/login");
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      setError("email", { message: "Something went wrong!" });
    }
  };

  async function signUpWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  return (
    <>
      {registerView ? (
        <>
          {!insideModal && <Toaster position="top-right" />}
          <div className="w-full max-w-md relative">
          <div className="fixed inset-0 z-0" style={{ backgroundImage: `url(/image.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <form
              className={`bg-white ${
                insideModal ? "px-4" : "px-8 py-6 shadow-md rounded"
              } relative z-10`}
            >
              {!insideModal && (
                <h1 className="text-center text-2xl pb-3 font-bold">Sign Up</h1>
              )}
              <div className="">
                <label
                  htmlFor="username"
                  className="block text-gray-700 text-sm font-bold mb-1"
                >
                  Username
                </label>
                <input
                  {...register("username")}
                  className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline
              ${errors.username ? "border-red-500" : ""}
              `}
                  type="text"
                  id="username"
                  placeholder="Username"
                />
                {errors.username ? (
                  <p className="text-red-500 text-xs italic">
                    {errors.username.message}
                  </p>
                ) : (
                  <div className="h-4" />
                )}
              </div>
              <div className="">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-1"
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline
              ${errors.email ? "border-red-500" : ""}
              `}
                  type="text"
                  id="email"
                  placeholder="Email"
                />
                {errors.email ? (
                  <p className="text-red-500 text-xs italic">
                    {errors.email.message}
                  </p>
                ) : (
                  <div className="h-4" />
                )}
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    {...register("password")}
                    className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline
                ${errors.password ? "border-red-500" : ""}
                `}
                    id="password"
                    type="password"
                    placeholder="Password"
                  />
                  {errors.password ? (
                    <p className="text-red-500 text-xs italic">
                      {errors.password.message}
                    </p>
                  ) : (
                    <div className="h-5" />
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <input
                    {...register("confirmPassword")}
                    className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline
                ${errors.confirmPassword ? "border-red-500" : ""}
                `}
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                  />
                  {errors.confirmPassword ? (
                    <p className="text-red-500 text-xs italic mb-1">
                      {errors.confirmPassword.message}
                    </p>
                  ) : (
                    <div className="h-5" />
                  )}
                </div>
              </div>
              <button
                onClick={handleSubmit(onSubmit)}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign Up
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
                onClick={signUpWithGoogle}
                className="flex w-full border-2 py-2 mb-5 rounded-md justify-center items-center font-semibold hover:bg-gray-50"
              >
                <FcGoogle className="h-6 w-6 mr-3" /> Sign up with Google
              </button>
              <p className={`text-center text-sm font-semibold text-gray-400 ${insideModal ? null : "mb-3"}`}>
                {`Already have an account? `}
                {insideModal ? (
                  <span
                    className="text-blue-500 hover:text-blue-800 cursor-pointer"
                    onClick={() => setRegisterView(false)}
                  >
                    Log in
                  </span>
                ) : (
                  <Link
                    href="/login"
                    className="text-blue-500 hover:text-blue-800 hover:cursor-pointer"
                  >
                    Log in
                  </Link>
                )}
              </p>
            </form>
          </div>
        </>
      ) : (
        <LoginModal insideModal={true} />
      )}
    </>
  );
};

export default RegisterModal;