"use client";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { BsTrash3Fill } from "react-icons/bs";
import Link from "next/link";
import { useMapEvents } from "react-leaflet";
import toast from "react-hot-toast";
import { Spinner } from "../svgs";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Favorites {
  created_at: string;
  id: number;
  location_address: string;
  location_id: string;
  user_id: string;
  username: string;
  x_coord: number;
  y_coord: number;
}

const SavedModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [listOfFavorites, setListOfFavorites] = useState<Favorites[] | null>(
    null
  );

  const supabase = createSupabaseBrowserClient();
  const session = useSession();
  const uuid = session?.user.id;

  const fetchSavedLocations = useCallback(async () => {
    try {
      if (!uuid) {
        setIsLoading(false);
        return;
      }
      const { data: savedSpots, error } = await supabase
        .from("Favorites")
        .select()
        .eq("user_id", uuid);
      if (error) {
        throw new Error(`Error fetching saved spots: ${error.message}`);
      }
      setListOfFavorites(savedSpots || []);
      setIsLoading(false);
    } catch (error) {
      toast.error(`Something went wrong: ${error}`);
      setIsLoading(false);
    }
  }, [supabase, uuid]);

  useEffect(() => {
    if (isOpen) {
      fetchSavedLocations();
    }
  }, [isOpen, fetchSavedLocations]);

  const removeFavorite = async (favorite: Favorites) => {
    const { data, error } = await supabase
      .from("Favorites")
      .delete()
      .eq("user_id", uuid)
      .eq("location_id", favorite.location_id);

    if (error) {
      console.log(`Error removing spot from favortes: ${error}`);
    } else {
      // Filter out the removed favorite from the list
      setListOfFavorites((prevList) =>
        prevList ? prevList.filter((f) => f.id !== favorite.id) : []
      );
    }
  };

  const map = useMapEvents({});

  const handleFlyTo = useCallback(
    (favoriteMarker: Favorites) => {
      onClose(); // close the modal
      const currentZoom = map.getZoom() > 19 ? map.getZoom() : 20;
      map.flyTo(
        [favoriteMarker.y_coord!, favoriteMarker.x_coord!],
        currentZoom,
        {
          animate: true,
          duration: 1.5,
        }
      );
    },
    [map, onClose]
  );

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
                  Saved Spots
                </Dialog.Title>
                <div className="mt-2">
                  {
                    <>
                      {!uuid ? (
                        <h1>Sign in to view saved spots</h1>
                      ) : isLoading ? (
                        <h1 className="absolute inset-0 flex justify-center items-center text-2xl">
                          <div className="flex justify-center items-center gap-2">
                            <Spinner className="animate-spin h-6 fill-blue-700"></Spinner>
                            <p className="text-base">Loading... </p>
                          </div>
                        </h1>
                      ) : listOfFavorites === null ? (
                        <div className="flex justify-center items-center gap-2">
                          <Spinner className="animate-spin h-6 fill-blue-700"></Spinner>
                          <p className="text-base">Loading... </p>
                        </div>
                      ) : listOfFavorites.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col justify-center items-center gap-4">
                          <h1 className="text-2xl">No spots favorited yet!</h1>
                        </div>
                      ) : (
                        <div className="flex flex-col justify-center">
                          {listOfFavorites.map(
                            (favorite: Favorites, index: number) => (
                              <div key={index}>
                                <div className="grid grid-flow-col grid-cols-12 w-full items-center">
                                  <button onClick={() => handleFlyTo(favorite)}>
                                    <span className="col-span-1 justify-self-center font-bold text-xl">{`${
                                      index + 1
                                    })`}</span>
                                  </button>
                                  <ol className="col-span-10 justify-self-center">
                                    <button
                                      className="appearance-none"
                                      onClick={() => handleFlyTo(favorite)}
                                    >
                                      <li className="underline">
                                        {favorite.location_id}
                                      </li>
                                      <li>{favorite.location_address}</li>
                                    </button>
                                  </ol>
                                  <button
                                    className="col-span-1 justify-self-center p-2 hover:bg-red-100 hover:rounded-full"
                                    onClick={() => removeFavorite(favorite)}
                                  >
                                    <BsTrash3Fill className="fill-red-500 h-6 w-6" />
                                  </button>
                                </div>
                                {index != listOfFavorites.length - 1 && (
                                  <div className="border-[1px] w-full my-3" />
                                )}
                              </div>
                            )
                          )}
                        </div>
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

export default SavedModal;
