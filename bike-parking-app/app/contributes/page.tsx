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
      <h1 className="text-3xl font-bold underline">Your Contributions</h1>
      <div className="mt-10">
        <Link href="/reports" className="mx-4 p-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">
          Check Your Reports
        </Link>
        <Link href="/requests" className="mx-4 p-4 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300">
          Check Your Requests
        </Link>
      </div>
    </div>
  );
}