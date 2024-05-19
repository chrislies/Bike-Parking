"use client";
import React, { useEffect, useState } from "react";
import "./css/pendingRequestsDashboard.css";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";
import { Spinner } from "./svgs";
import { NextResponse } from "next/server";
import toast, { Toaster } from "react-hot-toast";

interface PendingRequest {
  id: number;
  site_id: string;
  request_type: string;
  image: string;
  selectedOption: string;
  description: string;
  y_coord: number;
  x_coord: number;
  created_at: string;
  username: string;
  email: string;
}

export default function PendingRequestsDashboard() {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imgDesc, setImgDesc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createSupabaseBrowserClient();

  const fetchPendingRequests = async () => {
    const { data, error } = await supabase.from("Pending").select("*");
    if (error) {
      console.error("Error fetching pending requests:", error);
      setIsLoading(false);
    } else {
      setPendingRequests(data || []);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const handleImageClick = (imageSrc: string, desc: string) => {
    setSelectedImage(imageSrc);
    setImgDesc(desc);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setImgDesc("");
    document.body.style.overflow = "auto";
  };

  const approveRequest = async (req: PendingRequest) => {
    const reqType = req.request_type.toLowerCase();
    if (reqType === "add") {
      // approve add spot request (add spot to 'UserAdded' table)
      const { data: userAddedData, error: userAddedDataError } = await supabase
        .from("UserAdded")
        .insert(
          {
            site_id: `UA.${req.id}`,
            email: req.email,
            username: req.username,
            selectedOption: req.selectedOption,
            x_coord: req.x_coord,
            y_coord: req.y_coord,
          },
          { returning: "minimal" } as any
        );
      if (userAddedDataError) {
        toast.error(`Error in approving spot request`, { duration: 5000 });
      }
      toast.success(`Spot added to 'UserAdded' table`, { duration: 5000 });

      // update 'pendingRequests'
      // remove add spot request from 'UserAdded' table since it has been approved
      // prettier-ignore
      const { data: removeUserAddedData, error: removeUserAddedDataError } = await supabase.from("Pending").delete().eq("id", req.id);
      if (removeUserAddedDataError) {
        toast.error(`Error in removing spot request from 'Pending' table`, {
          duration: 5000,
        });
      }
      // Filter out the rejected request from the pending requests list
      setPendingRequests((prevList) =>
        prevList ? prevList.filter((r) => r.id !== req.id) : []
      );
    } else if (reqType === "delete") {
      // approve delete spot request (add spot to 'BlackList' table)
      const { data, error } = await supabase.from("BlackList").insert(
        {
          location_id: req.site_id,
          description: req.description,
          y_coord: req.y_coord,
          x_coord: req.x_coord,
          username: req.username,
          email: req.email,
        },
        { returning: "minimal" } as any
      );

      if (error) {
        toast.error(`Error in approving delete request`, { duration: 5000 });
      }
      toast.success(`Spot added to 'BlackList' table`, { duration: 5000 });

      // if the delete request if for is a user added spot, remove the spot from 'UserAdded' table
      if (req.site_id.includes("UA")) {
        const { data, error } = await supabase
          .from("UserAdded")
          .delete()
          .eq("site_id", req.site_id);

        if (error) {
          toast.error(
            `Error in removing user added spot from 'UserAdded' table`,
            { duration: 5000 }
          );
        }
      }

      // update 'pendingRequests'
      // remove the deleted spot from 'Pending' table
      // prettier-ignore
      const { data: removePendingData, error: removePendingDataError } = await supabase.from("Pending").delete().eq("id", req.id);
      if (removePendingDataError) {
        toast.error(`Error in removing deleted spot from 'Pending' table`, {
          duration: 5000,
        });
      }

      // Filter out the deleted spot request from the pending requests list
      setPendingRequests((prevList) =>
        prevList ? prevList.filter((r) => r.id !== req.id) : []
      );
    }
  };

  const rejectRequest = async (req: PendingRequest) => {
    const reqType = req.request_type.toLowerCase();
    // reject 'add' or 'delete' request (remove 'id' from 'Pending' table)
    const { data, error } = await supabase
      .from("Pending")
      .delete()
      .eq("id", req.id);

    if (error) {
      toast.error(`Error in rejecting request`, { duration: 5000 });
    }
    toast.success(`Request successfully rejected`, { duration: 5000 });

    // update 'pendingRequests'
    // Filter out the rejected request from the list
    setPendingRequests((prevList) =>
      prevList ? prevList.filter((r) => r.id !== req.id) : []
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="overflow-auto w-screen m-auto mt-[25px]">
        <h1 className="font-bold text-3xl text-center">
          Pending Requests Dashboard
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center gap-2">
            <Spinner className="animate-spin h-6 fill-black"></Spinner>
            <p className="text-base">Loading... </p>
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="text-center">
            <h1>No pending requests</h1>
          </div>
        ) : (
          <table className="w-fit mx-auto">
            <thead>
              <tr>
                <th>ID</th>
                <th>Site ID</th>
                <th>Image</th>
                <th>Request</th>
                <th>Spot Type</th>
                <th className="descCell">Description</th>
                <th>Created At</th>
                <th className="coordCell">LatLng</th>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((request, index) => (
                <tr key={index}>
                  <td>{request.id}</td>
                  <td>{request.site_id || "N/A"}</td>
                  <td>
                    {request.image ? (
                      <img
                        src={request.image}
                        alt="Request"
                        className="image w-[100px] h-[100px] cursor-pointer"
                        onClick={() =>
                          handleImageClick(request.image, request.description)
                        }
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{request.request_type}</td>
                  <td>{request.selectedOption || "N/A"}</td>
                  <td className="descCell">{request.description}</td>
                  <td className="">
                    {formatDate(request.created_at) || "N/A"}
                  </td>
                  <td className="coordCell">
                    <Link
                      href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${request.y_coord},${request.x_coord}`}
                      target="blank"
                      className="hover:underline"
                    >{`${request.y_coord}, ${request.x_coord}`}</Link>
                  </td>
                  <td className="">{request.username || "N/A"}</td>
                  <td className="emailCell">{request.email}</td>
                  <td className="">
                    <div className="flex justify-center gap-3">
                      <button
                        className="actionBtn bg-green-500 p-3 text-white"
                        onClick={() => approveRequest(request)}
                      >
                        &#x2714;
                      </button>
                      <button
                        className="actionBtn bg-red-500 p-3 text-white"
                        onClick={() => rejectRequest(request)}
                      >
                        X
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {isModalOpen && (
          <div className="overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage || ""}
                alt="Enlarged request image"
                className="enlargedImage max-h-[60vh] max-w-[50vw]"
              />
              <p className="mb-10">{`"${imgDesc}"`}</p>
              <button
                className="font-bold text-sm absolute top-0 right-0 bg-gray-400 px-1"
                onClick={closeModal}
              >
                X
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
