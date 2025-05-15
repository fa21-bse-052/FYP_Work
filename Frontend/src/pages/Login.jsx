import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Cookies from "js-cookie"; // For handling cookies
import { motion } from "framer-motion";

// Create a motion-enhanced Link for the Sign Up button
const MotionLink = motion(Link);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      // Updated backend URL for login
      const response = await axios.post(
        "https://mominah-edulearnai.hf.space/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        const { access_token, refresh_token, name, avatar } = response.data;
        Cookies.set("access_token", access_token, { expires: 7, secure: true });
        Cookies.set("refresh_token", refresh_token, { expires: 7, secure: true });
        Cookies.set("name", name, { expires: 7, secure: true });
        if (avatar) {
          Cookies.set("avatar", avatar, { expires: 7, secure: true });
        }
        navigate("/services");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.detail || "Login failed");
      } else {
        setErrorMessage("Network error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Side: Logo Section */}
      <motion.div
        className="hidden lg:flex flex-col justify-center items-center bg-white w-1/2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img src="automation.gif" alt="Automation Logo" className="w-2/3 h-auto" />
      </motion.div>

      {/* Right Side: Login Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-4 md:px-8 py-8 md:py-12">
        <motion.h1
          className="text-4xl font-bold mb-6 text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Login
        </motion.h1>

        {errorMessage && (
          <motion.div
            className="text-red-500 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {errorMessage}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-yellow-400 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300"
            disabled={loading}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? "Logging In..." : "Login"}
          </motion.button>
        </form>

        {/* Updated Sign Up Button */}
        <motion.div
          className="mt-4 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <p className="text-sm text-gray-600 mb-2">
            Don't have an account?
          </p>
          <MotionLink
            to="/signup"
            className="interactive bg-yellow-400 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-yellow-500 transition duration-300"
            whileHover={{ scale: 1.05 }}
          >
            Sign Up
          </MotionLink>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
