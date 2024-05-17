import Navbar from "@/components/navbar/Navbar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen bg-gradient-to-b from-cyan-500 to-blue-500">
      <Navbar />
      <div className="h-[80vh] flex justify-center items-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
