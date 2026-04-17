import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // 🔥 Load token when app starts
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);

      const decoded = JSON.parse(atob(storedToken.split(".")[1]));

      const role =
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      setUser({ ...decoded, role });
    }
  }, []);

  // 🔐 Login function
  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);

    const decoded = JSON.parse(atob(token.split(".")[1]));

    const role =
      decoded.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    setUser({ ...decoded, role });
  };

  // 🚪 Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}