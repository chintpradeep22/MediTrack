import { createContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/me", {
          withCredentials: true,
        });

        const user = res.data

        const userWithRole = {
          ...user,
          role: user.role === "ADMIN" ? "ADMIN" : "NURSE" // Use the role from the form
        };

        setUser(userWithRole);
        console.log(userWithRole)
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
