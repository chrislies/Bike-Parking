"use client";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Spinner } from "../svgs";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";

const PasswordSchema = z
  .object({
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

export default function ResetPasswordModal() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const form = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: { password: "" },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (!session) {
        toast.error("You need to click the reset link from your email first.");
        router.push("/forgot-password");
      }
    };

    checkAuth();
  }, [supabase, router]);

  const onSubmit: SubmitHandler<z.infer<typeof PasswordSchema>> = async (
    values
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: values.password,
      });
      
      if (error) {
        toast.error(`Error updating password: ${error.message}`, { 
          id: "updateUserError",
          duration: 10000 
        });
        setLoading(false);
        return;
      }

      if (data) {
        toast.success("Password successfully reset!", {
          duration: 10000,
          id: "updateUserSuccessful",
        });
        
        // Sign out the user to force them to log in with new password
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(`Unexpected error: ${error}`, { 
        id: "updateUserUnexpectedError",
        duration: 10000 
      });
    }
  };

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="w-full max-w-sm">
          <div className="bg-white shadow-md rounded px-8 py-6 text-center">
            <Spinner className="animate-spin h-8 mx-auto mb-4" />
            <p>Verifying your reset link...</p>
          </div>
        </div>
      </>
    );
  }

  // Don't render the form if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="w-full max-w-sm">
        <form className="bg-white shadow-md rounded px-8 py-6">
          <h1 className="font-semibold text-2xl text-center mb-4">
            Reset Password
          </h1>
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label
                className="block text-gray-700 text-sm font-bold mb-1"
                htmlFor="password"
              >
                New Password
              </label>
              <input
                {...form.register("password")}
                className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline
                ${form.formState.errors.password ? "border-red-500" : ""}
                `}
                id="password"
                type="password"
                placeholder="New Password"
              />
              {form.formState.errors.password ? (
                <p className="text-red-500 text-xs italic">
                  {form.formState.errors.password.message}
                </p>
              ) : (
                <div className="h-4" />
              )}
            </div>
            <div className="flex flex-col">
              <label
                className="block text-gray-700 text-sm font-bold mb-1"
                htmlFor="confirmPassword"
              >
                Confirm New Password
              </label>
              <input
                {...form.register("confirmPassword")}
                className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline
                  ${
                    form.formState.errors.confirmPassword
                      ? "border-red-500"
                      : ""
                  }`}
                id="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
              />
              {form.formState.errors.confirmPassword ? (
                <p className="text-red-500 text-xs italic">
                  {form.formState.errors.confirmPassword.message}
                </p>
              ) : (
                <div className="h-4" />
              )}
            </div>
          </div>
          <button
            onClick={form.handleSubmit(onSubmit)}
            className="w-full mt-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
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
        </form>
      </div>
    </>
  );
}
