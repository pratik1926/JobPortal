import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

// 🌐 Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";

// 🧑‍💼 Provider
import Dashboard from "./features/provider/pages/Dashboard";
import ApplicationsPage from "./features/provider/pages/ApplicationsPage";

// 👤 Seeker
import SeekerDashboard from "./features/seeker/pages/SeekerDashboard";
import MyApplications from "./features/seeker/pages/MyApplications";

// 🔐 Auth
import ProtectedRoute from "./components/ProtectedRoute";

// 🧩 Layouts
import ProviderLayout from "./layouts/ProviderLayout";
import SeekerLayout from "./layouts/SeekerLayout";
import AdminLayout from "./layouts/AdminLayout";

// ✅ Admin
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import AdminUsers from "./features/admin/pages/AdminUsers";
import AdminJobs from "./features/admin/pages/AdminJobs";

import AdminReports from "./features/admin/pages/AdminReports";
import ProviderReports from "./features/provider/pages/ProviderReport";

import Profile from "./features/profile/Profile";

import ReportingCenter
  from "./features/admin/pages/ReportingCenter";

import ReportPreview
  from "./features/admin/pages/ReportPreview";

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

          <Route path="reporting" element={<ReportingCenter />}/>
          <Route path="reporting/:type" element={<ReportPreview />}/>
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