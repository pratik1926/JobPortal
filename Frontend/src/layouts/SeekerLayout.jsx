// import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
// import { useContext, useState, useRef, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";

// export default function SeekerLayout() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { logout, user } = useContext(AuthContext);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const profileRef = useRef(null);

//   const handleLogout = () => {
//     logout();
//     navigate("/login", { replace: true });
//   };

//   const isActive = (path) => location.pathname === path;

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setShowProfileMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Get user initials for avatar
//   const getInitials = (name) => {
//     if (!name) return "U";
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }
        
//         .seeker-layout {
//           min-height: 100vh;
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//           background: #f8f9fb;
//         }
        
//         /* ========== TOP HEADER ========== */
//         .top-header {
//           background: white;
//           border-bottom: 1px solid #e5e7eb;
//           padding: 0 32px;
//           height: 64px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           position: sticky;
//           top: 0;
//           z-index: 100;
//         }
        
//         .header-left {
//           display: flex;
//           align-items: center;
//           gap: 40px;
//         }
        
//         .brand {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }
        
//         .brand-icon {
//           width: 32px;
//           height: 32px;
//           background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
//           border-radius: 8px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
        
//         .brand-icon svg {
//           width: 18px;
//           height: 18px;
//           color: white;
//         }
        
//         .brand-name {
//           font-size: 18px;
//           font-weight: 700;
//           color: #7c3aed;
//           letter-spacing: -0.02em;
//         }
        
//         /* Navigation */
//         .header-nav {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }
        
//         .nav-link {
//           padding: 8px 16px;
//           font-size: 14px;
//           font-weight: 500;
//           color: #6b7280;
//           text-decoration: none;
//           border-radius: 6px;
//           transition: all 0.15s ease;
//         }
        
//         .nav-link:hover {
//           color: #111827;
//           background: #f3f4f6;
//         }
        
//         .nav-link.active {
//           color: #7c3aed;
//           background: #f3e8ff;
//         }
        
//         /* Header Right - Profile */
//         .header-right {
//           display: flex;
//           align-items: center;
//           gap: 16px;
//         }
        
//         .contact-btn {
//           padding: 8px 16px;
//           font-size: 14px;
//           font-weight: 500;
//           color: #7c3aed;
//           background: white;
//           border: 1px solid #e5e7eb;
//           border-radius: 8px;
//           cursor: pointer;
//           transition: all 0.15s ease;
//         }
        
//         .contact-btn:hover {
//           border-color: #7c3aed;
//           background: #faf5ff;
//         }
        
//         /* Profile Avatar */
//         .profile-wrapper {
//           position: relative;
//         }
        
//         .profile-btn {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 6px;
//           padding-right: 12px;
//           background: #f9fafb;
//           border: 1px solid #e5e7eb;
//           border-radius: 100px;
//           cursor: pointer;
//           transition: all 0.15s ease;
//         }
        
//         .profile-btn:hover {
//           background: #f3f4f6;
//           border-color: #d1d5db;
//         }
        
//         .avatar {
//           width: 36px;
//           height: 36px;
//           background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-size: 14px;
//           font-weight: 600;
//         }
        
//         .avatar img {
//           width: 100%;
//           height: 100%;
//           border-radius: 50%;
//           object-fit: cover;
//         }
        
//         .profile-info {
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//         }
        
//         .profile-name {
//           font-size: 14px;
//           font-weight: 600;
//           color: #111827;
//           line-height: 1.2;
//         }
        
//         .profile-role {
//           font-size: 12px;
//           color: #6b7280;
//         }
        
//         .dropdown-arrow {
//           width: 16px;
//           height: 16px;
//           color: #9ca3af;
//           margin-left: 4px;
//           transition: transform 0.2s ease;
//         }
        
//         .profile-btn[data-open="true"] .dropdown-arrow {
//           transform: rotate(180deg);
//         }
        
//         /* Profile Dropdown Menu */
//         .profile-dropdown {
//           position: absolute;
//           top: calc(100% + 8px);
//           right: 0;
//           width: 220px;
//           background: white;
//           border: 1px solid #e5e7eb;
//           border-radius: 12px;
//           box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
//           padding: 8px;
//           opacity: 0;
//           visibility: hidden;
//           transform: translateY(-8px);
//           transition: all 0.2s ease;
//           z-index: 200;
//         }
        
//         .profile-dropdown.open {
//           opacity: 1;
//           visibility: visible;
//           transform: translateY(0);
//         }
        
//         .dropdown-header {
//           padding: 12px;
//           border-bottom: 1px solid #f3f4f6;
//           margin-bottom: 8px;
//         }
        
//         .dropdown-header-name {
//           font-size: 14px;
//           font-weight: 600;
//           color: #111827;
//         }
        
