import Navbar from "@/components/navbar/Navbar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mainBg">
      <Navbar />
      <div className="mt-7 flex justify-center items-center">{children}</div>
    </div>
  );
};

export default AuthLayout;
