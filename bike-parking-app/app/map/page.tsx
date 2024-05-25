import Loader from "@/components/Loader";
import LeafletMap from "@/components/map/testMap";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
const ClientMap = dynamic(() => import("../../components/map/Map"), {
  loading: () => <Loader />,
  ssr: false,
});

export default function MapPage() {
  return (
    <div className="container">
      <Toaster />
      <ClientMap />
      {/* <LeafletMap /> */}
    </div>
  );
}
