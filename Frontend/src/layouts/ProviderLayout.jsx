import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import {
LayoutDashboard,
FileText,
ShieldAlert,
User,
Settings,
LogOut
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "../features/notifications/components/NotificationBell";

export default function ProviderLayout() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    logout,
    user
  } = useContext(AuthContext);

  const [showMenu, setShowMenu] =
    useState(false);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  // =========================
  // USER INITIALS
  // =========================
  const getInitials = (name) => {

    if (!name) return "U";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // =========================
  // PAGE TITLE
  // =========================
  const getPageTitle = () => {

    switch (location.pathname) {

      case "/dashboard":
        return "Dashboard";

      case "/applications":
        return "Applications";

      case "/provider/reports":
        return "Reports";

      case "/provider/profile":
        return "Profile";

      case "/provider/settings":
        return "Settings";

      default:
        return "Provider Panel";
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-[#0f172a]">

      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-5">

        {/* LOGO */}
        <h2 className="text-2xl font-bold text-purple-600 mb-8">
          JobPortal
        </h2>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-2">

          <NavItem
            to="/dashboard"
            icon={<LayoutDashboard />}
            label="Dashboard"
          />

          <NavItem
            to="/applications"
            icon={<FileText />}
            label="Applications"
          />

          <NavItem
            to="/provider/reports"
            icon={<ShieldAlert />}
            label="Reports"
          />

        </nav>

        {/* BOTTOM */}
        <div className="mt-auto space-y-2">

          <NavItem
            to="/provider/profile"
            icon={<User />}
            label="Profile"
          />

          <NavItem
            to="/provider/settings"
            icon={<Settings />}
            label="Settings"
          />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white w-full transition"
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>
      </aside>

      {/* ========================= */}
      {/* MAIN */}
      {/* ========================= */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="h-16 px-6 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">

          <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
            {getPageTitle()}
          </h1>

          <div className="flex items-center gap-4">

            <NotificationBell />

            {/* PROFILE MENU */}
            <div className="relative">

              <button
                onClick={() =>
                  setShowMenu(!showMenu)
                }
                className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-full"
              >

                {/* AVATAR */}
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">

                  {getInitials(user?.name)}

                </div>

                {/* NAME */}
                <span className="text-sm font-medium text-slate-700 dark:text-white">
                  {user?.name}
                </span>

              </button>

              {/* DROPDOWN */}
              {showMenu && (

                <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl p-2 z-50">

                  <Link
                    to="/provider/profile"
                    className="block px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/provider/settings"
                    className="block px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    Logout
                  </button>

                </div>
              )}

            </div>

          </div>
        </header>

        {/* CONTENT */}
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

  const location =
    useLocation();

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
        location.pathname === to
          ? "bg-purple-600 text-white shadow"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
      }`}
    >

      {icon}
      {label}

    </Link>
  );
}