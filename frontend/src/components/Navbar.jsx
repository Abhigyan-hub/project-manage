import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFacebook, FaTwitter, FaLinkedinIn, FaBars, FaPhone,FaInstagram ,FaWhatsapp} from 'react-icons/fa';
import { NavLink, useLocation  } from "react-router-dom";

// Data-driven approach for menu structure
const menuItems = [
  {
    title: 'Home',
    link: '/'
  },
  {
    title: 'About Us',
    link: '/about'
  },
  {
    title: 'Services',
    link: '/services'
  },
  {
    title: 'Contact',
    link: '/contact'
  },
  {
    title: 'Careers',
    link: '/serach-jobs'
  },
  {
    title: 'Gallery',
    link: '/gallary'
  }
];

const socialLinks = [
  {
    name: 'Whatsapp',
    icon: FaWhatsapp,
    href: 'https://wa.link/rck1ie',
    color: 'hover:text-blue-400'
  },
  {
    name: 'Instagram',
    icon: FaInstagram,
    href: 'https://www.instagram.com/ss.infotech_?igsh=MTJvNHVqdGZ0aXM2bA==',
    color: 'hover:text-blue-400'
  },
  {
    name: 'LinkedIn',
    icon: FaLinkedinIn,
    href: 'https://www.linkedin.com/company/ss-infotech-co/',
    color: 'hover:text-blue-400'
  }
];

// Reusable Social Link Component
const SocialLink = ({ social }) => {
  const IconComponent = social.icon;
  return (
    <motion.a
      href={social.href}
      className={`flex items-center space-x-2 transition-colors text-sm ${social.color}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Visit our ${social.name}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconComponent className="w-4 h-4" />
      <span className="font-semibold">{social.name}</span>
    </motion.a>
  );
};

// Navigation Item Component
const MotionNavLink = motion(NavLink);

const NavItem = ({ item }) => {
  const location = useLocation();

  const isActive =
    item.link === "/"
      ? location.pathname === "/"
      : location.pathname === item.link;

  return (
    <li className="relative">
      <MotionNavLink
        to={item.link}
        className={`font-semibold transition-colors py-2 block ${
          isActive
            ? "text-purple-600"
            : "text-gray-800 hover:text-purple-600"
        }`}
        whileHover={{ scale: 1.02 }}
      >
        {item.title}
      </MotionNavLink>
    </li>
  );
};

// Top Bar Component
const TopBar = () => (
  <motion.div
  className="relative overflow-hidden rounded-b-3xl shadow-2xl"
  initial={{ y: -60, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.7, ease: "easeOut" }}
>
  {/* Background Video */}
  <div className="absolute inset-0 overflow-hidden">
    <video
      src="/nav.mp4"                 // VIDEO PATH: /public/navbar.mp4
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover"
      style={{ filter: 'brightness(0.5) contrast(1.2)' }}
    />
  </div>

  {/* Dark Gradient Overlay + Glass Effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/95 via-purple-800/90 backdrop-blur-md" />

  {/* Optional Subtle Pattern (for texture) */}
  

  {/* Content */}
  <div className="relative z-10 w-full px-4 lg:px-8 py-3">
    <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
      
      {/* Optional: Phone / Update Note */}
      {/* <div className="flex items-center space-x-3 text-sm font-medium">
        <Phone className="w-4 h-4" />
        <span>Call: +91 77199 27774</span>
      </div> */}

      {/* Social Icons */}
      <div className="header-social flex space-x-5">
        {socialLinks.map((social, index) => (
          <motion.a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-2.5 rounded-full bg-white/15 backdrop-blur border border-white/30 shadow-lg transition-all duration-300 hover:bg-white/25 hover:shadow-xl hover:scale-110"
            whileHover={{ y: -3 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <social.icon className="w-5 h-5 text-white group-hover:text-purple-200 transition-colors" />
            <span className="sr-only">{social.name}</span>
          </motion.a>
        ))}
      </div>
    </div>
  </div>
</motion.div>
);

// Mobile Menu Toggle Component
const MobileMenuToggle = ({ onClick }) => (
  <motion.button
    className="lg:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors"
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    aria-label="Toggle mobile menu"
  >
    <FaBars className="w-6 h-6" />
  </motion.button>
);

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      {/* Top Bar (non-sticky) */}
      <TopBar />

      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <motion.div 
          className="bg-white px-4 lg:px-6 border-b border-gray-100"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="w-full px-4 lg:px-6">
            <div className="flex justify-between items-center py-3">
              
              {/* Logo */}
              <motion.div 
                className="header-logo"
                whileHover={{ scale: 1.05 }}
              >
                <NavLink to="/" className="block">
                  <img 
                    src="/logo.png" 
                    alt="SS Infotech Logo" 
                    className="h-16 w-auto sm:h-20 md:h-24 lg:h-28 xl:h-32 object-contain max-w-[200px] sm:max-w-[250px] lg:max-w-[300px]"
                    loading="eager"
                  />
                </NavLink>
              </motion.div>
              
              {/* Desktop Navigation */}
              <nav className="hidden lg:block py-2">
                <ul className="flex space-x-8 xl:space-x-10">
                  {menuItems.map((item, index) => (
                    <NavItem
                      key={item.title}
                      item={item}
                    />
                  ))}
                </ul>
              </nav>
              
              {/* CTA Section */}
              <div className="hidden md:flex items-center space-x-6">
                <motion.div 
                  className="call-box flex items-center space-x-2 text-gray-700"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaPhone className="w-4 h-4 text-purple-600 scale-x-[-1]" />
                  <span>
                    Call us: {' '}
                    <a 
                      href="tel:+9177199 27774" 
                      className="font-semibold hover:text-purple-600 transition-colors"
                    >
                      +91 82629 08256
                    </a>
                  </span>
                </motion.div>
                
                {/* <motion.button
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button> */}
              </div>
              
              {/* Mobile Menu Toggle */}
              <MobileMenuToggle onClick={toggleMobileMenu} />
            </div>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-white border-t border-gray-200 shadow-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-4">
                {menuItems.map((item, index) => (
                  <div key={item.title} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <NavLink
                      to={item.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`font-semibold text-lg transition-colors block ${
                        (
                          item.link === "/"
                            ? location.pathname === "/"
                            : location.pathname === item.link
                        )
                          ? "text-purple-600"
                          : "text-gray-800 hover:text-purple-600"
                      }`}
                    >
                      {item.title}
                    </NavLink>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;