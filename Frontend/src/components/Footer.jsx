import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

function Footer() {
  const [footerVisible, setFooterVisible] = useState(false);
  const footerRef = useRef(null);
  const startY = useRef(0);

  // Detect swipe gestures
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    if (startY.current - currentY > 100) {
      // Swipe Up: Show Footer
      setFooterVisible(true);
    } else if (currentY - startY.current > 100) {
      // Swipe Down: Hide Footer
      setFooterVisible(false);
    }
  };

  // Add event listeners for touch events
  useEffect(() => {
    const footer = footerRef.current;
    footer.addEventListener("touchstart", handleTouchStart);
    footer.addEventListener("touchmove", handleTouchMove);

    return () => {
      footer.removeEventListener("touchstart", handleTouchStart);
      footer.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`bg-yellow-400 text-black py-12 px-8 transition-transform duration-300 ease-in-out transform ${
        footerVisible ? "translateY(0)" : "translateY(100%)"
      }`}
      style={{ position: "relative", height: footerVisible ? "100vh" : "auto" }}
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo Section */}
        <div>
          <Link to="/">
            <img
              src="download.gif"
              alt="EduLearn AI Logo"
              className="w-32 mb-4 cursor-pointer"
            />
          </Link>
          <p className="text-2xl font-extrabold text-black">
          EduLearn AI.
          </p>
        </div>

        {/* Explore Column */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Explore</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/services"
                className="hover:underline transform transition-transform duration-300 hover:scale-125"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:underline transform transition-transform duration-300 hover:scale-125"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/blogs"
                className="hover:underline transform transition-transform duration-300 hover:scale-125"
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:underline transform transition-transform duration-300 hover:scale-125"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow Us Column */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <ul className="space-y-4">
            <li className="flex items-center space-x-2 transform transition-transform duration-300 hover:scale-125">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700 flex items-center space-x-2"
              >
                <FaFacebookF size={20} />
                <span className="hidden md:inline">Facebook</span>
              </a>
            </li>
            <li className="flex items-center space-x-2 transform transition-transform duration-300 hover:scale-125">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700 flex items-center space-x-2"
              >
                <FaInstagram size={20} />
                <span className="hidden md:inline">Instagram</span>
              </a>
            </li>
            <li className="flex items-center space-x-2 transform transition-transform duration-300 hover:scale-125">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700 flex items-center space-x-2"
              >
                <FaLinkedinIn size={20} />
                <span className="hidden md:inline">LinkedIn</span>
              </a>
            </li>
            <li className="flex items-center space-x-2 transform transition-transform duration-300 hover:scale-125">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700 flex items-center space-x-2"
              >
                <FaTwitter size={20} />
                <span className="hidden md:inline">Twitter</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Location Column */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Location</h3>
          <p className="text-sm font-medium">
            EduLearn AI Headquarters
            <br />
            123 Innovation Way
            <br />
            Education City, ED 45678
          </p>
        </div>
      </div>

      <div className="text-center mt-8 border-t border-black pt-4">
        <p className="text-sm font-medium">
          &copy; {new Date().getFullYear()} EduLearn AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
