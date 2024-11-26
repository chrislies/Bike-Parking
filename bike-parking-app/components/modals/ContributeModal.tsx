"use client";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import YourReportsModal from "./YourReportsModal";
import YourRequestsModal from "./YourRequestsModal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContributeModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const supabase = createSupabaseBrowserClient();
  const session = useSession();
  const username = session?.user.user_metadata.username;
  const uuid = session?.user.id;
  const createdAt = session?.user.created_at;

  const [loginView, setLoginView] = useState(true);
  const [yourReportsModalView, setYourReportsModalView] = useState(false);
  const [yourRequestsModalView, setYourRequestsModalView] = useState(false);

  const handleClose = () => {
    setYourReportsModalView(false);
    setYourRequestsModalView(false);
    onClose();
  };

  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-[888]"
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {!uuid ? (
                    <div className="text-base text-center mb-6">
                      <span
                        className="font-bold hover:underline cursor-pointer"
                        onClick={() => setLoginView(true)}
                      >
                        Sign in
                      </span>
                      {` or `}
                      <span
                        className="font-bold hover:underline cursor-pointer"
                        onClick={() => setLoginView(false)}
                      >
                        create an account
                      </span>
                      {` to `}
                      <span className="italic">view contributions</span>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      {yourReportsModalView && (
                        <button
                          title="Go back"
                          aria-label="Go back"
                          className="flex items-center"
                          onClick={() => setYourReportsModalView(false)}
                        >
                          <span className="absolute left-[22px] text-2xl cursor-pointer transition-all ease-in-out duration-100 hover:translate-x-[-3px]">
                            &larr;
                          </span>
                        </button>
                      )}
                      {yourRequestsModalView && (
                        <button
                          title="Go back"
                          aria-label="Go back"
                          className="flex items-center"
                          onClick={() => setYourRequestsModalView(false)}
                        >
                          <span className="absolute left-[22px] text-2xl cursor-pointer transition-all ease-in-out duration-100 hover:translate-x-[-3px]">
                            &larr;
                          </span>
                        </button>
                      )}
                      <div className="bg-gray-300 rounded-xl py-1 px-4 shadow-inner text-xl font-bold tracking-wider uppercase max-w-fit">
                        {yourReportsModalView
                          ? "Your Reports"
                          : yourRequestsModalView
                          ? "Your Requests"
                          : "Contributions"}
                      </div>
                    </div>
                  )}
                </Dialog.Title>
                <div className="mt-2">
                  {
                    <>
                      {!uuid ? (
                        <div className="flex justify-center">
                          {loginView ? (
                            <LoginModal insideModal={true} />
                          ) : (
                            <RegisterModal insideModal={true} />
                          )}
                        </div>
                      ) : yourReportsModalView ? (
                        <YourReportsModal></YourReportsModal>
                      ) : yourRequestsModalView ? (
                        <YourRequestsModal></YourRequestsModal>
                      ) : (
                        <>
                          <div className="flex justify-evenly text-center gap-[24px] mt-5">
                            <div className="w-full flex flex-col gap-1">
                              <button
                                onClick={() =>
                                  setYourReportsModalView(
                                    (prevYourReportsModalView) => !prevYourReportsModalView
                                  )
                                }
                                className="py-2 rounded-md bg-red-500 text-white w-full hover:opacity-80"
                              >
                                Your Reports
                              </button>
                              <p className="text-sm">View all the reports you have submitted.</p>
                            </div>
                            <div className="w-full flex flex-col gap-1">
                              <button
                                onClick={() =>
                                  setYourRequestsModalView(
                                    (prevYourRequestsModalView) => !prevYourRequestsModalView
                                  )
                                }
                                className="py-2 rounded-md bg-green-600 text-white w-full hover:opacity-80"
                              >
                                Your Requests
                              </button>
                              <p className="text-sm">View your requests for map changes.</p>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  }
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ContributeModal;