//         .dropdown-header-email {
//           font-size: 12px;
//           color: #6b7280;
//           margin-top: 2px;
//         }
        
//         .dropdown-item {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 10px 12px;
//           font-size: 14px;
//           color: #374151;
//           text-decoration: none;
//           border-radius: 8px;
//           cursor: pointer;
//           border: none;
//           background: none;
//           width: 100%;
//           text-align: left;
//           transition: background 0.15s ease;
//         }
        
//         .dropdown-item:hover {
//           background: #f3f4f6;
//         }
        
//         .dropdown-item svg {
//           width: 18px;
//           height: 18px;
//           color: #6b7280;
//         }
        
//         .dropdown-item.logout {
//           color: #dc2626;
//           margin-top: 8px;
//           border-top: 1px solid #f3f4f6;
//           padding-top: 16px;
//           border-radius: 0 0 8px 8px;
//         }
        
//         .dropdown-item.logout svg {
//           color: #dc2626;
//         }
        
//         .dropdown-item.logout:hover {
//           background: #fef2f2;
//         }
        
//         /* ========== MAIN LAYOUT ========== */
//         .main-layout {
//           display: flex;
//           min-height: calc(100vh - 64px);
//         }
        
//         /* ========== SIDEBAR ========== */
//         .sidebar {
//           width: 260px;
//           background: white;
//           border-right: 1px solid #e5e7eb;
//           padding: 24px 16px;
//           position: sticky;
//           top: 64px;
//           height: calc(100vh - 64px);
//           overflow-y: auto;
//         }
        
//         .sidebar-section {
//           margin-bottom: 24px;
//         }
        
//         .sidebar-title {
//           font-size: 12px;
//           font-weight: 600;
//           color: #9ca3af;
//           text-transform: uppercase;
//           letter-spacing: 0.05em;
//           padding: 0 12px;
//           margin-bottom: 8px;
//         }
        
//         .sidebar-nav {
//           display: flex;
//           flex-direction: column;
//           gap: 4px;
//         }
        
//         .sidebar-link {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding: 12px;
//           font-size: 14px;
//           font-weight: 500;
//           color: #6b7280;
//           text-decoration: none;
//           border-radius: 10px;
//           transition: all 0.15s ease;
//         }
        
//         .sidebar-link:hover {
//           color: #111827;
//           background: #f9fafb;
//         }
        
//         .sidebar-link.active {
//           color: #7c3aed;
//           background: #f3e8ff;
//         }
        
//         .sidebar-link.active svg {
//           color: #7c3aed;
//         }
        
//         .sidebar-link svg {
//           width: 20px;
//           height: 20px;
//           color: #9ca3af;
//         }
        
//         .sidebar-link .badge {
//           margin-left: auto;
//           background: #f3e8ff;
//           color: #7c3aed;
//           font-size: 11px;
//           font-weight: 600;
//           padding: 2px 8px;
//           border-radius: 100px;
//         }
        
