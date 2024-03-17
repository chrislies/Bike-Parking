import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const RegisterModal = () => {
  return ( 
    <div className="w-full max-w-sm">
    <form className="bg-white shadow-md rounded px-8 py-6">
      <h1 className='text-center text-2xl pb-3 font-bold'>Sign Up</h1>
      <div className="mb-4">
        <label htmlFor="username" className='block text-gray-700 text-sm font-bold mb-1'>
          Username
        </label>
        <input className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" type="text" id="username" placeholder='Username' />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className='block text-gray-700 text-sm font-bold mb-1'>
          Email
        </label>
        <input className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" type="text" id="email" placeholder='Email' />
      </div>
      <div className="mb-5 relative">
        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="password">
          Password
        </label>
        <input className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" />
        {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
      </div>
      <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline" type="button">
        Sign Up
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

      <button className="flex w-full border-2 py-2 mb-5 rounded-md justify-center items-center font-semibold hover:bg-gray-50">
        <FcGoogle className="h-6 w-6 mr-3"/> Sign up with Google
      </button>


      <p className="text-center text-sm font-semibold text-gray-400 mb-3">Already have an account? <Link href="/login" className="text-blue-500 hover:text-blue-800 hover:cursor-pointer">Log In</Link></p>
    </form>
  </div>
  );
}
 
export default RegisterModal;