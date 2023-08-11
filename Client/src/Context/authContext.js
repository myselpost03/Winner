import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (loginUsername, loginPassword) => {
    const res = await axios.post(
      "https://cloud-server.cyclic.app/api/auth/login",
      { username: loginUsername, password: loginPassword },
      { withCredentials: true }
    );

    const accessToken = res.data.accessToken;

    localStorage.setItem("accessToken", JSON.stringify(accessToken));

    setCurrentUser(res.data);
  };

  const logout = async () => {
    try {
      await axios.post("https://cloud-server.cyclic.app/api/auth/logout", null, {
        withCredentials: true,
      });

      setCurrentUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
