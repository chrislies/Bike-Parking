import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import React, { useEffect, useState } from "react";

interface BusyComponentProps {
  x: number;
  y: number;
}

const BusyComponent = ({ x, y }: BusyComponentProps) => {
  const [isBusy, setIsBusy] = useState(false);
  const supabase = createSupabaseBrowserClient();

  const getFavoritesCount = async () => {
    const { data, error, count } = await supabase
      .from("Favorites")
      .select("*", { count: "exact" })
      .eq("x_coord", x)
      .eq("y_coord", y);

    if (error) {
      console.error("Error fetching favorite count:", error);
      return;
    }

    const favoriteCount = count ?? 0;
    setIsBusy(favoriteCount >= 2);
  };

  useEffect(() => {
    getFavoritesCount();
  }, [x, y]);

  return (
    <>
      {isBusy ? (
        <div className="z-10 absolute top-[40px] right-[8px] h-12 w-12 flex justify-center items-center bg-orange-500 shadow-mdd rounded-full">
          <p className="p-2 text-lg text-white select-none rotate-12">busy</p>
        </div>
      ) : null}
    </>
  );
};

export default BusyComponent;
