"use client";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { formatDate } from "@/lib/formatDate";
import { Spinner } from "../svgs";
import axios from "axios";

interface Report {
  option: string;
  description: string;
  username: string;
  created_at: string;
}

interface ReportData {
  username: string;
  option: string;
  site_id?: string;
  description: string;
  x?: number;
  y?: number;
}

interface ModalProps {
  siteId?: string;
  x?: number;
  y?: number;
  spot_type?: string;
  rack_type?: string;
  address?: string;
}

const ReportComponent: React.FC<ModalProps> = ({
  siteId,
  x,
  y,
  spot_type,
  rack_type,
  address,
}) => {
  const supabase = createSupabaseBrowserClient();
  const session = useSession();
  const username = session?.user.user_metadata.username;
  const uuid = session?.user.id;
  const email = session?.user.email;

  const [isCommunityReportsModalOpen, setIsCommunityReportsModalOpen] =
    useState(false);
  const [reportView, setReportView] = useState(false);
  const [deleteView, setDeleteView] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [deleteDescription, setDeleteDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [spotReports, setSpotReports] = useState<Report[]>([]);
  const [reportFormOptionError, setReportFormOptionError] = useState("");
  const [reportFormDescriptionError, setReportFormDescriptionError] =
    useState("");
  const [reportFormSuccess, setReportFormSuccess] = useState("");
  const [reportFormLoading, setReportFormLoading] = useState(false);
  const [deleteFormSuccess, setDeleteFormSuccess] = useState("");
  const [deleteFormLoading, setDeleteFormLoading] = useState(false);
  const [deleteFormDescriptionError, setDeleteFormDescriptionError] =
    useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (uuid) {
      setSelectedOption(event.target.value);
      setOtherText(""); // Clear the text input when a radio button is selected
      setReportFormOptionError("");
      setReportFormDescriptionError("");
    } else {
      alert("Sign in to file a report!");
      return;
    }
  };

  const handleTextFocus = () => {
    setSelectedOption(""); // Deselect radio buttons when text input is focused
    setReportFormOptionError("");
    setReportFormDescriptionError("");
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (uuid) {
      setOtherText(event.target.value);
      setReportFormOptionError("");
      setReportFormDescriptionError("");
    } else {
      alert("Sign in to file a report!");
      return;
    }
  };

  const handleClose = () => {
    setReportView(false);
    setDeleteView(false);
    setIsCommunityReportsModalOpen(false);
    setSelectedImage(null);
  };

  const fetchSpotReports = async () => {
    if (siteId) {
      const { data, error } = await supabase
        .from("Report")
        .select("created_at, username, option, description")
        .eq("location_id", siteId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reports:", error);
      } else {
        setSpotReports(data);
      }
    } else {
      const { data, error } = await supabase
        .from("Report")
        .select("created_at, username, option, description")
        .eq("x", x)
        .eq("y", y)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reports:", error);
      } else {
        setSpotReports(data);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSpotReports();
  }, []);

  //Generate button text based on the number of reports
  const numSpotReports = spotReports.length;
  const reportButtonText =
    numSpotReports > 0
      ? numSpotReports === 1
        ? "[1 report]"
        : `[${numSpotReports} reports]`
      : "Report";

  useEffect(() => {
    if (reportFormSuccess || deleteFormSuccess) {
      const timer = setTimeout(() => {
        setReportFormSuccess("");
        setDeleteFormSuccess("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [reportFormSuccess, deleteFormSuccess]);

  const handleReportFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uuid) {
      const option = selectedOption || otherText.trim();
      if (!option) {
        setReportFormOptionError("Please select or enter an option.");
        return;
      }
      if (!reportDescription.trim()) {
        setReportFormDescriptionError("Please provide a description.");
        return;
      }
      // console.log(`${option}: ${reportDescription}`);
      // reset the form state
      setSelectedOption("");
      setOtherText("");
      setReportDescription("");

      const reportData: ReportData = {
        username: username,
        option: option,
        site_id: siteId,
        description: reportDescription,
        x: x,
        y: y,
      };

      await addReport(reportData);
    } else {
      alert("Sign in to file a report!");
      return;
    }
  };

  const addReport = async (reportData: ReportData) => {
    try {
      setReportFormLoading(true);
      const { username, option, site_id, description, x, y } = reportData;

      const requestData = {
        username: username,
        option: option,
        site_id: site_id,
        description: description,
        x: x,
        y: y,
      };

      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setReportFormSuccess("Report filed.");
        setReportFormLoading(false);
        fetchSpotReports();
      } else {
        console.error("Error adding report:", response.statusText);
        setReportFormLoading(false);
      }
    } catch (error) {
      console.error("Server error when adding report:", error);
      setReportFormLoading(false);
    }
  };

  const handleDeleteFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (uuid) {
      if (!deleteDescription.trim()) {
        setDeleteFormDescriptionError("Please provide a description.");
        return;
      }

      const updatePending = async () => {
        try {
          setDeleteFormLoading(true);
          const requestData = {
            x_coord: x,
            y_coord: y,
            site_id: siteId,
            request_type: "Delete",
            selectedOption: rack_type,
            email: email,
            username: username,
            description: deleteDescription.trim(),
            image: selectedImage,
          };

          const response = await axios.post("/api/request", requestData);
          if (response.status === 200) {
            // reset the form state
            setDeleteDescription("");
            setSelectedImage("");
            setDeleteFormLoading(false);
            setDeleteFormSuccess(
              "Deletion request submitted. Our team will promptly review."
            );
            // console.log("Request successfully added:", response.data);
          } else {
            // console.log("Error adding request:", response.statusText);
            setDeleteDescription("");
            setSelectedImage("");
            setDeleteFormLoading(false);
          }
        } catch (error) {
          console.error("Server error:", error);
          setDeleteDescription("");
          setSelectedImage("");
          setDeleteFormLoading(false);
        }
      };
      updatePending();
    } else {
      alert("Sign in to submit a deletion request!");
      return;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (
        file &&
        (file.type === "image/jpeg" ||
          file.type === "image/jpg" ||
          file.type === "image/png" ||
          file.type === "image/heic")
      ) {
        const reader = new FileReader();
        reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
          const target = loadEvent.target as FileReader;
          if (target && target.result) {
            setSelectedImage(target.result.toString());
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert("Only JPG, JPEG, PNG, and HEIC files are allowed.");
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

  return (
    <>
      <button
        title="View reports"
        aria-label="View reports"
        className="!m-0 !p-0 max-w-fit text-sm font-sans text-red-500 hover:underline"
        onClick={() => {
          setIsCommunityReportsModalOpen(true);
        }}
      >
        {reportButtonText}
      </button>
      <Transition
        appear
        show={isCommunityReportsModalOpen}
        as={Fragment}
      >
        <Dialog
          as="div"
          className="relative z-[9999]"
          onClose={handleClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`w-full transform overflow-hidden rounded-2xl bg-white p-6 pb-2 text-left align-middle shadow-xl transition-all ${
                    reportView || deleteView ? "max-w-fit" : "max-w-lg"
                  }`}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    <div className="flex justify-center">
                      {reportView && (
                        <button
                          title="Go back"
                          aria-label="Go back"
                          className="flex items-center"
                          onClick={() => setReportView(false)}
                        >
                          <span className="absolute left-[22px] text-2xl cursor-pointer transition-all ease-in-out duration-100 hover:translate-x-[-3px]">
                            &larr;
                          </span>
                        </button>
                      )}
                      {deleteView && (
                        <button
                          title="Go back"
                          aria-label="Go back"
                          className="flex items-center"
                          onClick={() => setDeleteView(false)}
                        >
                          <span className="absolute left-[22px] text-2xl cursor-pointer transition-all ease-in-out duration-100 hover:translate-x-[-3px]">
                            &larr;
                          </span>
                        </button>
                      )}
                      <h1 className="bg-gray-300 rounded-xl py-1 px-4 shadow-inner text-xl font-bold tracking-wider uppercase max-w-fit">
                        {reportView
                          ? "File a Report"
                          : deleteView
                          ? "Delete Spot"
                          : "Reports"}
                      </h1>
                    </div>
                    {reportView || deleteView ? (
                      <div className="font-sans text-center mt-1 mb-4">
                        <p className="font-extrabold">{`${
                          rack_type ||
                          (spot_type === "sign"
                            ? "Street Sign"
                            : "Bike Shelter")
                        } ${siteId}`}</p>
                        <p
                          className={`${
                            address && address.length > 30
                              ? "lowercase text-sm"
                              : null
                          } `}
                        >
                          {address}
                        </p>
                      </div>
                    ) : null}
                  </Dialog.Title>
                  {reportView ? (
                    <>
                      <form action="">
                        <p
                          className={`font-bold underline ${
                            reportFormOptionError
                              ? "text-red-500"
                              : "text-black"
                          }`}
                        >
                          Choose option:
                        </p>
                        <div className={`ml-4`}>
                          <label className={`block w-fit`}>
                            <input
                              type="radio"
                              name="radio"
                              value="Theft"
                              checked={selectedOption === "Theft"}
                              onChange={handleRadioChange}
                            />
                            {` Theft`}
                          </label>
                          <label className={`block w-fit`}>
                            <input
                              type="radio"
                              name="radio"
                              value="Unsafe"
                              checked={selectedOption === "Unsafe"}
                              onChange={handleRadioChange}
                            />
                            {` Unsafe`}
                          </label>
                          <label className={`block w-fit`}>
                            <input
                              type="radio"
                              name="radio"
                              value="Unsecure"
                              checked={selectedOption === "Unsecure"}
                              onChange={handleRadioChange}
                            />
                            {` Unsecure`}
                          </label>
                          <label className={`block w-fit`}>
                            <input
                              type="radio"
                              name="radio"
                              value="Inaccurate"
                              checked={selectedOption === "Inaccurate"}
                              onChange={handleRadioChange}
                            />
                            {` Inaccurate`}
                          </label>
                        </div>
                        <label className={`flex items-center gap-1`}>
                          {`Other:`}
                          <input
                            className={`border-2 rounded w-full px-1 border-black/20`}
                            type="text"
                            placeholder="Please specify"
                            value={otherText}
                            maxLength={20}
                            onFocus={handleTextFocus}
                            onChange={handleTextChange}
                          />
                        </label>
                        <div className="mt-5">
                          <label htmlFor="reportDescription">
                            <span
                              className={`font-bold ${
                                reportFormDescriptionError
                                  ? "text-red-500"
                                  : "text-black"
                              }`}
                            >{`Description: `}</span>
                          </label>
                          <textarea
                            onChange={(event) => {
                              if (uuid) {
                                setReportDescription(event.target.value);
                                setReportFormDescriptionError("");
                              } else {
                                alert("Sign in to file a report!");
                              }
                            }}
                            value={reportDescription}
                            style={{
                              minHeight: "90px",
                              maxHeight: "200px",
                              minWidth: "100%",
                              resize: "vertical",
                            }}
                            id="reportDescription"
                            maxLength={250}
                            placeholder="Enter your report here..."
                            className={`border-2 rounded px-1 ${
                              reportFormDescriptionError
                                ? "border-red-500"
                                : "border-black/20"
                            }`}
                          ></textarea>
                        </div>
                        {reportFormOptionError && (
                          <span className="flex justify-center w-full bg-red-500/80 mb-2">
                            <p className="py-2 text-white">
                              {reportFormOptionError}
                            </p>
                          </span>
                        )}
                        {reportFormDescriptionError && (
                          <span className="flex justify-center w-full bg-red-500/80 mb-2">
                            <p className="py-2 text-white">
                              {reportFormDescriptionError}
                            </p>
                          </span>
                        )}
                        {reportFormSuccess && (
                          <span className="flex justify-center w-full bg-green-500 mb-2">
                            <p className="py-2 text-white">
                              {reportFormSuccess}
                            </p>
                          </span>
                        )}
                        <div className="flex justify-center my-1">
                          <button
                            onClick={handleReportFormSubmit}
                            className="bg-red-500 tracking-wider text-white text-lg font-bold px-10 py-2 rounded-lg hover:opacity-80 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={reportFormLoading}
                          >
                            {reportFormLoading ? (
                              <div className="flex gap-2 justify-center items-center">
                                <Spinner className="animate-spin h-6 fill-white"></Spinner>
                                <p className="text-base">Submitting... </p>
                              </div>
                            ) : (
                              "Submit"
                            )}
                          </button>
                        </div>
                      </form>
                    </>
                  ) : deleteView ? (
                    <form action="">
                      <div className="min-h-fit">
                        <div className="my-5">
                          <label htmlFor="deleteDescription">
                            <span
                              className={`font-bold ${
                                deleteFormDescriptionError
                                  ? "text-red-500"
                                  : "text-black"
                              }`}
                            >{`Reason: `}</span>
                          </label>
                          <textarea
                            onChange={(event) => {
                              if (uuid) {
                                setDeleteDescription(event.target.value);
                                setDeleteFormDescriptionError("");
                              } else {
                                alert("Sign in to submit a deletion request!");
                              }
                            }}
                            value={deleteDescription}
                            style={{
                              minHeight: "90px",
                              maxHeight: "200px",
                              minWidth: "100%",
                              resize: "vertical",
                            }}
                            id="deleteDescription"
                            maxLength={250}
                            placeholder="Please explain why you want this spot removed..."
                            className={`border-2 rounded px-1 ${
                              deleteFormDescriptionError
                                ? "border-red-500"
                                : "border-black/20"
                            }`}
                          ></textarea>
                          <div className="flex flex-col mt-2">
                            <label
                              htmlFor="fileUpload"
                              className="font-bold"
                            >
                              Upload picture:
                            </label>
                            <input
                              ref={fileInputRef}
                              type="file"
                              id="fileUpload"
                              accept=".jpg,.jpeg,.png,.heic"
                              onChange={handleFileChange}
                            />
                          </div>
                        </div>
                        {selectedImage && (
                          <div className="mb-4">
                            <div className="border-2 rounded border-black/20 max-w-md">
                              <img
                                src={selectedImage}
                                alt="Preview"
                                style={{ width: "100%" }}
                              />
                            </div>
                            <button onClick={handleRemoveImage}>Remove</button>
                          </div>
                        )}
                        {deleteFormDescriptionError && (
                          <span className="flex justify-center w-full bg-red-500/80 mb-2">
                            <p className="py-2 text-white">
                              {deleteFormDescriptionError}
                            </p>
                          </span>
                        )}
                        {deleteFormSuccess && (
                          <span className="flex justify-center max-w-xs mx-auto text-center bg-green-500 mb-2">
                            <p className="py-2 text-white">
                              {deleteFormSuccess}
                            </p>
                          </span>
                        )}
                        <div className="flex justify-center mb-1">
                          <button
                            onClick={handleDeleteFormSubmit}
                            className="bg-red-500 tracking-wider text-white text-lg font-bold px-10 py-2 rounded-lg hover:opacity-80 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={deleteFormLoading}
                          >
                            {deleteFormLoading ? (
                              <div className="flex gap-2 justify-center items-center">
                                <Spinner className="animate-spin h-6 fill-white"></Spinner>
                                <p className="text-base">Submitting... </p>
                              </div>
                            ) : (
                              "Submit"
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : isLoading ? (
                    <div className="min-h-[15vh] flex justify-center items-center gap-2">
                      <Spinner className="animate-spin h-6 fill-blue-700"></Spinner>
                      <p className="text-base">Loading... </p>
                    </div>
                  ) : numSpotReports != 0 ? (
                    <div className="my-5 max-h-[45vh] overflow-auto">
                      {spotReports.map((report, index) => (
                        <div key={index}>
                          <div className="py-1">
                            <li className="grid grid-cols-[.1fr,.9fr]">
                              <p>
                                <strong>{(index += 1)}. </strong>
                              </p>
                              <span className="flex flex-col">
                                <p>
                                  <strong>{report.option}: </strong>
                                  {report.description}
                                </p>
                              </span>
                            </li>
                            <p className="flex justify-end text-sm">
                              {`${report.username},
                                  ${formatDate(report.created_at)}`}
                            </p>
                          </div>
                          {index === numSpotReports ? null : (
                            <div className="border-t-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 min-h-[15vh] flex justify-center items-center">
                      <p className="font-sans">
                        {`There are currently no reports for `}
                        <span className="font-bold">
                          {rack_type?.toLowerCase() ||
                            (spot_type === "sign"
                              ? "street sign"
                              : "bike shelter")}{" "}
                          {siteId}
                        </span>
                      </p>
                    </div>
                  )}
                  {reportView || deleteView ? (
                    <></>
                  ) : (
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => setReportView(true)}
                        className="hover:underline text-red-500 font-bold font-sans"
                      >
                        File a Report
                      </button>
                      <p className="text-sm">|</p>
                      <button
                        onClick={() => setDeleteView(true)}
                        className="hover:underline text-red-500 font-bold font-sans"
                      >
                        Delete Spot
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ReportComponent;
