// // import { createContext, useState, useEffect } from "react";

// // export const AuthContext = createContext();

// // export function AuthProvider({ children }) {
// //   const [token, setToken] = useState(null);
// //   const [user, setUser] = useState(null);

// //   // 🔥 Load token when app starts
// //   useEffect(() => {
// //     const storedToken = localStorage.getItem("token");

// //     if (storedToken) {
// //       setToken(storedToken);

// //       const decoded = JSON.parse(atob(storedToken.split(".")[1]));

// //       const role =
// //         decoded.role ||
// //         decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

// //       setUser({ ...decoded, role });
// //     }
// //   }, []);

// //   // 🔐 Login function
// //   const login = (token) => {
// //     localStorage.setItem("token", token);
// //     setToken(token);

// //     const decoded = JSON.parse(atob(token.split(".")[1]));

// //     const role =
// //       decoded.role ||
// //       decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

// //     setUser({ ...decoded, role });
// //   };

// //   // 🚪 Logout function
// //   const logout = () => {
// //     localStorage.removeItem("token");
// //     setToken(null);
// //     setUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ token, user, login, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }

// import { createContext, useState, useEffect } from "react";
// import api from "../api/axios"; // ✅ use your configured axios

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔥 REFRESH FUNCTION (REUSABLE)
//   const refreshToken = async () => {
//     try {
//       const res = await api.post(
//         "/User/refresh",
//         {},
//         { withCredentials: true } // ✅ required for cookies
//       );

//       const newToken = res.data.token;
//       setToken(newToken);
//       localStorage.setItem("token", newToken);

//       return newToken;
//     } catch (err) {
//       console.error("Refresh failed:", err);
//       setToken(null);
//       return null;
//     }
//   };

//   // 🔥 AUTO LOGIN ON APP LOAD
//   useEffect(() => {
//     const initAuth = async () => {
//       await refreshToken();
//       setLoading(false);
//     };

//     initAuth();
//   }, []);

//   // 🔐 LOGIN (called after successful login API)
//   const login = (token) => {
//     setToken(token);
//     localStorage.setItem("token", token);
//   };

//   // 🚪 LOGOUT
//   const logout = async () => {
//     try {
//       await api.post(
//         "/User/logout",
//         {},
//         { withCredentials: true }
//       );
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }

//     setToken(null);
//     localStorage.removeItem("token");
//   };

//   return (
//     <AuthContext.Provider value={{ token, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// import { createContext, useState, useEffect } from "react";
// import api from "../api/axios";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔥 Refresh token (only when needed)
//   const refreshToken = async () => {
//     try {
//       const res = await api.post(
//         "/User/refresh",
//         {},
//         { withCredentials: true }
//       );

//       const newToken = res.data.token;

//       setToken(newToken);
//       localStorage.setItem("token", newToken);

//       return newToken;
//     } catch (err) {
//       console.error("Refresh failed:", err);
//       setToken(null);
//       localStorage.removeItem("token");
//       return null;
//     }
//   };

//   // 🔥 FIXED: Load token properly
//   useEffect(() => {
//     const initAuth = async () => {
//       const storedToken = localStorage.getItem("token");

//       if (storedToken) {
//         // ✅ Use existing token first (DO NOT override immediately)
//         setToken(storedToken);
//       } else {
//         // 🔥 Only try refresh if no token
//         await refreshToken();
//       }

//       setLoading(false);
//     };

//     initAuth();
//   }, []);

//   // 🔐 Login
//   const login = (token) => {
//     setToken(token);
//     localStorage.setItem("token", token);
//   };

//   // 🚪 Logout
//   const logout = async () => {
//     try {
//       await api.post("/User/logout", {}, { withCredentials: true });
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }

//     setToken(null);
//     localStorage.removeItem("token");
//   };

//   return (
//     <AuthContext.Provider value={{ token, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const getUserFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        email: payload.email,
        role:
          payload.role ||
          payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      };
    } catch {
      return null;
    }
  };

  const refreshToken = async () => {
    try {
      const res = await api.post("/User/refresh");
      const newToken = res.data.token;

      setToken(newToken);
      setUser(getUserFromToken(newToken));
      localStorage.setItem("token", newToken);

      return newToken;
    } catch (err) {
      console.error("Refresh failed:", err);
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      return null;
    }
  };

  useEffect(() => {
  const initAuth = async () => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      if (!isTokenExpired(storedToken)) {
        // ✅ valid token
        setToken(storedToken);
        setUser(getUserFromToken(storedToken));
      } else {
        // 🔥 ONLY try refresh if token existed
        const newToken = await refreshToken();

        if (!newToken) {
          setToken(null);
          setUser(null);
        }
      }
    }

    // ❌ DO NOTHING if no token exists
    // This prevents infinite refresh loop

    setLoading(false);
  };

  initAuth();
}, []);

  const login = (token) => {
    setToken(token);
    setUser(getUserFromToken(token));
    localStorage.setItem("token", token);
  };

  const logout = async () => {
    try {
      await api.post("/User/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};