"use client";

import Navbar from "@/components/navbar/Navbar";
import ScrollToTop from "@/components/ScrollToTop";

const ContactLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ScrollToTop />
      <Navbar />
      <div>{children}</div>
    </div>
  );
};

export default ContactLayout;
