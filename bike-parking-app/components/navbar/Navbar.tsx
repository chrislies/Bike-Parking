"use client";

import { Add, Map, NavbarBookmark, User } from "../svgs";
import Link from "next/link";
import { useEffect, useState } from "react";

const handleFavoritesClick = () => {};

export default function Navbar() {
  const [svgSize, setSvgSize] = useState(6); // useState for svgSize

  useEffect(() => {
    const updateSvgSize = () => {
      setSvgSize(window.screen.width <= 640 ? 5 : 6);
    };
    updateSvgSize(); // call the function once when component mounts

    // add event listener for resize
    window.addEventListener("resize", updateSvgSize);

    // cleanup
    return () => window.removeEventListener("resize", updateSvgSize);
  }, []);

  const NAV_LINKS = [
    {
      href: "#",
      key: "map",
      label: "Map",
      svg: <Map className={`h-${svgSize} w-${svgSize}`} />,
    },
    {
      href: "/favorites",
      handleClick: handleFavoritesClick,
      key: "saved",
      label: "Saved",
      svg: <NavbarBookmark className={`h-${svgSize} w-${svgSize}`} />,
    },
    {
      href: "#",
      key: "contribute",
      label: "Contribute",
      svg: <Add className={`h-${svgSize} w-${svgSize}`} />,
    },
    {
      href: "/account",
      key: "account",
      label: "Account",
      svg: <User className={`h-${svgSize} w-${svgSize}`} />,
    },
  ];

  return (
    <div className="absolute bottom-3 z-[999] max-w-fit mx-auto flex inset-x-0 justify-center select-none rounded-2xl">
      <div className="grid grid-flow-col grid-cols-4 gap-1 sm:w-[400px] max-sm:w-[300px] bg-white rounded-2xl border-2 border-[rgba(0,0,0,0.2)] shadow-md p-1">
        {NAV_LINKS.map((navItem, index) => (
          <Link
            key={index}
            href={navItem.href}
            className="flex flex-col items-center justify-center py-1 hover:bg-gray-300 hover:rounded-xl"
          >
            <span>{navItem.svg}</span>
            <p
              className="leading-5 sm:text-sm max-sm:text-xs sm:tracking-wide max-sm:tracking-tight sm:font-bold max-sm:font-semibold"
              key={navItem.key}
            >
              {navItem.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
