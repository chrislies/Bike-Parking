"use client";
import Loader from "@/components/Loader";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PendingRequest {
  id: number;
  x_coord: number;
  y_coord: number;
  request_type: string;
  created_at: string;
  image: string;
  email: string;
  description: string;
}

export default function PendingRequestsPage() {
  const supabase = createSupabaseBrowserClient();

  const [isLoading, setIsLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<
    PendingRequest[] | null
  >(null);

  const session = useSession();
  const username = session?.user.user_metadata.username;
  const email = session?.user.email;

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const { data, error } = await supabase.from("Pending").select();

        if (error) {
          throw new Error(`Error fetching pending requests: ${error.message}`);
        }

        setPendingRequests(data || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
        setIsLoading(false);
      }
    };

    fetchPendingRequests();
  });

  return (
    <div>
      <h1 className="z-[-1] absolute inset-0 flex justify-center text-3xl font-bold underline mt-5">
        Pending Requests
      </h1>
      {isLoading ? (
        <Loader />
      ) : pendingRequests === null ? (
        <h1 className="absolute inset-0 flex justify-center items-center text-2xl">
          Loading...
        </h1>
      ) : pendingRequests.length === 0 ? (
        <div className="absolute inset-0 flex flex-col justify-center items-center gap-4">
          <h1 className="text-2xl">No pending requests!</h1>
        </div>
      ) : (
        <div className="my-20 flex flex-col justify-center items-center">
          {pendingRequests.map((request: PendingRequest, index: number) => (
            <div key={index} className="flex flex-row items-center gap-10 my-6">
              <span className="font-bold text-xl">{`${index + 1})`}</span>
              <Image
                src={request.image}
                alt="Request Image"
                className="w-24 h-24"
              />
              <div>
                <p>Email: {request.email}</p>
                <p>X Coordinate: {request.x_coord}</p>
                <p>Y Coordinate: {request.y_coord}</p>
                <p>Request Type: {request.request_type}</p>
                <p>Description: {request.description}</p>
                <p>Created At: {request.created_at}</p>
              </div>
            </div>
          ))}
          <Link href="/" className="hover:underline font-bold text-lg">
            {`<-- Go back to map`}
          </Link>
        </div>
      )}
    </div>
  );
}
