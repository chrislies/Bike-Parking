import Navbar from "@/components/navbar/Navbar";
import Image from "next/image";
import Link from "next/link";
import "../app/css/homePage.css";

const FEATURES = [
  {
    feature: "Save a spot",
    desc: "Registered members can save up to 5 spots for quick access.",
    imgSrc: "/images/feature_favorites.png",
  },
  {
    feature: "Report a spot",
    desc: "Registered members can report an existing spot for problems.",
    imgSrc: "/images/feature_report.png",
  },
  {
    feature: "Add a new spot",
    desc: "Registered members can request to add a new spot to the map.",
    imgSrc: "/images/feature_add-spot.png",
  },
  {
    feature: "Request to delete a spot",
    desc: "Registered members can request to delete an existing spot on the map.",
    imgSrc: "/images/feature_delete-spot.png",
  },
  {
    feature: "Manage contributions",
    desc: "Registered members can view and delete their previous map contributions including reports and user-added spots.",
    imgSrc: "/images/feature_contributions.png",
  },
];

export default async function Home() {
  return (
    <>
      <Navbar />
      <div className="relative">
        <div className="flex flex-col items-center font-sans max-w-5xl mx-auto pt-8 max-md:h-[130vh]">
          <h1 className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center">
            {`Welcome to `}
            <span className="bg-clip-text text-transparent bg-gradient-to-b max-sm:bg-gradient-to-t from-green-400 to-green-600">
              BikOU
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
          {/* HERO IMAGES */}
          <div className="flex mt-10 max-md:flex-col">
            <div className="hero-image h-[450px] w-[450px] max-lg:h-[350px] max-lg:w-[350px] max-md:h-[250px] max-md:w-[250px] top-5 left-12 max-md:top-0 max-md:left-[-10px] z-[14]">
              <Image
                src={"/images/map_ui.png"}
                alt={"map ui"}
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
            <div className="hero-image h-[500px] w-[500px] max-lg:h-[400px] max-lg:w-[400px] max-md:h-[300px] max-md:w-[300px] max-md:top-[-60px] max-md:left-[10px] max-md:z-[15] z-[12]">
              <Image
                src={"/images/map_directions.png"}
                alt={"map directions"}
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
            {/* <div className="hero-image h-[425px] w-[425px] max-lg:h-[320px] max-lg:w-[320px] max-md:h-[220px] max-md:w-[220px] max-md:top-[-200px] max-md:left-[10px] max-md:z-[14] z-[13]">
              <Image
                src={"/images/map_reports.png"}
                alt={"map directions"}
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </div> */}
          </div>
          {/* ABOUT */}
          <div
            id="about"
            className="relative w-screen bg-[#f1f1f1] top-[-70px] max-md:top-[-100px]"
          >
            <div className="my-[100px] max-w-[1280px] px-10 max-lg:px-20 max-md:px-5 mx-auto">
              <h1 className="">About</h1>
              <h2 className="mb-12 italic">Designed with ease in mind.</h2>
              <div className="flex flex-col">
                <div className="flex flex-col gap-8">
                  <p className="text-black">
                    BikOU (Bike Parking) is designed to both
                    <strong> reduce </strong>
                    the overall bike and scooter commute time and
                    <strong> alleviate </strong> the stress and inconvenience of
                    finding safe and reliable parking spots for bikes and
                    scooters.
                  </p>
                  <p className="text-black">
                    We believe in the power of community: members can contribute
                    to the app by adding new parking spots and reporting issues
                    with existing ones. This collaborative approach ensures our
                    database is always up-to-date and reflective of the current
                    situation on the ground.
                  </p>
                  <p className="text-black">
                    Our mission is to make the bike and scooter commuting
                    experience more convenient by reducing the hassle of trying
                    to find a good spot to lock your vehicle.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="mt-8 w-fit font-mono bg-slate-900 text-white font-bold rounded-lg px-5 py-3 hover:opacity-80"
                >
                  Meet our team
                </Link>
              </div>
            </div>
          </div>
          {/* FEATURES */}
          <div className="max-w-[1280px] relative w-screen min-h-[50vh] top-[-50px] max-md:top-[-100px]">
            <div className="px-10 max-lg:px-20 max-md:px-5">
              <h1 className="mt-[100px]">Features</h1>
              <h2 className="mb-20 italic">Simple. Quick. Efficient.</h2>
              <div className="flex flex-col gap-32">
                {FEATURES.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-center ${
                      index % 2 === 0 ? "" : "flex-row-reverse"
                    } items-center gap-24`}
                  >
                    <div className="flex flex-col gap-3 max-w-[250px]">
                      <h2 className="">{item.feature}</h2>
                      <p className="">{item.desc}</p>
                    </div>
                    <div className="feature-image">
                      <Image
                        src={item.imgSrc}
                        alt={"Registered members can save up to 5 spots"}
                        fill
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
