
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaBars, FaTimes, FaTachometerAlt, FaImages, FaBriefcase, FaFileAlt, FaCertificate, FaUsers, FaPhotoVideo, FaClipboardList } from "react-icons/fa";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/login");
    setIsOpen(false);
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
    { path: "/hero-banner", label: "Hero Banner", icon: FaPhotoVideo },
    { path: "/job-listings", label: "Job Listings", icon: FaBriefcase },
    { path: "/job-applications", label: "Job Applications", icon: FaFileAlt },
    { path: "/gallery", label: "Gallery", icon: FaImages },
    { path: "/certificates", label: "Certificates", icon: FaCertificate },
    { path: "/certificate-logs", label: "Certificate logs", icon: FaClipboardList },
    { path: "/candidate-excel", label: "Candidate Excel", icon: FaUsers },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md text-[#552586] text-2xl focus:outline-none focus:ring-2 focus:ring-[#552586] transition duration-200"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-white to-gray-50 border-r-2 border-[#1E245C]/20 shadow-lg z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-56 md:w-64 flex flex-col`}
        role="navigation"
        aria-label="Admin Sidebar"
      >
        {/* Logo / Title */}
        <div className="flex items-center justify-center p-4 border-b border-[#1E245C]/10 bg-white">
          <div className="flex items-center space-x-2">
            <img
              src="ssinfotech-logo.png"
              alt="SS Infotech Admin"
              className="h-[60px] w-auto object-contain"
              onError={(e) => (e.target.style.display = "none")}
            />
           
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col flex-1 p-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 text-[#552586] font-medium px-3 py-2 rounded-lg transition duration-200 text-sm ${
                  isActive
                    ? "bg-[#552586] text-white shadow-sm"
                    : "hover:bg-[#552586]/90 hover:text-white"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-[#1E245C]/10">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-[#552586] text-white font-medium px-3 py-2 rounded-lg hover:bg-[#552586] transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#552586] text-sm"
            aria-label="Logout"
          >
            <FaSignOutAlt size={14} />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
}
