// import { Link, Outlet, useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import NotificationBell from "../features/notifications/NotificationBell";

// export default function ProviderLayout() {
//   const navigate = useNavigate();

//   const { logout } = useContext(AuthContext);

//   const handleLogout = () => {
//     logout();
//     navigate("/login", { replace: true });
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>

//       {/* 🔥 SIDEBAR */}
//       <div
//         style={{
//           width: "220px",
//           background: "#1e293b",
//           color: "white",
//           padding: "20px",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between"
//         }}
//       >
//         <div>
//           <h2 style={{ marginBottom: "30px" }}>Job Portal</h2>

//           <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
//             <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
//             <Link to="/applications" style={linkStyle}>Applications</Link>
//           </nav>
//         </div>

//         {/* 🔥 LOGOUT */}
//         <button
//           onClick={handleLogout}
//           style={{
//             padding: "10px",
//             background: "#ef4444",
//             color: "white",
//             border: "none",
//             cursor: "pointer",
//             borderRadius: "4px"
//           }}
//         >
//           Logout
//         </button>
//       </div>

//       {/* 🔥 MAIN */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

//         {/* 🔥 TOP BAR (ADDED) */}
//         <div
//           style={{
//             height: "60px",
//             background: "white",
//             borderBottom: "1px solid #e5e7eb",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "flex-end",
//             padding: "0 20px"
//           }}
//         >
//           <NotificationBell />
//         </div>

//         {/* 🔥 CONTENT */}
//         <div
//           style={{
//             flex: 1,
//             padding: "20px",
//             overflowY: "auto",
//             background: "#f9fafb"
//           }}
//         >
//           <Outlet />
//         </div>

//       </div>
//     </div>
//   );
// }

// const linkStyle = {
//   color: "white",
//   textDecoration: "none",
//   fontSize: "16px"
// };

import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "../features/notifications/NotificationBell";

import {
  LayoutDashboard,
  FileText,
  User,
  Settings,
  LogOut
} from "lucide-react";

export default function ProviderLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="flex h-screen bg-slate-100">

      {/* 🔥 SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col p-5">

        <h2 className="text-xl font-bold text-purple-600 mb-8">
          JobPortal
        </h2>

        <nav className="flex flex-col gap-2">

          <NavItem to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
          <NavItem to="/applications" icon={<FileText />} label="Applications" />

        </nav>

        <div className="mt-auto space-y-2">

          <NavItem to="/provider/profile" icon={<User />} label="Profile" />
          <NavItem to="/settings" icon={<Settings />} label="Settings" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white w-full"
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>
      </aside>

      {/* 🔥 MAIN */}
      <div className="flex-1 flex flex-col">

        {/* 🔥 TOP BAR */}
        <header className="h-16 px-6 flex items-center justify-between bg-white border-b">

          <h1 className="text-lg font-semibold">
            {location.pathname === "/dashboard" && "Dashboard"}
            {location.pathname === "/applications" && "Applications"}
          </h1>

          <div className="flex items-center gap-4">

            <NotificationBell />

            {/* PROFILE */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-full"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                  {getInitials(user?.name)}
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl p-2 z-50">
                  <Link to="/profile" className="block px-3 py-2 hover:bg-slate-100 rounded">
                    Profile
                  </Link>
                  <Link to="/settings" className="block px-3 py-2 hover:bg-slate-100 rounded">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* 🔥 CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

/* NAV ITEM */
function NavItem({ to, icon, label }) {
  const location = useLocation();

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
        location.pathname === to
          ? "bg-purple-600 text-white"
          : "text-slate-600 hover:bg-slate-200"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}