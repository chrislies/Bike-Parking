"use client";
import dynamic from "next/dynamic";
const DynamicMapComponent = dynamic(
  () => import("../../components/LeafletMap"),
  {
    ssr: false,
  }
);

export default function page() {
  return <DynamicMapComponent />;
}
