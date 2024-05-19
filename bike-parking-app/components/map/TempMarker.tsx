import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { tempIcon } from "../Icons";
import "../css/tempMarker.css";

// Convert a Base64 encoded string to a Blob object
function base64ToBlob(base64: string): Blob {
  const match = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  if (!match || match.length !== 2) {
    throw new Error("Invalid Base64 string");
  }
  const mime = match[1];

  const byteString = atob(base64.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mime });
}

const TempMarker = () => {
  const [tempMarkerPos, setTempMarkerPos] = useState<L.LatLng | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showFileInput, setShowFileInput] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const session = useSession();
  const username = session?.user.user_metadata.username;
  const uuid = session?.user.id;
  const email = session?.user.user_metadata.email;
  const request_type = "Add";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState("");

  //For update Add
  const [showAlert, setShowAlert] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  // Listen for events on the map
  useMapEvents({
    // When the user clicks on the map, add a temporary marker and display the file input box
    click: (e) => {
      setTempMarkerPos(e.latlng);
      setShowFileInput(true);
      setSelectedImage(null);
      setDescription("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },

    // remove temp marker when pop-uo close
    popupclose: (e) => {
      setTempMarkerPos(null);
      setShowFileInput(false);
      setSelectedImage(null);
      setDescription("");
    },
  });

  // Monitor changes in showFileInput status
  useEffect(() => {
    if (!showFileInput) {
      setSelectedImage(null);
    }
  }, [showFileInput]);

  const addRequest = async () => {
    try {
      const requestData = {
        image: selectedImage,
        x_coord: tempMarkerPos?.lng,
        y_coord: tempMarkerPos?.lat,
        request_type: request_type,
        email: email,
        description: description,
        selectedOption: selectedOption,
      };

      const response = await axios.post("/api/request", requestData);
      if (response.status === 200) {
        // console.log("Request successfully added:", response.data);
        toast.success("Request successfully added", {
          id: "requestAddSuccess",
        });
        setTempMarkerPos(null);
      } else {
        alert(`Error adding request:, ${response.statusText}`);
      }
    } catch (error) {
      console.error("Server error:", error);
    }
  };

  // Check if the user is logged in. Then, if there is an image selected, call base64ToBlob function to covert the object
  const handleSubmit = async () => {
    if (!uuid) {
      toast.error("Sign in to submit request!", {
        id: "signInToSubmitRequestError",
      });
      return;
    }
    if (selectedOption === "") {
      toast.error("Please select a type", { id: "selectTypeError" });
      return;
    }

    addRequest();

    const request_type = "Add";
    let imageBlob: Blob | null = null;
    if (selectedImage !== null) {
      imageBlob = base64ToBlob(selectedImage);
    }
    // console.log(imageBlob);
    // console.log(tempMarkerPos?.lat);
    // console.log(tempMarkerPos?.lng);
    // console.log(request_type);
    // console.log(description);
    // console.log(selectedOption);

    setDescription("");
    setSelectedOption("");
  };

  // Handle file selection input and Set the selectedImage state so that the image preview is displayed.
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

  // Clear the selectedImage state and reset the file input box, thereby removing the image preview.
  const handleRemoveImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    setShowAlert(false);
    // console.log("Option selected:", event.target.value);
  };

  return (
    <>
      {tempMarkerPos && (
        <Marker position={tempMarkerPos} icon={tempIcon}>
          <Popup
            className="custom-popup"
            autoClose={false}
            closeOnClick={false}
          >
            <p className="!m-0 !mb-1 !p-0 font-bold underline">
              Add a new parking spot here:
            </p>
            <p className="!m-0 !p-0">longitude: {tempMarkerPos.lng}</p>
            <p className="!m-0 !mb-1 !p-0">latitude: {tempMarkerPos.lat}</p>
            {showFileInput && (
              <div className="upload-container">
                {!selectedImage ? (
                  <>
                    <div
                      className="dropzone"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Drop your picture here
                    </div>
                    <input
                      ref={fileInputRef}
                      className="file-upload-button"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </>
                ) : (
                  <div>
                    <img
                      src={selectedImage}
                      alt="Preview"
                      style={{ width: "100%" }}
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="removeButton"
                    >
                      Remove
                    </button>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please describe the new parking spot..."
                      style={{
                        width: "100%",
                        marginTop: "10px",
                        minHeight: "60px",
                        maxHeight: "120px",
                        minWidth: "100%",
                        resize: "vertical",
                      }}
                      className="border rounded-md border-black/40 px-1"
                      maxLength={250}
                    />
                    <div className="options" style={{ marginTop: "10px" }}>
                      <p className="!m-0 !p-0 !mb-2 font-bold underline">
                        Choose spot type:
                      </p>
                      <label className="option">
                        <input
                          type="radio"
                          name="reportOption"
                          value="u rack"
                          onChange={handleOptionChange}
                        />
                        U-Rack
                      </label>
                      <label className="option">
                        <input
                          type="radio"
                          name="reportOption"
                          value="large hoop"
                          onChange={handleOptionChange}
                        />
                        Large Hoop
                      </label>
                      <label className="option">
                        <input
                          type="radio"
                          name="reportOption"
                          value="small hoop"
                          onChange={handleOptionChange}
                        />
                        Small Hoop
                      </label>
                      <label className="option">
                        <input
                          type="radio"
                          name="reportOption"
                          value="wave"
                          onChange={handleOptionChange}
                        />
                        Wave Rack
                      </label>
                      <label className="option">
                        <input
                          type="radio"
                          name="reportOption"
                          value="opal"
                          onChange={handleOptionChange}
                        />
                        Opal Rack
                      </label>
                      <label className="option">
                        <input
                          type="radio"
                          name="reportOption"
                          value="staple"
                          onChange={handleOptionChange}
                        />
                        Staple Rack
                      </label>
                      <label className="option">
                        <input
                          type="radio"
                          name="reportOption"
                          value="sign"
                          onChange={handleOptionChange}
                        />
                        Street Sign
                      </label>
                    </div>
                    <button
                      onClick={handleSubmit}
                      className="submit-button flex justify-center w-full"
                      style={{
                        marginTop: "10px",
                        zIndex: 1000,
                      }}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            )}
          </Popup>
        </Marker>
      )}
    </>
  );
};

export default TempMarker;
