"use client";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import dynamic from "next/dynamic";

// Dynamically import SuperClusterMap and disable SSR (Server-Side Rendering)
const SuperClusterMap = dynamic(
  () => import("@/components/map/SuperClusterMap"),
  {
    ssr: false, // disable SSR for this component
  }
);

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
