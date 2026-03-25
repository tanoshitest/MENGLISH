import React, { createContext, useContext, useState, useCallback } from "react";
import type { Role } from "@/data/mockData";

interface RoleContextType {
  role: Role;
  toggleRole: () => void;
  changeRole: (r: Role) => void;
  isAdmin: boolean;
  isTeacher: boolean;
  isParent: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>("admin");
  const toggleRole = useCallback(() => setRole((r) => {
    if (r === "admin") return "teacher";
    if (r === "teacher") return "parent";
    return "admin";
  }), []);
  const changeRole = useCallback((newRole: Role) => setRole(newRole), []);
  
  return (
    <RoleContext.Provider value={{ 
      role, 
      toggleRole, 
      changeRole,
      isAdmin: role === "admin", 
      isTeacher: role === "teacher",
      isParent: role === "parent"
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};
