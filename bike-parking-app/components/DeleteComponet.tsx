import React, { useState, useEffect, MouseEvent, FC, useRef } from 'react';
import "./css/style.css";
import useSession from "@/utils/supabase/use-session";
import toast, { Toaster } from "react-hot-toast";
import { debounce } from "@/hooks/useDebounce";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import axios from "axios";

interface DeleteComponentProps {
    x?: number;
    y?: number;
    site_id?: string;


}


const DeleteComponent: FC<DeleteComponentProps> = ({ x, y, site_id }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
  //  const [showFileInput, setShowFileInput] = useState(false);
    const session = useSession();
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [description, setdescription] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);


    const username = session?.user.user_metadata.username;
    const uuid = session?.user.id;
    const email = session?.user.email;

    const openDeleteModal = () => {
        setDeleteModalOpen(true); // Open the modal when the button is clicked
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false); // Close the modal when needed
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
                const reader = new FileReader();
                reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
                    const target = loadEvent.target as FileReader;
                    if (target && target.result) {
                        setSelectedImage(target.result.toString());
                    }
                };
                reader.readAsDataURL(file);
            } else {
                console.log("Only JPG and PNG files are allowed.");
            }
        }
    };
    const handleRemoveImage = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setSelectedImage(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDeleteRequest = async () => {

        if (!uuid) {
            toast.error("Sign in to delete locations!");
            return;
        }

        // Check if image and description are provided
        if (!description) {
            toast.error("Please provide a description!");
            return;
        }


        setDeleteModalOpen(false);
        const updatePending = debounce(async () => {
            try {
                const requestData = {
                    x_coord: x,
                    y_coord: y,
                    site_id: site_id,
                    request_type: "Delete",
                    email: email,
                    description: description,
                    image: selectedImage,

                };

                const response = await axios.post("/api/request", requestData);
                if (response.status === 200) {
                    console.log(requestData.image);
                    console.log("Request successfully added:", response.data);
                } else {
                    console.log("Error adding request:", response.statusText);
                }
            } catch (error) {
                console.error("Server error:", error);
            }
        }, 300)
        updatePending();
    };

    return (
        <div>
            <button className="delete-button" onClick={openDeleteModal}>Delete Request</button>
            {isDeleteModalOpen &&  (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={closeDeleteModal}>&times;</span>
                        <h3 className="report-title">Enter Description</h3>
                        <input
                            ref={fileInputRef}
                            className="file-upload-button"
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileChange}
                        />
                        {selectedImage && (
                    <div>
                      <img
                        src={selectedImage}
                        alt="Preview"
                        style={{ width: "100%", marginTop: "10px" }}
                      />
                      <button onClick={handleRemoveImage}>Remove</button>
                      <button
                        onClick={handleDeleteRequest}
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          right: "10px",
                          zIndex: 1000,
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  )}
                        <textarea
                            className="delete-description"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setdescription(e.target.value)}
                        ></textarea>
                       
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteComponent;