"use client";

import Loader from "@/components/Loader";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsTrash3Fill } from "react-icons/bs";

interface Report {
  created_at: string;
  id: number;
  option: string;
  description: string;
  user_id: string;
  username: string;
}

export default function ContributesPage() {
  const supabase = createSupabaseBrowserClient();
  const [isLoading, setIsLoading] = useState(true);
  const [listOfReports, setListOfReports] = useState<Report[] | null>(null);

  const session = useSession();
  const uuid = session?.user.id;
  const username = session?.user.user_metadata.username;

  useEffect(() => {
    const fetchReports = async () => {
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
    };

    fetchReports();
  }, [uuid]);

  const removeReport = async (reportId: number) => {
    const { error } = await supabase
      .from("Report")
      .delete()
      .eq("id", reportId);

    if (error) {
      console.error(`Error removing report: ${error}`);
    } else {
      setListOfReports((prevList) => prevList?.filter((report) => report.id !== reportId) || []);
    }
  };

  return (
    <div>
      <h1 className="z-[-1] absolute inset-0 flex justify-center text-3xl font-bold underline mt-5">
        Your Contributions
      </h1>
      {isLoading ? (
        <Loader />
      ) : listOfReports === null ? (
        <h1 className="absolute inset-0 flex justify-center items-center text-2xl">
          Loading...
        </h1>
      ) : listOfReports.length === 0 ? (
        <div className="absolute inset-0 flex flex-col justify-center items-center gap-4">
          <h1 className="text-2xl">You have not contributed any reports yet!</h1>
          <Link href="/" className="hover:underline font-bold text-lg">
            {`<-- Go back to map`}
          </Link>
        </div>
      ) : (
        <div className="my-20 flex flex-col justify-center items-center">
          {listOfReports.map((report, index) => (
            <div key={index} className="flex flex-row items-center gap-10 my-6">
              <span className="font-bold text-xl">{`${index + 1})`}</span>
              <div>
                <p>{`${report.option}: ${report.description}`}</p>
                <p>{`Post by: ${report.username} on ${new Date(report.created_at).toLocaleString()}`}</p>
              </div>
              <button onClick={() => removeReport(report.id)}>
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
