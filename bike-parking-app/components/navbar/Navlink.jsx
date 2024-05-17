"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navlink = ({ href, label, activeClasses, className }) => {
  const path = usePathname();
  const isActive = path === href;
  return (
    <Link
      className={`${isActive ? activeClasses : ""} ${className}`}
      href={href}
    >
      {label}
    </Link>
  );
};

export default Navlink;
