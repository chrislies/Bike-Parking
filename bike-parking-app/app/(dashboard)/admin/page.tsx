// import User from "@/components/User";
// import SignOutButton from "@/components/auth/SignOutButton";
// import { authOptions } from "@/lib/auth";
// import { getServerSession } from "next-auth";

// const AdminPage = async () => {
//   const session = await getServerSession(authOptions);

//   if (session?.user) {
//     return (
//       <div>
//         <div className="flex flex-col h-screen justify-center items-center">
//           <h1>Bike Parking - Admin Page</h1>
//           <p>Welcome, {session?.user.username}</p>
//           <p>Client Session: </p>
//           <User />
//           <p>Server Session: </p>
//           {JSON.stringify(session)}
//           <SignOutButton />
//         </div>
//       </div>
//     );
//   }

//   // if user is not authenticated:
//   return <h1>Log In</h1>;
// };

// export default AdminPage;
