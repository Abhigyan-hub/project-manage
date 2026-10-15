import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/login");
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/hero-banner", label: "Hero Banner" },
    { path: "/job-listings", label: "Job Listings" },
    { path: "/job-applications", label: "Job Applications" },
    { path: "/gallery", label: "Gallery" },
    { path: "/certificates", label: "Certificates" },
    { path: "/certificate-logs", label: "Certificate logs" },
    { path: "/candidate-excel", label: "Candidate Excel" },
  ];

  return (
    <nav className="bg-white border-b-2 border-[#1E245C]/20 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo / Title */}
        <div className="flex items-center space-x-2">
          <img
            src="ssinfotech-logo.png"
            alt="SS Infotech Admin"
            className="h-12 w-auto object-contain"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-[#1E245C] font-medium hover:bg-[#1E245C] hover:text-white px-4 py-2 rounded-lg transition duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 bg-[#1E245C] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#2E3AA3] transition duration-300"
          >
            <FaSignOutAlt size={16} />
            Logout
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#1E245C] text-2xl focus:outline-none"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#1E245C]/10 shadow-lg flex flex-col px-6 py-3 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="text-[#1E245C] font-medium hover:bg-[#1E245C] hover:text-white px-4 py-2 rounded-lg transition duration-200"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="flex items-center justify-center gap-2 bg-[#1E245C] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#2E3AA3] transition duration-300"
          >
            <FaSignOutAlt size={16} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
