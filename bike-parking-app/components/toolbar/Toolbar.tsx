"use client";

import { Add, NavbarBookmark, User } from "../svgs";
import { memo, useEffect, useState } from "react";
import SavedModal from "../modals/SavedModal";
import { useRouter } from "next/navigation";
import ProfileModal from "../modals/ProfileModal";
import ContributeModal from "../modals/ContributeModal";

const ToolBar = () => {
  const router = useRouter();
  const [svgSize, setSvgSize] = useState(6);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

  const openSavedModal = () => {
    setIsSavedModalOpen(true);
  };
  const closeSavedModal = () => {
    setIsSavedModalOpen(false);
  };
  const openContributeModal = () => {
    setIsContributeModalOpen(true);
  };
  const closeContributeModal = () => {
    setIsContributeModalOpen(false);
  };
  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };
  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const NAV_LINKS = [
    {
      key: "saved",
      label: "Saved",
      svg: <NavbarBookmark className={`h-${svgSize} w-${svgSize}`} />,
      handleClick: openSavedModal,
    },
    {
      key: "contribute",
      label: "Contribute",
      svg: <Add className={`h-${svgSize} w-${svgSize}`} />,
      handleClick: openContributeModal,
    },
    {
      key: "profile",
      label: "Profile",
      svg: <User className={`h-${svgSize} w-${svgSize}`} />,
      handleClick: openProfileModal,
    },
  ];

  return (
    <>
      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={closeSavedModal}
      ></SavedModal>
      <ContributeModal
        isOpen={isContributeModalOpen}
        onClose={closeContributeModal}
      ></ContributeModal>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      ></ProfileModal>
      <div className="absolute bottom-3 z-[800] max-w-fit mx-auto flex inset-x-0 justify-center select-none rounded-2xl">
        <div className="grid grid-flow-col grid-cols-3 gap-1 sm:w-[325px] max-sm:w-[250px] bg-white rounded-2xl border-2 border-[rgba(0,0,0,0.2)] shadow-md p-1">
          {NAV_LINKS.map((navItem, index) => (
            <div
              key={index}
              // href={navItem.href}
              onClick={navItem.handleClick}
              className="cursor-pointer flex flex-col items-center justify-center py-1 hover:shadow-inner hover:bg-gray-300 hover:rounded-xl"
            >
              <span>{navItem.svg}</span>
              <p
                className="leading-5 sm:text-sm max-sm:text-xs sm:tracking-wide max-sm:tracking-tight sm:font-bold max-sm:font-semibold"
                key={navItem.key}
              >
                {navItem.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default memo(ToolBar);
