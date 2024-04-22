import Loader from "@/components/Loader";
import Navbar from "@/components/navbar/Navbar";
import dynamic from "next/dynamic";
const ClientMap = dynamic(() => import("../../components/map/Map"), {
  loading: () => <Loader />,
  ssr: false,
});

export default function MapPage() {
  return (
    <div className="container">
      <Navbar />
      <ClientMap />
    </div>
  );
}
