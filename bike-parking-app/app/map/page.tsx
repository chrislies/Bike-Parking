import ExternalStateExample from "@/components/LeafletMap2";
import dynamic from "next/dynamic";
// const DynamicMapComponent = dynamic(() => import("@/components/LeafletMap2"), {
const DynamicMapComponent = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
});

export default function page() {
  return <DynamicMapComponent />;
}
