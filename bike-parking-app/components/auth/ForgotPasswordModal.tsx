"use client";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "../svgs";
import toast, { Toaster } from "react-hot-toast";

const EmailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

export default function ForgotPasswordModal() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<z.infer<typeof EmailSchema>> = async (
    values
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.href}reset-password`,
        }
      );
      toast.success(
        `We've sent password reset instructions to ${values.email}`,
        { duration: 20000, id: "resetPasswordForEmailSuccess" }
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(`Error: ${error}`, { id: "resetPasswordForEmailError" });
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="w-full max-w-sm">
        <form className="bg-white shadow-md rounded px-8 py-6">
          <h1 className="font-semibold text-2xl text-center mb-4">
            Forgot password?
          </h1>
          <p className="mb-8 text-base max-md:leading-5 ">
            {`No worries! Please enter the email address associated with your
            account. We'll send you an email with instructions on how to reset
            your password.`}
          </p>
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-1"
          >
            Enter your email
          </label>
          <input
            type="text"
            id="email"
            placeholder="Email"
            {...form.register("email")}
            className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline
            ${form.formState.errors.email ? "border-red-500" : ""}`}
          />
          {form.formState.errors.email ? (
            <p className="text-red-500 text-xs italic">
              {form.formState.errors.email.message}
            </p>
          ) : (
            <div className="h-4" />
          )}
          <button
            onClick={form.handleSubmit(onSubmit)}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold mt-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center">
                <Spinner className="animate-spin h-6"></Spinner>
              </div>
            ) : (
              "Submit"
            )}
          </button>
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-400 hover:underline hover:text-gray-500"
            >
              Return to Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
