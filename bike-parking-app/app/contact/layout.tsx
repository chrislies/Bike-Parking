import Navbar from "@/components/navbar/Navbar";

const ContactLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
    </div>
  );
};

export default ContactLayout;
