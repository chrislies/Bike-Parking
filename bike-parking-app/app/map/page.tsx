"use client";
import { Toaster } from "react-hot-toast";
import SuperClusterMap from "@/components/map/SuperClusterMap";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function MapPage() {
  return (
    <div className="container">
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <SuperClusterMap />
      </QueryClientProvider>
    </div>
  );
}
