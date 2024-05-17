import Navbar from "@/components/navbar/Navbar";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <Navbar />
      <div className="relative overflow-hidden min-h-fit">
        <div className="flex flex-col items-center font-sans max-w-5xl mx-auto pt-4 sm:pt-6 lg:pt-8 max-md:h-[130vh]">
          <h1 className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center">
            {`Welcome to `}
            <span className="bg-clip-text text-transparent bg-gradient-to-b max-sm:bg-gradient-to-t from-green-400 to-green-600">
              Bike Parking
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 text-center max-w-xl max-sm:mx-10 mx-auto">
            A community-driven interactive map that locates accessible parking
            spots such as <span className="font-bold">bike racks</span> and{" "}
            <span className="font-bold">street signs</span> for bikes and
            scooters.
          </p>
          <Link
            href="/login"
            className="mt-8 font-mono bg-slate-900 text-white font-bold rounded-lg px-5 py-3 hover:opacity-80"
          >
            Get started
          </Link>
          <div className="flex mt-10">
            <div className="hero-image h-[450px] w-[450px] max-lg:h-[350px] max-lg:w-[350px] max-md:h-[250px] max-md:w-[250px] top-5 left-12 max-md:top-0 max-md:left-[120px] z-10">
              <Image
                src={"/images/map_ui.png"}
                alt={"map ui"}
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
            <div className="hero-image h-[500px] w-[500px] max-lg:h-[400px] max-lg:w-[400px] max-md:h-[300px] max-md:w-[300px] max-md:top-[190px] max-md:right-[110px] max-md:z-[11]">
              <Image
                src={"/images/map_directions.png"}
                alt={"map directions"}
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
