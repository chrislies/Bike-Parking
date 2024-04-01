"use client";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/config/supabaseClient";
import React, { useState } from 'react';
import styles from './LoginModal.module.css';

const RegisterSchema = z.object({
  username: z.string().min(1, "Username is required").max(20, "Username must be under 20 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterModal = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(RegisterSchema)
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    setLoading(true);
    try {
      // Supabase signUp call
      const { error } = await supabaseClient.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
          },
        },
      });

      if (error) throw error;

      alert("Sign up successful! Check your email for a confirmation link.");
      router.push("/login"); // Redirect user to login page
    } catch (error: any) {
      setError("email", { type: "manual", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 z-0 ${styles.backgroundImageFade}`}></div>
      <div className="fixed inset-x-0 top-0 z-10 flex justify-between items-center p-6 bg-transparent">
        <Link href="/login">
          <span className="text-xl font-bold text-white cursor-pointer">BikOU</span>
        </Link>
        <Link href="/login">
          <span className="inline-block py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-700 font-semibold cursor-pointer">Login</span>
        </Link>
      </div>

      <div className="flex justify-center items-center w-full h-screen z-10">
        <div className="w-full max-w-md bg-white bg-opacity-90 shadow-md rounded px-8 py-6">
          <h1 className="text-center text-2xl pb-3 font-bold">Sign Up</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Username input */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <input {...register("username")} type="text" id="username" placeholder="Username"
                     className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.username ? 'border-red-500' : ''}`}/>
              {errors.username && <p className="text-red-500 text-xs italic">{errors.username.message}</p>}
            </div>

            {/* Email input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input {...register("email")} type="email" id="email" placeholder="Email"
                     className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}/>
              {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
            </div>

            {/* Password input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input {...register("password")} type="password" id="password" placeholder="Password"
                     className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}/>
              {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
            </div>

            {/* Confirm Password input */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
              <input {...register("confirmPassword")} type="password" id="confirmPassword" placeholder="Confirm Password"
                     className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.confirmPassword ? 'border-red-500' : ''}`}/>
              {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit button */}
            <button type="submit" disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex justify-center my-4">
            <div className="w-full text-gray-400 flex items-center justify-center">
              <div className="border-t-2 w-full"></div>
              <p className="text-gray-400 px-4">Or</p>
              <div className="border-t-2 w-full"></div>
            </div>
          </div>

          {/* Google sign-up */}
          <button className="flex w-full border-2 py-2 mb-5 rounded-md justify-center items-center font-semibold hover:bg-gray-50">
            <FcGoogle className="h-6 w-6 mr-3"/> Sign up with Google
          </button>

          {/* Link to login */}
          <p className="text-center text-sm font-semibold text-gray-400">
            Already have an account?
            <Link href="/login">
              <span className="text-blue-500 hover:text-blue-800 hover:cursor-pointer"> Log in</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterModal;