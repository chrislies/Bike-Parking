"use client";

import { MyUserContextProvider } from "@/hooks/useUser";
import { memo } from "react";

interface UserProviderProps {
  children: React.ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  return <MyUserContextProvider>{children}</MyUserContextProvider>;
};

export default memo(UserProvider);
