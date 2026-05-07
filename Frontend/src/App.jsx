import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

// 🌐 Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";

// 🧑‍💼 Provider
import Dashboard from "./pages/Dashboard";
import ApplicationsPage from "./features/dashboard/ApplicationsPage";

// 👤 Seeker
import SeekerDashboard from "./features/dashboard/SeekerDashboard";
import MyApplications from "./features/dashboard/MyApplications";

// 🔐 Auth
import ProtectedRoute from "./components/ProtectedRoute";

// 🧩 Layouts
import ProviderLayout from "./layouts/ProviderLayout";
import SeekerLayout from "./layouts/SeekerLayout";
import AdminLayout from "./layouts/AdminLayout";

// ✅ Admin
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminJobs from "./pages/Admin/AdminJobs";

import AdminReports from "./pages/Admin/AdminReports";
import ProviderReports from "./pages/provider/ProviderReport";

import Profile from "./features/profile/Profile";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌐 PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        

        {/* 🔒 ADMIN ROUTES  */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* 🔒 PROVIDER ROUTES */}
        <Route
          element={
            <ProtectedRoute role="Provider">
              <ProviderLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/provider/reports" 
                element={<ProviderReports />} />

          {/* 🔥 COMMON (Provider) */}
          <Route path="/provider/profile" element={<Profile />} />
          <Route path="/provider/settings" element={<div>Settings Page</div>} />
        </Route>

        {/* 🔒 SEEKER ROUTES */}
        <Route
          element={
            <ProtectedRoute role="Seeker">
              <SeekerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
          <Route path="/my-applications" element={<MyApplications />} />

           {/* 🔥 ADD THESE */}
          <Route path="/seeker/profile" element={<Profile />} />
          <Route path="/seeker/saved-jobs" element={<div>Saved Jobs</div>} />
          <Route path="/seeker/settings" element={<div>Settings</div>} />
        </Route>

        

      </Routes>
    </BrowserRouter>

    
  );
}

export default App;