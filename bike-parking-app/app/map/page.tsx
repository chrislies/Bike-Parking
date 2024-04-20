import Navbar from "@/components/navbar/Navbar";
import { Layers, Locate } from "@/components/svgs";
import dynamic from "next/dynamic";
const DynamicMapComponent = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
});
const ClientMap = dynamic(() => import("../../components/map/Map"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function MapPage() {
  return (
    <div className="container">
      <div className="absolute sm:bottom-0 max-sm:top-0 max-sm:right-0 flex flex-col max-sm:flex-col-reverse max-sm:items-end justify-between m-3 gap-3">
        <button
          // onClick={() => locateMe(mapRef.current)}
          title="Locate Me"
          aria-label="Locate Me"
          aria-disabled="false"
          className="z-[999] select-none cursor-pointer relative w-[36px] h-[36px] p-0 bg-white hover:bg-gray-100 text-black rounded-md border-2 border-[rgba(0,0,0,0.2)] shadow-md"
        >
          <span className="absolute top-[-16px] left-[-16px] scale-[.4]">
            <Locate />
          </span>
        </button>
        <button
          // onClick={() => {}}
          title="Toggle Layers"
          aria-label="Toggle Layers"
          aria-disabled="false"
          className="z-[999] select-none cursor-pointer relative w-[50px] h-[50px] p-0 bg-white hover:bg-gray-100 text-black rounded-md border-2 border-[rgba(0,0,0,0.2)] shadow-md"
        >
          <span className="absolute top-[-9px] left-[-9px] scale-50">
            <Layers />
          </span>
        </button>
      </div>

      <Navbar />
      <ClientMap />
    </div>
  );
  // return (
  //   <div className="container">
  //     {/* <div className="container mx-auto"> */}
  //     <Navbar />
  //     <ClientMap />
  //   </div>
  // );
}
