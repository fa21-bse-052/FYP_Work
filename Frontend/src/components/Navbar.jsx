import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function Navbar() {
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  // Updated backend base URL
  const backendBaseUrl = "https://mominah-edulearnai.hf.space";
  const token = Cookies.get("access_token");

  const [userData, setUserData] = useState(() => {
    const cookie = Cookies.get("user");
    return cookie ? JSON.parse(cookie) : {};
  });

  useEffect(() => {
    if (token) {
      const cookieUser = Cookies.get("user");
      if (cookieUser) {
        setUserData(JSON.parse(cookieUser));
      }
    }
  }, [token]);

  useEffect(() => {
    if (token && !userData.avatar) {
      axios
        .get(`${backendBaseUrl}/auth/user/data`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const data = response.data;
          setUserData(data);
          Cookies.set("user", JSON.stringify(data), { expires: 7, secure: true });
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
        });
    }
  }, [token, userData.avatar, backendBaseUrl]);

  const userName = userData.name || Cookies.get("name");
  const userAvatar =
    userData.avatar && typeof userData.avatar === "string"
      ? userData.avatar.startsWith("/auth/avatar/")
        ? `${backendBaseUrl}${userData.avatar}`
        : `${backendBaseUrl}/auth/avatar/${userData.avatar}`
      : null;

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("name");
    Cookies.remove("avatar");
    Cookies.remove("user");
    window.location.href = "/login";
  };

  return (
    <>
      <motion.nav
        className="w-full bg-white text-black py-4 px-4 md:px-8 flex justify-between items-center shadow-md sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center space-x-2 md:space-x-4"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="download.gif"
              alt="Logo"
              className="h-8 w-8 md:h-10 md:w-10 object-contain"
            />
            <span className="text-xl md:text-2xl font-bold tracking-wide">
              EduLearn AI
            </span>
          </Link>
        </motion.div>

        {/* Desktop Links */}
        <motion.div
          className="hidden md:flex flex-1 justify-center space-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {/* Services */}
          <motion.div
            className="relative"
            onMouseEnter={() => setShowServicesDropdown(true)}
            onMouseLeave={() => setShowServicesDropdown(false)}
          >
            <Link
              to="/services"
              className="text-lg font-semibold hover:text-yellow-300 transition duration-300"
            >
              Services
            </Link>
            {showServicesDropdown && (
              <motion.div
                className="absolute left-0 bg-white text-black shadow-md rounded-lg w-40 p-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/student-dashboard" className="block py-1 px-2 hover:bg-yellow-200">
                  Student
                </Link>
                <Link to="/teacher-dashboard" className="block py-1 px-2 hover:bg-yellow-200">
                  Teacher
                </Link>
                <Link to="/university-dashboard" className="block py-1 px-2 hover:bg-yellow-200">
                  University
                </Link>
              </motion.div>
            )}
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 150 }}>
            <Link to="/reviews" className="text-lg font-semibold hover:text-yellow-300 transition duration-300">
              Reviews
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 150 }}>
            <Link to="/about" className="text-lg font-semibold hover:text-yellow-300 transition duration-300">
              About Us
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 150 }}>
            <Link to="/contact" className="text-lg font-semibold hover:text-yellow-300 transition duration-300">
              Contact Us
            </Link>
          </motion.div>
        </motion.div>

        {/* Desktop Auth */}
        <motion.div
          className="hidden md:flex items-center space-x-4"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {token ? (
            <div
              className="relative"
              onMouseEnter={() => setShowProfileDropdown(true)}
              onMouseLeave={() => setShowProfileDropdown(false)}
            >
              <Link to="/profile">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold">
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </Link>
              {showProfileDropdown && (
                <div className="absolute right-0 bg-white text-black shadow-md rounded-lg w-48">
                  <Link to="/profile" className="flex items-center py-2 px-4 border-b hover:bg-yellow-200">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover mr-2"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold mr-2">
                        {userName ? userName.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <span>{userName}</span>
                  </Link>
                  <div className="py-2 px-4 hover:bg-yellow-200 cursor-pointer" onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold shadow-md hover:bg-yellow-300 transition duration-300"
            >
              Login
            </Link>
          )}
        </motion.div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="interactive"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden bg-white shadow-md px-4 pt-4 pb-6 space-y-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Services */}
          <div>
            <button
              className="flex justify-between items-center w-full text-lg font-semibold hover:text-yellow-300 transition duration-300"
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            >
              <span>Services</span>
              <span>{mobileServicesOpen ? "-" : "+"}</span>
            </button>
            {mobileServicesOpen && (
              <div className="mt-2 pl-4 space-y-2">
                <Link to="/student-dashboard" className="block hover:text-yellow-300" onClick={() => setMobileMenuOpen(false)}>
                  Student
                </Link>
                <Link to="/teacher-dashboard" className="block hover:text-yellow-300" onClick={() => setMobileMenuOpen(false)}>
                  Teacher
                </Link>
                <Link to="/university-dashboard" className="block hover:text-yellow-300" onClick={() => setMobileMenuOpen(false)}>
                  University
                </Link>
              </div>
            )}
          </div>

          <Link to="/reviews" className="block text-lg font-semibold hover:text-yellow-300 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
            Reviews
          </Link>
          <Link to="/about" className="block text-lg font-semibold hover:text-yellow-300 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
            About Us
          </Link>
          <Link to="/contact" className="block text-lg font-semibold hover:text-yellow-300 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
            Contact Us
          </Link>

          {/* Auth (mobile) */}
          <div className="pt-4 border-t">
            {token ? (
              <div className="space-y-2">
                <Link to="/profile" className="block text-lg font-semibold hover:text-yellow-300 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
                  {userAvatar ? (
                    <div className="flex items-center space-x-2">
                      <img
                        src={userAvatar}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span>{userName}</span>
                    </div>
                  ) : (
                    <span>{userName}</span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-lg font-semibold hover:text-yellow-300 transition duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block bg-yellow-400 text-gray-900 text-center px-4 py-2 rounded-lg font-bold shadow-md hover:bg-yellow-300 transition duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}

export default Navbar;
