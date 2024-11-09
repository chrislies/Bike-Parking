import Navbar from "@/components/navbar/Navbar";
import Image from "next/image";
import Link from "next/link";
import styles from "../app/css/homePage.module.css";
import { FEATURES } from "@/constants";

export default async function Home() {
  return (
    <>
      <Navbar />
      <div className="relative">
        <div className="flex flex-col items-center font-sans mx-auto pt-8">
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
            <div
              className={`${styles.hero_image} h-[450px] w-[450px] max-lg:h-[350px] max-lg:w-[350px] max-md:h-[250px] max-md:w-[250px] top-5 left-12 max-md:top-0 max-md:left-[-10px] z-[14]`}
            >
              <Image
                src={"/images/map_ui.png"}
                alt={"map ui"}
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
            <div
              className={`${styles.hero_image} h-[500px] w-[500px] max-lg:h-[400px] max-lg:w-[400px] max-md:h-[300px] max-md:w-[300px] max-md:top-[-60px] max-md:left-[10px] max-md:z-[15] z-[12]`}
            >
              <Image
                src={"/images/map_directions.png"}
                alt={"map directions"}
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
            {/* <div className="hero_image h-[425px] w-[425px] max-lg:h-[320px] max-lg:w-[320px] max-md:h-[220px] max-md:w-[220px] max-md:top-[-200px] max-md:left-[10px] max-md:z-[14] z-[13]">
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
          <section
            id="about"
            className="relative w-screen bg-[#f1f1f1] top-[-70px] max-md:top-[-100px]"
          >
            <div className="my-[100px] max-w-screen-lg px-10 max-lg:px-20 max-md:px-5 mx-auto">
              <h1>About</h1>
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
          </section>
          {/* FEATURES */}
          <section className="w-screen mb-16">
            <div className="max-w-screen-lg px-10 max-lg:px-20 max-md:px-5 mx-auto">
              <h1>Features</h1>
              <h2 className="mb-12 italic">Simple. Quick. Efficient.</h2>
              <div className="flex flex-col gap-32 max-sm:gap-24">
                {FEATURES.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-center items-center gap-24 max-sm:flex-col max-sm:gap-2 ${
                      index % 2 === 0 ? "" : "flex-row-reverse"
                    }`}
                  >
                    <div className="max-w-[250px] relative">
                      <span
                        className={`h-3 w-16 absolute z-[-1] top-5 -left-2 ${
                          index % 2 === 0 ? "bg-green-300" : "bg-red-300"
                        }`}
                      ></span>
                      <h2 className="text-2xl">{item.feature}</h2>
                      <p className="text-lg max-sm:mx-0">{item.desc}</p>
                    </div>
                    <div className={styles.feature_image}>
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
          </section>
        </div>
      </div>
    </>
  );
}
