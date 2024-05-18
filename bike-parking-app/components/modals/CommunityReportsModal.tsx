"use client";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/formatDate";
import { Spinner } from "../svgs";

interface Report {
  option: string;
  description: string;
  username: string;
  created_at: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  rack_type?: string;
  address: string;
}

const CommunityReportsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  id,
  rack_type,
  address,
}) => {
  const supabase = createSupabaseBrowserClient();
  const session = useSession();
  const username = session?.user.user_metadata.username;
  const uuid = session?.user.id;
  const createdAt = session?.user.created_at;

  const [reportView, setReportView] = useState(false);
  const [deleteView, setDeleteView] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [deleteDescription, setDeleteDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [spotReports, setSpotReports] = useState<Report[]>([]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    setOtherText(""); // Clear the text input when a radio button is selected
  };

  const handleTextFocus = () => {
    setSelectedOption(""); // Deselect radio buttons when text input is focused
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtherText(event.target.value);
  };

  const handleClose = () => {
    setReportView(false);
    setDeleteView(false);
    onClose();
  };

  const fetchSpotReports = useCallback(async () => {
    try {
      const { data: reports, error } = await supabase
        .from("Report")
        .select("created_at, username, option, description")
        .eq("location_id", id)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(`Error fetching spot reports: ${error.message}`);
      }
      setSpotReports(reports);
      setIsLoading(false);
      // console.log(spotReports);
    } catch (error) {
      toast.error(`Something went wrong: ${error}`);
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (isOpen) {
      fetchSpotReports();
    }
  }, [isOpen, fetchSpotReports]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={handleClose}>
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
                        rack_type ? rack_type : "Street Sign"
                      } ${id}`}</p>
                      <p
                        className={`${
                          address.length > 30 ? "lowercase text-sm" : null
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
                      <p className="font-bold underline">Choose option:</p>
                      <div className="ml-4">
                        <label className="block w-fit">
                          <input
                            type="radio"
                            name="radio"
                            value="Theft"
                            checked={selectedOption === "Theft"}
                            onChange={handleRadioChange}
                          />
                          {` Theft`}
                        </label>
                        <label className="block w-fit">
                          <input
                            type="radio"
                            name="radio"
                            value="Unsafe"
                            checked={selectedOption === "Unsafe"}
                            onChange={handleRadioChange}
                          />
                          {` Unsafe`}
                        </label>
                        <label className="block w-fit">
                          <input
                            type="radio"
                            name="radio"
                            value="Unsecure"
                            checked={selectedOption === "Unsecure"}
                            onChange={handleRadioChange}
                          />
                          {` Unsecure`}
                        </label>
                        <label className="block w-fit">
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
                      <label className="flex items-center gap-1">
                        {`Other:`}
                        <input
                          className="border-2 border-black/40 rounded w-full px-1"
                          type="text"
                          placeholder="Please specify"
                          value={otherText}
                          maxLength={30}
                          onFocus={handleTextFocus}
                          onChange={handleTextChange}
                        />
                      </label>

                      <div className="mt-5">
                        <label htmlFor="reportDescription">
                          <span className="font-bold">{`Description: `}</span>
                        </label>
                        <textarea
                          onChange={(event) => {
                            setReportDescription(event.target.value);
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
                          className={`${"border-2 border-black/40 rounded px-1"}`}
                        ></textarea>
                        <span
                          id="reportDescriptionError"
                          className="text-red-600"
                        ></span>
                      </div>

                      <div className="flex justify-center my-1">
                        <button className="bg-red-500 tracking-wider text-white text-lg font-bold px-10 py-2 rounded-lg hover:opacity-80">
                          Submit
                        </button>
                      </div>
                    </form>
                  </>
                ) : deleteView ? (
                  <div className="min-h-fit">
                    <div className="mt-5">
                      <label htmlFor="deleteDescription">
                        <span className="font-bold">{`Reason: `}</span>
                      </label>
                      <textarea
                        onChange={(event) => {
                          setDeleteDescription(event.target.value);
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
                        className={`${"border-2 border-black/40 rounded px-1"}`}
                      ></textarea>
                      <span
                        id="deleteDescription"
                        className="text-red-600"
                      ></span>
                    </div>

                    <div className="flex justify-center my-1">
                      <button className="bg-red-500 tracking-wider text-white text-lg font-bold px-10 py-2 rounded-lg hover:opacity-80">
                        Submit
                      </button>
                    </div>
                  </div>
                ) : isLoading ? (
                  <div className="min-h-[15vh] flex justify-center items-center gap-2">
                    <Spinner className="animate-spin h-6 fill-blue-700"></Spinner>
                    <p className="text-base">Loading... </p>
                  </div>
                ) : spotReports.length != 0 ? (
                  <div className="my-5">
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
                        {index === spotReports.length ? null : (
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
                        {rack_type ? rack_type.toLowerCase() : "street sign"}{" "}
                        {id}
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
  );
};

export default CommunityReportsModal;
