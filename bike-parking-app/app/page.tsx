"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
// import BikeMap from "./components/BikeMap";
const DynamicMapComponent = dynamic(() => import("./components/LeafletMap"), {ssr: false});

export default function Home() {
  return (
    <>
      {/* <BikeMap /> */}
      <DynamicMapComponent />
    </>
  );
}
