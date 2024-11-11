"use client";
import Loader from "@/components/Loader";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import SuperClusterMap from "@/components/map/SuperClusterMap";
import { QueryClient, QueryClientProvider } from "react-query";
const ClientMap = dynamic(() => import("../../components/map/Map"), {
  loading: () => <Loader />,
  ssr: false,
});
const queryClient = new QueryClient();

export default function MapPage() {
  return (
    <div className="container">
      <Toaster />
      {/* <ClientMap /> */}
      <QueryClientProvider client={queryClient}>
        <SuperClusterMap />
      </QueryClientProvider>
    </div>
  );
}
