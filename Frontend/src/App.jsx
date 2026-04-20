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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌐 PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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