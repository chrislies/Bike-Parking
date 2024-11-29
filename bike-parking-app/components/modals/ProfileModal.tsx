"use client";
import { useUserStore } from "@/app/stores/userStore";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/formatDate";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import Link from "next/link";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { username, uuid, createdAt, isAdmin, signOut } = useUserStore();
  const router = useRouter();

  const [loginView, setLoginView] = useState(true);

  const signOutUser = async () => {
    await signOut();
    toast.success("Sign out successful", {
      duration: 5000,
      id: "signOutSuccess",
    });
    router.push("/login");
    router.refresh();
  };

  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-[1000]"
        onClose={onClose}
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
                      <span className="italic">view profile</span>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="bg-gray-300 rounded-xl py-1 px-4 shadow-inner text-xl font-bold tracking-wider uppercase max-w-fit">
                        Profile
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
                      ) : (
                        <>
                          <div className="flex flex-col items-center justify-center gap-5">
                            {username && (
                              <div>
                                Welcome,
                                <span className="font-bold">{` ${username}`}</span>
                              </div>
                            )}
                            {createdAt && <p>Joined on: {formatDate(createdAt)}</p>}
                            {isAdmin && (
                              <button className="bg-gray-800 text-white p-4 rounded-xl hover:opacity-80">
                                <Link href="/admin">Admin Dashboard</Link>
                              </button>
                            )}
                            <button
                              className="bg-red-500 text-white p-4 rounded-xl hover:opacity-80"
                              onClick={signOutUser}
                            >
                              Log Out
                            </button>
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

export default ProfileModal;
