"use client";
import { useUserReportsStore, UserReport } from "@/app/stores/userReportsStore";
import { useUserStore } from "@/app/stores/userStore";
import { useCallback, useEffect } from "react";
import { BsTrash3Fill } from "react-icons/bs";
import { Spinner } from "../svgs";
import { formatDate } from "@/lib/formatDate";
import { useMapEvents } from "react-leaflet";

interface YourReportsModalProps {
  onClose: () => void;
}

export default function YourReportsModal({ onClose }: YourReportsModalProps) {
  const { reports, isLoading, fetchUserReports, removeUserReport, hasFetched } =
    useUserReportsStore();
  const { uuid, username } = useUserStore();
  const map = useMapEvents({});

  useEffect(() => {
    if (uuid && username && !hasFetched) {
      fetchUserReports(uuid, username);
    }
  }, [uuid, username, hasFetched]);

  const handleFlyTo = useCallback(
    (report: UserReport) => {
      if (report.y && report.x) {
        onClose(); // close the modal
        const currentZoom = map.getZoom() > 19 ? map.getZoom() : 20;
        map.flyTo([report.y, report.x], currentZoom, {
          animate: true,
          duration: 1.5,
        });
      }
    },
    [map, onClose]
  );

  return (
    <div>
      {isLoading ? (
        <div className="min-h-[15vh] flex justify-center items-center gap-2">
          <Spinner className="animate-spin h-6 fill-blue-700"></Spinner>
          <p className="text-base">Loading... </p>
        </div>
      ) : reports.length === 0 ? (
        <div className="min-h-[15vh] flex justify-center items-center gap-2">
          <p className="text-base">You have not filed any reports yet.</p>
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          {reports.map((report, index) => (
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
                  <p className="flex justify-end text-sm">{`${report.username}, ${formatDate(
                    report.created_at
                  )}`}</p>
                </div>
                <button
                  onClick={() => removeUserReport(report.id)}
                  className="col-span-1 justify-self-center p-2 hover:bg-red-100 hover:rounded-full"
                >
                  <BsTrash3Fill className="fill-red-500 h-6 w-6" />
                </button>
              </div>
              {index != reports.length - 1 && <div className="border-[1px] w-full my-3" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
