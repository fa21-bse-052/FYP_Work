import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie"; // For handling cookies
import { motion } from "framer-motion";

// Create a motion-enhanced Link component
const MotionLink = motion(Link);

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await axios.post(
        "https://mominah-edulearnai.hf.space/auth/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // Optionally, store tokens here if desired.
        // Cookies.set("access_token", response.data.access_token);
        // Cookies.set("refresh_token", response.data.refresh_token);
        // Cookies.set("name", name);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAvatar(null);
        setErrorMessage("");

        navigate("/Login");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.detail || "Sign up failed.");
      } else {
        setErrorMessage("Network error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col lg:flex-row bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Left Side: Logo Section */}
      <motion.div
        className="hidden lg:flex flex-col justify-center items-center bg-white lg:w-1/2"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 50 }}
      >
        <img
          src="automation.gif"
          alt="Automation Logo"
          className="w-2/3 h-auto"
        />
      </motion.div>

      {/* Right Side: Sign Up Form */}
      <motion.div
        className="flex flex-col justify-center items-center w-full lg:w-1/2 px-4 md:px-8 py-8 md:py-12 bg-white"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
          Sign Up
        </h1>

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

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700"
            >
              Full Name
            </label>
            <motion.input
              type="text"
              id="name"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700"
            >
              Email Address
            </label>
            <motion.input
              type="email"
              id="email"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700"
            >
              Password
            </label>
            <motion.input
              type="password"
              id="password"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-lg font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <motion.input
              type="password"
              id="confirm-password"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Avatar File Input */}
          <div>
            <label
              htmlFor="avatar"
              className="block text-lg font-medium text-gray-700"
            >
              Upload Avatar (Optional)
            </label>
            <motion.input
              type="file"
              id="avatar"
              accept="image/*"
              className="mt-2 w-full"
              onChange={handleAvatarChange}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-yellow-300 transition duration-300"
            disabled={loading}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </motion.button>
        </form>

        {/* Updated Login Button */}
        <motion.div
          className="mt-4 flex items-center justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm text-gray-600">
            Already have an account?
          </span>
          <MotionLink
            to="/Login"
            className="interactive bg-yellow-400 text-white font-semibold py-2 px-6 rounded-full shadow-md"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Login
          </MotionLink>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default SignUp;
