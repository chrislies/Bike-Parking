"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import { useCallback, useEffect, useState } from "react";
import { BsTrash3Fill } from "react-icons/bs";
import { Spinner } from "../svgs";
import { formatDate } from "@/lib/formatDate";
import { useMapEvents } from "react-leaflet";
import Image from "next/image";

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

export default function YourRequestsModal() {
  const [isLoading, setIsLoading] = useState(true);
  // prettier-ignore
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[] | null>(null);

  const supabase = createSupabaseBrowserClient();
  const session = useSession();
  const uuid = session?.user.id;
  const username = session?.user.user_metadata.username;
  const email = session?.user.email;

  const map = useMapEvents({});

  const fetchPendingRequests = useCallback(async () => {
    if (!uuid) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("Pending")
        .select()
        .eq("email", email);

      if (error) {
        throw new Error(`Error fetching pending requests: ${error.message}`);
      }

      setPendingRequests(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      setIsLoading(false);
    }
  }, [uuid, email, supabase]);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  const removeRequest = async (requestId: number) => {
    const { error } = await supabase
      .from("Pending")
      .delete()
      .eq("id", requestId);

    if (error) {
      console.error(`Error removing request: ${error}`);
    } else {
      setPendingRequests(
        (prevList) =>
          prevList?.filter((request) => request.id !== requestId) || []
      );
    }
  };

  const handleFlyTo = useCallback(
    (request: PendingRequest) => {
      if (request.y_coord && request.x_coord) {
        const currentZoom = map.getZoom() > 19 ? map.getZoom() : 20;
        map.flyTo([request.y_coord, request.x_coord], currentZoom, {
          animate: true,
          duration: 1.5,
        });
      }
    },
    [map]
  );

  return (
    <div>
      {isLoading ? (
        <div className="min-h-[15vh] flex justify-center items-center gap-2">
          <Spinner className="animate-spin h-6 fill-blue-700"></Spinner>
          <p className="text-base">Loading... </p>
        </div>
      ) : pendingRequests === null ? (
        <div className="min-h-[15vh] flex justify-center items-center gap-2">
          <Spinner className="animate-spin h-6 fill-blue-700"></Spinner>
          <p className="text-base">Loading... </p>
        </div>
      ) : pendingRequests.length === 0 ? (
        <div className="min-h-[15vh] flex justify-center items-center gap-2">
          <h1 className="text-base">You currently have no requests.</h1>
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          {pendingRequests.map((request, index) => (
            <div key={index}>
              <div className="grid grid-flow-col grid-cols-12 w-full items-center">
                <button
                  className="appearance-none"
                  onClick={() => handleFlyTo(request)}
                >
                  <span className="col-span-1 justify-self-center font-bold text-xl">{`${
                    index + 1
                  })`}</span>
                </button>
                <div
                  className="col-span-10 justify-self-start w-full cursor-pointer"
                  onClick={() => handleFlyTo(request)}
                >
                  {request.image && (
                    <div className="relative flex justify-center w-full h-32">
                      <Image
                        src={request.image}
                        alt="Your requested contribution image"
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  )}
                  <div className="text-center">
                    <p>
                      <strong>Request Type:</strong> {request.request_type}
                    </p>
                    <p>
                      <strong>Description:</strong> {request.description}
                    </p>
                    <p>
                      <strong>Requested on:</strong>{" "}
                      {formatDate(request.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeRequest(request.id)}
                  className="col-span-1 justify-self-center p-2 hover:bg-red-100 hover:rounded-full"
                >
                  <BsTrash3Fill className="fill-red-500 h-6 w-6" />
                </button>
              </div>
              {index != pendingRequests.length - 1 && (
                <div className="border-[1px] w-full my-3" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
