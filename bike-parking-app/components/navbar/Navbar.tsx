"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navlink from "./Navlink";

export const NAV_LINKS = [
  { href: "/#about", key: "about", label: "About" },
  { href: "/map", key: "map", label: "Map" },
  { href: "/contact", key: "contact", label: "Contact" },
  { href: "/login", key: "login", label: "Log in" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen) {
        closeMenu();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="sticky top-0 z-50">
      <div
        id="navHeader"
        className={`sticky top-0 z-40 bg-white ${
          isMenuOpen ? "shadow-md" : "shadow-3xl"
        } transition-all duration-[900ms]`}
      >
        <nav className="flex justify-between items-center h-[--header-height] max-lg:padding-container mx-auto max-w-screen-lg py-1">
          <Link href="/">
            <Image
              src="/images/bike_parking_logo.png"
              alt="logo"
              width={70}
              height={70}
            />
          </Link>
          <ul className="hidden gap-16 lg:flex items-center">
            {NAV_LINKS.map((link) => (
              <li
                key={link.key}
                className={`${
                  link.key === "login"
                    ? "bg-green-600/80 py-1 px-3 rounded-md text-white hover:bg-green-600/70 transition-all duration-100 ease-in-out"
                    : null
                }`}
              >
                <Navlink
                  href={link.href}
                  className={`text-base font-semibold text-grey-50 flex justify-center cursor-pointer border-y-2 border-transparent ${
                    link.key === "login"
                      ? ""
                      : "hover:border-b-green-600/60 transition-all duration-300 ease-in-out"
                  }`}
                  activeClasses={`${
                    link.key === "login" ? null : "border-b-green-600/70"
                  }`}
                  label={link.label}
                />
              </li>
            ))}
          </ul>
          <div
            id="menu-button"
            onClick={toggleMenu}
            className="lg:hidden cursor-pointer"
          >
            <span
              className={`bar 
              ${isMenuOpen ? "rotate-45 translate-y-[8px]" : ""} 
              ease-in-out duration-300 transition-all`}
            ></span>
            <span
              className={`bar 
              ${isMenuOpen ? "opacity-0 bg-white" : ""} 
              ease-in-out duration-50 transition-all`}
            ></span>
            <span
              className={`bar 
              ${isMenuOpen ? "rotate-[-45deg] translate-y-[-8px]" : ""} 
                ease-in-out duration-300 transition-all`}
            ></span>
          </div>
        </nav>
      </div>

      <div id="navMenu" className="lg:hidden z-30">
        <div
          className={`fixed z-30 w-full border-t-2d flex flex-col shadow-3xl 
          ${isMenuOpen ? "top-[--header-height]" : "-top-[100%]"} 
          transition-all duration-[400ms] ease-linear`}
        >
          <ul>
            {NAV_LINKS.map((link, index) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className={`${
                    index === NAV_LINKS.length - 1 ? "" : "border-b-2"
                  }
                  bg-white py-4 text-xl text-grey-50 flex justify-center cursor-pointer font-[500] tracking-tight hover:text-green-700 transition-all duration-100 ease-in-out active:text-green-600/70`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`lg:hidden absolute h-screen z-10 inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-[350ms] ease-in-out ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
    </div>
  );
};

export default Navbar;
