import React, { createContext, useContext, useState, useCallback } from "react";
import type { Role } from "@/data/mockData";

interface RoleContextType {
  role: Role;
  toggleRole: () => void;
  isAdmin: boolean;
  isTeacher: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>("admin");
  const toggleRole = useCallback(() => setRole((r) => (r === "admin" ? "teacher" : "admin")), []);
  return (
    <RoleContext.Provider value={{ role, toggleRole, isAdmin: role === "admin", isTeacher: role === "teacher" }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};
