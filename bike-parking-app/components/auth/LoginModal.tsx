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
import RegisterModal from "./RegisterModal";

const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const LoginModal: React.FC<{ insideModal: boolean }> = ({ insideModal }) => {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [loginView, setLoginView] = useState(true);
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
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error?.message) {
        toast.error(error.message, { id: "signInWithPasswordError" });
        setLoading(false);
        return;
      } else {
        if (insideModal) {
          location.reload();
          router.refresh();
        } else {
          router.push("/map");
          router.refresh();
        }
      }
    } catch (error) {
      toast.error(`Sign-in error: ${error}`, { id: "signInError" });
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
      {loginView ? (
        <>
          {!insideModal && <Toaster position="top-right" />}
          <div className="w-full max-w-sm">
            <form
              className={`bg-white ${
                insideModal ? "px-4" : "px-8 py-6 shadow-md rounded"
              }`}
            >
              {!insideModal && (
                <h1 className="text-center text-2xl pb-3 font-bold">Log In</h1>
              )}
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
                    href="/forgot-password"
                    className="font-bold text-sm text-blue-500 hover:text-blue-800"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <button
                onClick={form.handleSubmit(onSubmit)}
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
              <button
                onClick={loginWithGoogle}
                className="flex w-full border-2 py-2 mb-5 rounded-md justify-center items-center font-semibold hover:bg-gray-50"
              >
                <FcGoogle className="h-6 w-6 mr-3" /> Continue with Google
              </button>
              {/* prettier-ignore */}
              <p className={`text-center text-sm font-semibold text-gray-400 ${insideModal ? null : "mb-3"}`}>
              {`Don't have an account? `}
              {insideModal ? (
                <span className="text-blue-500 hover:text-blue-800 cursor-pointer"
                onClick={()=>setLoginView(false)}>
                  Sign up
                </span>
              ) : (
                <Link
                  href="/register"
                  className="text-blue-500 hover:text-blue-800"
                >
                  Sign up
                </Link>
              )}
            </p>
              {!insideModal && (
                <div className="text-center">
                  <Link
                    href="/map"
                    className="text-sm font-semibold text-gray-400 hover:cursor-pointer hover:text-gray-500"
                  >
                    Continue as Guest
                  </Link>
                </div>
              )}
            </form>
          </div>
        </>
      ) : (
        <RegisterModal insideModal={true} />
      )}
    </>
  );
};

export default LoginModal;
