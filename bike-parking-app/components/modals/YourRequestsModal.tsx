"use client";
import { useUserRequestsStore, UserRequest } from "@/app/stores/userRequestsStore";
import { useUserStore } from "@/app/stores/userStore";
import { useCallback, useEffect } from "react";
import { BsTrash3Fill } from "react-icons/bs";
import { Spinner } from "../svgs";
import { formatDate } from "@/lib/formatDate";
import { useMapEvents } from "react-leaflet";
import Image from "next/image";

interface YourRequestsModalProps {
  onClose: () => void;
}

export default function YourRequestsModal({ onClose }: YourRequestsModalProps) {
  const { requests, isLoading, fetchUserRequests, removeUserRequest, hasFetched } =
    useUserRequestsStore();
  const { uuid, username } = useUserStore();
  const map = useMapEvents({});

  useEffect(() => {
    if (uuid && username && !hasFetched) {
      fetchUserRequests(uuid, username);
    }
  }, [uuid, username, hasFetched]);

  const handleFlyTo = useCallback(
    (request: UserRequest) => {
      if (request.y_coord && request.x_coord) {
        onClose(); // close the modal
        const currentZoom = map.getZoom() > 19 ? map.getZoom() : 20;
        map.flyTo([request.y_coord, request.x_coord], currentZoom, {
          animate: true,
          duration: 1.5,
        });
      }
    },
    [map, onClose]
  );

  return (
    <div>
      {isLoading ? (
        <div className="min-h-[15vh] flex justify-center items-center gap-2">
          <Spinner className="animate-spin h-6 fill-blue-700"></Spinner>
          <p className="text-base">Loading... </p>
        </div>
      ) : requests === null ? (
        <div className="min-h-[15vh] flex justify-center items-center gap-2">
          <Spinner className="animate-spin h-6 fill-blue-700"></Spinner>
          <p className="text-base">Loading... </p>
        </div>
      ) : requests.length === 0 ? (
        <div className="min-h-[15vh] flex justify-center items-center gap-2">
          <h1 className="text-base">You currently have no requests.</h1>
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          {requests.map((request, index) => (
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
                      <strong>Requested on:</strong> {formatDate(request.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeUserRequest(request.id)}
                  className="col-span-1 justify-self-center p-2 hover:bg-red-100 hover:rounded-full"
                >
                  <BsTrash3Fill className="fill-red-500 h-6 w-6" />
                </button>
              </div>
              {index != requests.length - 1 && <div className="border-[1px] w-full my-3" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
