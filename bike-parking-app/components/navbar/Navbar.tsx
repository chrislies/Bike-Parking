"use client";

import { useRouter } from "next/navigation";
import { Add, Bookmark, Map, NavbarBookmark, User } from "../svgs";

const svgSize = 7;

const handleFavoritesClick = () => {};

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
    key: "favorites",
    label: "Favorites",
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

export default function Navbar() {
  const router = useRouter();
  return (
    <div className="absolute bottom-3 z-[999] max-w-fit mx-auto flex inset-x-0 justify-center select-none rounded-2xl">
      <div className="grid grid-flow-col grid-cols-4 gap-1 w-[400px] bg-white rounded-2xl border-2 border-[rgba(0,0,0,0.2)] shadow-md p-1">
        {NAV_LINKS.map((navItem) => (
          <button
            className="flex flex-col items-center justify-center py-1 hover:bg-gray-300 hover:rounded-xl"
            onClick={() => {
              router.push(navItem.href);
            }}
          >
            <span>{navItem.svg}</span>
            <p
              className="text-sm font-bold leading-5 tracking-wide"
              key={navItem.key}
            >
              {navItem.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
