import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🌐 Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

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


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌐 PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;