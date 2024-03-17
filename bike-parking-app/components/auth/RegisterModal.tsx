import Link from "next/link";

const RegisterModal = () => {
  return ( 
    <div className="w-full max-w-sm">
    <form className="bg-white shadow-md rounded px-8 py-6">
      <h1 className='text-center text-2xl pb-4 font-bold'>Sign Up</h1>
      <div className="mb-4">
        <label htmlFor="username" className='block text-gray-700 text-sm font-bold mb-1'>
          Username
        </label>
        <input className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" type="text" id="username" placeholder='Username' />
        <p className="hidden text-red-500 text-xs italic">Please choose a password.</p>
      </div>
      <div className="mb-5 relative">
        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="password">
          Password
        </label>
        <input className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" />
        {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
        <Link href="#" className="flex justify-end font-bold text-sm text-blue-500 hover:text-blue-800">
          Forgot Password?
        </Link>

      </div>
      <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline" type="button">
        Sign In
      </button>

      <div className='flex justify-center my-4'>
        <div className='w-full text-gray-400 flex items-center'>
          <div className='border-t-2 w-full' />
        </div>
        <p className="text-gray-400 px-4">Or</p>
        <div className='w-full text-gray-400 flex items-center'>
          <div className='border-t-2 w-full' />
        </div>
      </div>

      <p className="text-center text-sm font-semibold text-gray-400 mb-3">Already have an account? <Link href="/login" className="text-blue-500 hover:text-blue-800 hover:cursor-pointer">Log In</Link></p>
    </form>
  </div>
  );
}
 
export default RegisterModal;