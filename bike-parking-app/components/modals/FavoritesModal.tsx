import { useEffect, ReactNode } from "react";

import React from "react";
import ReactPortal from "./ReactPortal";

interface FavoritesModalProps {
  children: ReactNode;
  isOpen: boolean;
  handleClose: () => void;
}

const FavoritesModal = ({
  children,
  isOpen,
  handleClose,
}: FavoritesModalProps) => {
  // Close the modal on when 'esc' key is pressed
  useEffect(() => {
    const closeOnEscKey = (e: KeyboardEvent) =>
      e.key === "Escape" ? handleClose() : null;
    document.body.addEventListener("keydown", closeOnEscKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscKey);
    };
  }, [handleClose]);

  // Disable scroll on modal load
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return (): void => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <>
        <div className="fixed top-0 left-0 w-screen h-screen z-40 bg-neutral-800 opacity-50" />
        <div className="fixed rounded flex flex-col box-border min-w-fit overflow-hidden p-5 bg-zinc-800 inset-y-32 inset-x-16">
          <button
            onClick={handleClose}
            className="py-2 px-8 self-end font-bold hover:bg-violet-600 border rounded"
          >
            Close
          </button>
          <div className="box-border h-5/6">{children}</div>
        </div>
      </>
    </ReactPortal>
  );
};

export default FavoritesModal;
