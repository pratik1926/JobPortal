// import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
// import { useContext } from "react";
// import { ThemeContext } from "../context/ThemeContext";
// import { AuthContext } from "../context/AuthContext";

// import {
//   LayoutDashboard,
//   Users,
//   Briefcase,
//   Sun,
//   Moon,
//   LogOut,
// } from "lucide-react";

// export default function AdminLayout() {
//   const { dark, toggleTheme } = useContext(ThemeContext);
//   const { logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = async () => {
//     await logout();
//     navigate("/login");
//   };

//   // 🔥 Dynamic title (PRO TOUCH)
//   const getTitle = () => {
//     if (location.pathname.includes("/admin/users")) return "Users";
//     if (location.pathname.includes("/admin/jobs")) return "Jobs";
//     return "Dashboard";
//   };

//   return (
//     <div className="flex h-screen bg-slate-100 dark:bg-[#0f172a]">

//       {/* 🔥 SIDEBAR */}
//       <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col">

//         <h2 className="text-xl font-semibold mb-8 text-slate-800 dark:text-white">
//           Admin Panel
//         </h2>

//         <nav className="flex flex-col gap-2">

//           {/* ✅ IMPORTANT: remove `end` for dashboard */}
//           <NavItem to="/admin" icon={<LayoutDashboard />} label="Dashboard" />
//           <NavItem to="/admin/users" icon={<Users />} label="Users" />
//           <NavItem to="/admin/jobs" icon={<Briefcase />} label="Jobs" />

//         </nav>

//         {/* 🔻 Bottom Actions */}
//         <div className="mt-auto flex flex-col gap-3">

//           <button
//             onClick={toggleTheme}
//             className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white"
//           >
//             {dark ? <Sun size={16} /> : <Moon size={16} />}
//             Toggle Theme
//           </button>

//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
//           >
//             <LogOut size={16} />
//             Logout
//           </button>

//         </div>
//       </aside>

//       {/* 🔥 MAIN CONTENT */}
//       <div className="flex-1 flex flex-col">

//         {/* 🔥 TOPBAR */}
//         <header className="h-16 px-6 flex items-center justify-between 
//                           border-b border-slate-200 dark:border-slate-800 
//                           bg-white dark:bg-slate-900">

//           <h1 className="text-lg font-medium text-slate-800 dark:text-white">
//             {getTitle()}
//           </h1>

//         </header>

//         {/* 🔥 PAGE CONTENT */}
//         <main className="flex-1 overflow-y-auto p-6">
//           <Outlet />
//         </main>

//       </div>
//     </div>
//   );
// }

// /* 🔹 NAV ITEM */
// function NavItem({ to, icon, label }) {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `flex items-center gap-3 px-3 py-2 rounded-lg transition 
//         ${
//           isActive
//             ? "bg-blue-600 text-white"
//             : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
//         }`
//       }
//     >
//       {icon}
//       {label}
//     </NavLink>
//   );
// }


import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";

import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShieldAlert,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

export default function AdminLayout() {

  const { dark, toggleTheme } =
    useContext(ThemeContext);

  const { logout } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // =========================
  // DYNAMIC PAGE TITLE
  // =========================
  const getTitle = () => {

    if (
      location.pathname.includes("/admin/users")
    )
      return "Users";

    if (
      location.pathname.includes("/admin/jobs")
    )
      return "Jobs";

    if (
      location.pathname.includes("/admin/reports")
    )
      return "Reports Moderation";

    return "Dashboard";
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-[#0f172a]">

      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col">

        <h2 className="text-xl font-semibold mb-8 text-slate-800 dark:text-white">
          Admin Panel
        </h2>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-2">

          <NavItem
            to="/admin"
            icon={<LayoutDashboard />}
            label="Dashboard"
          />

          <NavItem
            to="/admin/users"
            icon={<Users />}
            label="Users"
          />

          <NavItem
            to="/admin/jobs"
            icon={<Briefcase />}
            label="Jobs"
          />

          {/* 🔥 NEW REPORTS TAB */}
          <NavItem
            to="/admin/reports"
            icon={<ShieldAlert />}
            label="Reports"
          />

        </nav>

        {/* ========================= */}
        {/* BOTTOM ACTIONS */}
        {/* ========================= */}
        <div className="mt-auto flex flex-col gap-3">

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white"
          >
            {dark
              ? <Sun size={16} />
              : <Moon size={16} />
            }

            Toggle Theme
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>
      </aside>

      {/* ========================= */}
      {/* MAIN CONTENT */}
      {/* ========================= */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header
          className="h-16 px-6 flex items-center justify-between 
          border-b border-slate-200 dark:border-slate-800 
          bg-white dark:bg-slate-900"
        >

          <h1 className="text-lg font-medium text-slate-800 dark:text-white">
            {getTitle()}
          </h1>

        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

/* ========================= */
/* NAV ITEM */
/* ========================= */

function NavItem({
  to,
  icon,
  label
}) {

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition 
        ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
        }`
      }
    >

      {icon}
      {label}

    </NavLink>
  );
}