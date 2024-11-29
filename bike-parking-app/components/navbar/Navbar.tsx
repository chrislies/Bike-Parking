"use client";
import { useUserStore } from "@/app/stores/userStore";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navlink from "./Navlink";
import toast, { Toaster } from "react-hot-toast";

export const NAV_LINKS = [
  { href: "/#about", key: "about", label: "About" },
  { href: "/map", key: "map", label: "Map" },
  { href: "/contact", key: "contact", label: "Contact" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { initialize, session, signOut } = useUserStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully", {
      duration: 5000,
      id: "signOutSuccess",
    });
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

  // add event listener for the 'Escape' key to close the menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user scrolled down
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add the event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-3xl" : "shadow-none"
      }`}
    >
      <div
        id="navHeader"
        className={`sticky top-0 z-40 bg-white ${
          isMenuOpen ? "shadow-md" : "shadow-none"
        } transition-all duration-[900ms]`}
      >
        <nav className="flex justify-between items-center px-4 h-[--header-height] max-lg:padding-container mx-auto max-w-screen-lg py-1">
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
              <li key={link.key}>
                <Navlink
                  href={link.href}
                  className={`text-base font-semibold text-grey-50 flex justify-center cursor-pointer border-y-2 border-transparent hover:border-b-green-600/60 transition-all duration-300 ease-in-out`}
                  activeClasses={`border-b-green-600/70`}
                  label={link.label}
                />
              </li>
            ))}
            <li>
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="bg-red-600/80 text-base font-semibold text-grey-50 py-2 px-3 rounded-md text-white hover:bg-red-600/70 transition-all duration-100 ease-in-out"
                >
                  Sign out
                </button>
              ) : (
                <Navlink
                  href="/login"
                  className="bg-green-600/80 text-base font-semibold text-grey-50 py-2 px-3 rounded-md text-white hover:bg-green-600/70 transition-all duration-100 ease-in-out"
                  activeClasses=""
                  label="Log in"
                />
              )}
            </li>
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

      <div
        id="navMenu"
        className="lg:hidden z-30"
      >
        <div
          className={`fixed z-30 w-full flex flex-col shadow-3xl 
          ${isMenuOpen ? "top-[--header-height]" : "-top-[calc(3*var(--header-height))]"} 
          transition-all duration-[275ms] ease-linear`}
        >
          <ul>
            {NAV_LINKS.map((link, index) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className={
                    "bg-white border-b-2 py-4 text-xl text-grey-50 flex justify-center cursor-pointer font-[500] tracking-tight hover:text-green-700 transition-all duration-100 ease-in-out active:text-green-600/70"
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li
              className={`${
                session ? "hover:text-red-500" : "hover:text-green-700"
              } bg-white py-4 text-xl text-grey-50 flex justify-center cursor-pointer font-[500] tracking-tight transition-all duration-100 ease-in-out active:text-green-600/70 border-t`}
            >
              {session ? (
                <button onClick={handleSignOut}>Sign out</button>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                >
                  Log in
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div
        className={`lg:hidden absolute h-screen z-10 inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-[350ms] ease-in-out ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <Toaster
        position="top-center"
        toastOptions={{
          className: "",
          style: {
            zIndex: 9999999,
            position: "relative",
          },
        }}
        containerStyle={{
          zIndex: 9999999,
          position: "fixed",
        }}
      />
    </div>
  );
};

export default Navbar;
