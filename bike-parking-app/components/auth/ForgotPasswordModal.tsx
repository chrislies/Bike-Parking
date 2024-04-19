import Link from "next/link";

export default function ForgotPasswordModal() {
  return (
    <div>
      <form className="bg-white shadow-md rounded px-8 py-6 max-w-sm" action="">
        <h1 className="font-semibold text-2xl text-center mb-4">
          Forgot password?
        </h1>
        <p className="mb-8 text-base max-md:leading-5 ">
          No worries! Please enter the email address associated with your
          account. We'll send you an email with instructions on how to reset
          your password.
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
          className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline`}
        />
        <div className="h-4" />
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Submit
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
  );
}
