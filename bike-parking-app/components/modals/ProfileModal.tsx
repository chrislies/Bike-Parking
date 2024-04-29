"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Loader from "../Loader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/formatDate";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const supabase = createSupabaseBrowserClient();
  const session = useSession();
  const username = session?.user.user_metadata.username;
  const uuid = session?.user.id;
  const createdAt = session?.user.created_at;
  const router = useRouter();

  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
      return;
    }
    toast.success("Sign out successful", {
      duration: 5000,
      id: "signOutSuccess",
    });
    router.push("/login");
    router.refresh();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
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
                  Profile
                </Dialog.Title>
                <div className="mt-2">
                  {
                    <>
                      {!uuid ? (
                        <h1>Sign in to view profile</h1>
                      ) : (
                        <>
                          <div className="flex flex-col items-center justify-center gap-5">
                            {username && (
                              <h1>
                                Welcome,
                                <span className="font-bold">{` ${username}`}</span>
                              </h1>
                            )}
                            {createdAt && (
                              <p>Joined on: {formatDate(createdAt)}</p>
                            )}
                            <button
                              className="bg-red-500 text-white p-4 rounded-xl"
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
