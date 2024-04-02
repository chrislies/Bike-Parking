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

const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const LoginModal = () => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof LoginSchema>> = async (
    values
  ) => {
    try {
      setLoading(true);
      // const signInData = await signIn("credentials", {
      //   email: values.email.toLowerCase(),
      //   password: values.password,
      //   redirect: false, // Prevent automatic redirect on success
      // });

      // if (signInData?.error) {
      //   // console.error("Sign-in failed:", signInData.error);
      //   setLoading(false);
      //   form.setError("password", {
      //     type: "manual",
      //     message: "Incorrect email or password",
      //     // message: signInData.error,
      //   });
      //   return;
      // }

      const { data, error } = await supabase.auth.signInWithPassword(values);
      if (error?.message) {
        console.log(error, error.message);
        alert(error.message);
        setLoading(false);
        return;
      } else {
        // Redirect on successful sign-in
        // console.log(data);
        router.push("/map");
        router.refresh();
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <form
        className="bg-white shadow-md rounded px-8 py-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="text-center text-2xl pb-3 font-bold">Log In</h1>
        <div className="">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-1"
          >
            Email
          </label>
          <input
            {...form.register("email")}
            className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline 
            ${form.formState.errors.email ? "border-red-500" : ""}
            `}
            type="text"
            id="email"
            placeholder="Email"
          />
          {form.formState.errors.email ? (
            <p className="text-red-500 text-xs italic">
              {form.formState.errors.email.message}
            </p>
          ) : (
            <div className="h-4" />
          )}
        </div>
        <div className="mb-5 relative">
          <label
            className="block text-gray-700 text-sm font-bold mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            {...form.register("password")}
            className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline 
            ${form.formState.errors.password ? "border-red-500" : ""}
            `}
            id="password"
            type="password"
            placeholder="Password"
          />
          <div className="flex justify-between">
            {form.formState.errors.password ? (
              <p className="text-red-500 text-xs italic">
                {form.formState.errors.password.message}
              </p>
            ) : (
              <div className="h-5" />
            )}
            <Link
              href="#"
              className="font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center">
              <Spinner className="animate-spin h-6"></Spinner>
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

        <button className="flex w-full border-2 py-2 mb-5 rounded-md justify-center items-center font-semibold hover:bg-gray-50">
          <FcGoogle className="h-6 w-6 mr-3" /> Continue with Google
        </button>

        <p className="text-center text-sm font-semibold text-gray-400 mb-3">
          {`Don't have an account? `}
          <Link
            href="/register"
            className="text-blue-500 hover:text-blue-800 hover:cursor-pointer"
          >
            Sign up
          </Link>
        </p>
        <Link
          href="/map"
          className="flex justify-center text-sm font-semibold text-gray-400 hover:cursor-pointer hover:text-gray-500"
        >
          Continue as Guest
        </Link>
      </form>
    </div>
  );
};

export default LoginModal;
