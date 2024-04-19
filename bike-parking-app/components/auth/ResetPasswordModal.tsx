export default function ResetPasswordModal() {
  return (
    <div>
      <form className="bg-white shadow-md rounded px-8 py-6 max-w-sm" action="">
        <h1 className="font-semibold text-2xl text-center mb-4">
          Reset Password
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline
                `}
              id="password"
              type="password"
              placeholder="New Password"
            />

            <div className="h-5" />
          </div>
          <div className="flex flex-col">
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <input
              className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline
                `}
              id="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
            />
            <p className="text-red-500 text-xs italic mb-1"></p>

            <div className="h-5" />
          </div>
        </div>
        <button
          className="w-full mt-1 mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
