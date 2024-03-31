"use client";

import Loader from "@/components/Loader";
import { supabaseClient } from "@/config/supabaseClient";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsTrash3Fill } from "react-icons/bs";

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

export default function FavoritesPage() {
  const supabase = supabaseClient;
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [listOfFavorites, setListOfFavorites] = useState<Favorites[] | null>(
    null
  );
  const username = user?.user_metadata.username;
  const uuid = user?.id;

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!uuid) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("Favorites")
          .select()
          .eq("user_id", uuid);

        if (error) {
          throw new Error(`Error fetching favorites: ${error.message}`);
        }

        setListOfFavorites(data || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [uuid]);

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

  return (
    <div>
      <h1 className="z-[-1] absolute inset-0 flex justify-center text-3xl font-bold underline mt-5">
        Favorite Spots
      </h1>
      {isLoading ? (
        <Loader />
      ) : listOfFavorites === null ? (
        <h1 className="absolute inset-0 flex justify-center items-center text-2xl">
          Loading...
        </h1>
      ) : listOfFavorites.length === 0 ? (
        <div className="absolute inset-0 flex flex-col justify-center items-center gap-4">
          <h1 className="text-2xl">No spots favorited yet!</h1>
          <Link href="/" className="hover:underline">
            Go back to map
          </Link>
        </div>
      ) : (
        <div className="my-20 flex flex-col justify-center items-center">
          {listOfFavorites.map((favorite: Favorites, index: number) => (
            <div key={index} className="flex flex-row items-center gap-10 my-6">
              <span className="font-bold text-xl">{`${index + 1})`}</span>
              <ol className="">
                <li>{favorite.location_id}</li>
                <li>{favorite.location_address}</li>
              </ol>
              <button onClick={() => removeFavorite(favorite)}>
                <BsTrash3Fill className="fill-red-500 h-6 w-6" />
              </button>
            </div>
          ))}
          <Link href="/" className="hover:underline font-bold text-lg">
            {`<-- Go back to map`}
          </Link>
        </div>
      )}
    </div>
  );
}
