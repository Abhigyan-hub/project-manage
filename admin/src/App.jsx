
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import AdminSlides from "./pages/AdminSlides";
import AdminJobs from "./pages/AdminJobs";
import AdminGallery from "./pages/AdminGallery";
import AdminCertificate from "./GenerateCertificate";
import AdminApplications from "./pages/AdminApplications";
import CandidateManager from "./pages/CandidateManager";
import CertificateLogs from "./pages/CertificateLogs";

function AppContent() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

  // Hide Sidebar on login page
  const hideSidebar = location.pathname === "/login";

  return (
    <div className="flex">
      {/* Sidebar */}
      {!hideSidebar && isLoggedIn && <AdminSidebar />}

      {/* Main Content */}
      <div className={`flex-1 ${!hideSidebar && isLoggedIn ? "md:ml-72" : ""}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hero-banner"
            element={
              <ProtectedRoute>
                <AdminSlides />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-listings"
            element={
              <ProtectedRoute>
                <AdminJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-applications"
            element={
              <ProtectedRoute>
                <AdminApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <AdminGallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <ProtectedRoute>
                <AdminCertificate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificate-logs"
            element={
              <ProtectedRoute>
                <CertificateLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate-excel"
            element={
              <ProtectedRoute>
                <CandidateManager />
              </ProtectedRoute>
            }
          />
          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
