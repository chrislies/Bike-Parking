"use client";

import Loader from "@/components/Loader";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function ContributionsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold underline mb-10">Your Contributions</h1>
      <div className="flex w-full justify-around items-start px-10">
        <div className="text-center">
          <Link href="/reports" className="block p-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">
            Check Your Reports
          </Link>
          <p className="mt-2 text-2xl text-gray-600">View all the reports you have submitted.</p>
        </div>
        <div className="text-center">
          <Link href="/requests" className="block p-4 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300">
            Check Your Requests
          </Link>
          <p className="mt-2 text-2xl text-gray-600">Manage your pending requests for site changes.</p>
        </div>
      </div>
      <div className="mt-10 w-full flex justify-center">
        <Link href="/" className="hover:underline font-bold text-lg">
          {`<-- Go back to map`}
        </Link>
      </div>
    </div>
  );
}