//         /* ========== CONTENT ========== */
//         .content-area {
//           flex: 1;
//           padding: 32px;
//           animation: fadeIn 0.25s ease;
//         }
        
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(8px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         /* ========== RESPONSIVE ========== */
//         @media (max-width: 1024px) {
//           .header-nav {
//             display: none;
//           }
          
//           .sidebar {
//             width: 220px;
//           }
//         }
        
//         @media (max-width: 768px) {
//           .top-header {
//             padding: 0 16px;
//           }
          
//           .sidebar {
//             display: none;
//           }
          
//           .content-area {
//             padding: 16px;
//           }
          
//           .profile-info {
//             display: none;
//           }
          
//           .profile-btn {
//             padding: 4px;
//           }
//         }
//       `}</style>
      
//       <div className="seeker-layout">
//         {/* Top Header */}
//         <header className="top-header">
//           <div className="header-left">
//             {/* Brand */}
//             <div className="brand">
//               <div className="brand-icon">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
//                   <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
//                 </svg>
//               </div>
//               <span className="brand-name">JobPortal</span>
//             </div>
            
//             {/* Header Navigation */}
//             <nav className="header-nav">
//               <Link to="/" className="nav-link">Home</Link>
//               <Link 
//                 to="/seeker-dashboard" 
//                 className={`nav-link ${isActive("/seeker-dashboard") ? "active" : ""}`}
//               >
//                 Find Jobs
//               </Link>
//               <Link to="/employers" className="nav-link">Employers</Link>
//               <Link to="/about" className="nav-link">About us</Link>
//             </nav>
//           </div>
          
//           {/* Header Right - Profile */}
//           <div className="header-right">
//             <button className="contact-btn">Contact us</button>
            
//             {/* Profile */}
//             <div className="profile-wrapper" ref={profileRef}>
//               <button 
//                 className="profile-btn"
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//                 data-open={showProfileMenu}
//               >
//                 <div className="avatar">
//                   {user?.avatar ? (
//                     <img src={user.avatar} alt={user?.name || "User"} />
//                   ) : (
//                     getInitials(user?.name || "User")
//                   )}
//                 </div>
//                 <div className="profile-info">
//                   <span className="profile-name">{user?.name || "Job Seeker"}</span>
//                   <span className="profile-role">Job Seeker</span>
//                 </div>
//                 <svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <polyline points="6 9 12 15 18 9"/>
//                 </svg>
//               </button>
              
//               {/* Dropdown Menu */}
//               <div className={`profile-dropdown ${showProfileMenu ? "open" : ""}`}>
//                 <div className="dropdown-header">
//                   <div className="dropdown-header-name">{user?.name || "Job Seeker"}</div>
//                   <div className="dropdown-header-email">{user?.email || "user@example.com"}</div>
//                 </div>
                
//                 <Link to="/profile" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
//                     <circle cx="12" cy="7" r="4"/>
//                   </svg>
//                   My Profile
//                 </Link>
                
//                 <Link to="/settings" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <circle cx="12" cy="12" r="3"/>
//                     <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
//                   </svg>
//                   Settings
//                 </Link>
                
//                 <button className="dropdown-item logout" onClick={handleLogout}>
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
//                     <polyline points="16 17 21 12 16 7"/>
//                     <line x1="21" y1="12" x2="9" y2="12"/>
//                   </svg>
//                   Log out
//                 </button>
//               </div>
//             </div>
//           </div>
//         </header>
        
//         {/* Main Layout */}
//         <div className="main-layout">
//           {/* Sidebar */}
//           <aside className="sidebar">
//             <div className="sidebar-section">
//               <div className="sidebar-title">Menu</div>
//               <nav className="sidebar-nav">
//                 <Link 
//                   to="/seeker-dashboard" 
//                   className={`sidebar-link ${isActive("/seeker-dashboard") ? "active" : ""}`}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <circle cx="11" cy="11" r="8"/>
//                     <line x1="21" y1="21" x2="16.65" y2="16.65"/>
//                   </svg>
//                   <span>Browse Jobs</span>
//                 </Link>
                
//                 <Link 
//                   to="/my-applications" 
//                   className={`sidebar-link ${isActive("/my-applications") ? "active" : ""}`}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
//                     <polyline points="14 2 14 8 20 8"/>
//                     <line x1="16" y1="13" x2="8" y2="13"/>
//                     <line x1="16" y1="17" x2="8" y2="17"/>
//                     <polyline points="10 9 9 9 8 9"/>
//                   </svg>
//                   <span>My Applications</span>
//                 </Link>
                
//                 <Link 
//                   to="/saved-jobs" 
//                   className={`sidebar-link ${isActive("/saved-jobs") ? "active" : ""}`}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
//                   </svg>
//                   <span>Saved Jobs</span>
//                 </Link>
//               </nav>
//             </div>
            
//             <div className="sidebar-section">
//               <div className="sidebar-title">Account</div>
//               <nav className="sidebar-nav">
//                 <Link 
//                   to="/profile" 
//                   className={`sidebar-link ${isActive("/profile") ? "active" : ""}`}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
//                     <circle cx="12" cy="7" r="4"/>
//                   </svg>
//                   <span>My Profile</span>
//                 </Link>
                
//                 <Link 
//                   to="/settings" 
//                   className={`sidebar-link ${isActive("/settings") ? "active" : ""}`}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <circle cx="12" cy="12" r="3"/>
//                     <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
//                   </svg>
//                   <span>Settings</span>
//                 </Link>
//               </nav>
//             </div>
//           </aside>
          
//           {/* Content Area */}
//           <main className="content-area">
//             <Outlet />
//           </main>
//         </div>
//       </div>
//     </>
//   );
// }


import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

import {
  Search,
  FileText,
  Bookmark,
  User,
  Settings,
  LogOut
} from "lucide-react";

export default function SeekerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

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

          <NavItem to="/seeker-dashboard" icon={<Search />} label="Browse Jobs" />
          <NavItem to="/my-applications" icon={<FileText />} label="My Applications" />
          <NavItem to="/saved-jobs" icon={<Bookmark />} label="Saved Jobs" />

        </nav>

        <div className="mt-auto space-y-2">

          <NavItem to="/profile" icon={<User />} label="Profile" />
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

        {/* 🔥 TOP BAR (CLEAN) */}
        <header className="h-16 px-6 flex items-center justify-between bg-white border-b">

          <h1 className="text-lg font-semibold">
            {location.pathname === "/seeker-dashboard" && "Browse Jobs"}
            {location.pathname === "/my-applications" && "My Applications"}
            {location.pathname === "/saved-jobs" && "Saved Jobs"}
          </h1>

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
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl p-2">
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