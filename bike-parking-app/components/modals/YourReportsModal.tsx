"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import { useCallback, useEffect, useState } from "react";
import { BsTrash3Fill } from "react-icons/bs";
import { Spinner } from "../svgs";
import { formatDate } from "@/lib/formatDate";
import { useMapEvents } from "react-leaflet";

interface Report {
  created_at: string;
  id: number;
  option: string;
  description: string;
  user_id: string;
  username: string;
  x: number;
  y: number;
}

export default function YourReportsModal() {
  const [isLoading, setIsLoading] = useState(true);
  const [listOfReports, setListOfReports] = useState<Report[] | null>(null);

  const supabase = createSupabaseBrowserClient();
  const session = useSession();
  const uuid = session?.user.id;
  const username = session?.user.user_metadata.username;

  const map = useMapEvents({});

  const fetchReports = useCallback(async () => {
    if (!uuid) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("Report")
        .select()
        .eq("username", username);

      if (error) {
        throw new Error(`Error fetching reports: ${error.message}`);
      }

      setListOfReports(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setIsLoading(false);
    }
  }, [uuid, username, supabase]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const removeReport = async (reportId: number) => {
    const { error } = await supabase.from("Report").delete().eq("id", reportId);

    if (error) {
      console.error(`Error removing report: ${error}`);
    } else {
      setListOfReports(
        (prevList) => prevList?.filter((report) => report.id !== reportId) || []
      );
    }
  };

  const handleFlyTo = useCallback(
    (report: Report) => {
      if (report.y && report.x) {
        const currentZoom = map.getZoom() > 19 ? map.getZoom() : 20;
        map.flyTo([report.y, report.x], currentZoom, {
          animate: true,
          duration: 1.5,
        });
      }
    },
    [map]
  );

  return (
    <div>
      {isLoading ? (
        <div className="min-h-[15vh] flex justify-center items-center gap-2">
          <Spinner className="animate-spin h-6 fill-blue-700"></Spinner>
          <p className="text-base">Loading... </p>
        </div>
      ) : listOfReports === null ? (
        <div className="min-h-[15vh] flex justify-center items-center gap-2">
          <Spinner className="animate-spin h-6 fill-blue-700"></Spinner>
          <p className="text-base">Loading... </p>
        </div>
      ) : listOfReports.length === 0 ? (
        <div className="min-h-[15vh] flex justify-center items-center gap-2">
          <p className="text-base">You have not filed any reports yet.</p>
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          {listOfReports.map((report, index) => (
            <div key={index}>
              <div className="grid grid-flow-col grid-cols-6 w-full items-center">
                <button
                  className="appearance-none"
                  onClick={() => handleFlyTo(report)}
                >
                  <span className="col-span-1 justify-self-center font-bold text-xl">{`${
                    index + 1
                  })`}</span>
                </button>
                <div
                  onClick={() => handleFlyTo(report)}
                  className="col-span-4 justify-self-start w-full cursor-pointer"
                >
                  <p>
                    <strong>{`${report.option}:`}</strong>
                    {` ${report.description}`}
                  </p>
                  <p className="flex justify-end text-sm">{`${
                    report.username
                  }, ${formatDate(report.created_at)}`}</p>
                </div>
                <button
                  onClick={() => removeReport(report.id)}
                  className="col-span-1 justify-self-center p-2 hover:bg-red-100 hover:rounded-full"
                >
                  <BsTrash3Fill className="fill-red-500 h-6 w-6" />
                </button>
              </div>
              {index != listOfReports.length - 1 && (
                <div className="border-[1px] w-full my-3" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
