"use client";
import Loader from "@/components/Loader";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsTrash3Fill } from "react-icons/bs";

interface PendingRequest {
    id: number;
    x_coord: number;
    y_coord: number;
    request_type: string;
    created_at: string;
    image: string;
    email: string;
    description: string;
}

export default function PendingRequestsPage() {
    const supabase = createSupabaseBrowserClient();
    const [isLoading, setIsLoading] = useState(true);
    const [pendingRequests, setPendingRequests] = useState<PendingRequest[] | null>(null);
    const session = useSession();
    const uuid = session?.user.id;
    const email = session?.user.user_metadata.email;

    useEffect(() => {
        const fetchPendingRequests = async () => {
            if (!uuid) {
                setIsLoading(false);
                return;
            }
            try {
                const { data, error } = await supabase
                    .from("Pending")
                    .select()
                    .eq("email", email);

                if (error) {
                    throw new Error(`Error fetching pending requests: ${error.message}`);
                }
                setPendingRequests(data || []);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching pending requests:", error);
                setIsLoading(false);
            }
        };
        fetchPendingRequests();
    }, [uuid, email]);

    const removeRequest = async (requestId: number) => {
        const { error } = await supabase
            .from("Pending")
            .delete()
            .eq("id", requestId);

        if (error) {
            console.error(`Error removing request: ${error}`);
        } else {
            setPendingRequests((prevList) => prevList?.filter((request) => request.id !== requestId) || []);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    if (!pendingRequests || pendingRequests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="z-[-1] absolute inset-0 flex justify-center text-3xl font-bold underline mt-5">
                    Your Contributions
                </h1>
                <h1 className="text-2xl">No pending requests!</h1>
                <Link href="/" className="hover:underline font-bold text-lg">
                    Go back to map
                </Link>
                <Link href="/contributes" className="hover:underline font-bold text-lg">
                    {`<-- Go back to previous page`}
                </Link>
                <br></br>
                <Link href="/reports" className="mx-4 p-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">
                    Check Your Reports
                </Link>
            </div>
        );
    }

    return (
        <div className="my-20 flex flex-col justify-center items-center">
            <h1 className="z-[-1] absolute inset-0 flex justify-center text-3xl font-bold underline mt-5">
                Your Contributions
            </h1>
            {pendingRequests.map((request, index) => (
                <div key={request.id} className="flex flex-row items-center gap-10 my-6">
                    <span className="font-bold text-xl">{`${index + 1})`}</span>
                    <div className="relative w-24 h-24">
                        <Image src={request.image} alt="Request Image" layout="fill" objectFit="contain" />
                    </div>
                    <div>
                        <p>Email: {request.email}</p>
                        <p>X Coordinate: {request.x_coord}</p>
                        <p>Y Coordinate: {request.y_coord}</p>
                        <p>Request Type: {request.request_type}</p>
                        <p>Description: {request.description}</p>
                        <p>Created At: {request.created_at.split('T')[0]}</p>
                    </div>
                    <button onClick={() => removeRequest(request.id)} className="ml-4">
                        <BsTrash3Fill className="fill-red-500 h-6 w-6" />
                    </button>
                </div>
            ))}
            <Link href="/" className="hover:underline font-bold text-lg">Go back to map</Link>
            <Link href="/contributes" className="hover:underline font-bold text-lg">
                {`<-- Go back to previous page`}
            </Link>
            <br></br>
            <Link href="/reports" className="mx-4 p-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">
                Check Your Reports
            </Link>
        </div>
    );
}

