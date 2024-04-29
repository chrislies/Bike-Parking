import Loader from "@/components/Loader";
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
    </div>
  );
}
