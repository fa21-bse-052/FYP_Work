import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Custom hook to detect mobile view
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

// Animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3, duration: 0.8 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};
const circleVariants = {
  animate: {
    x: [0, 30, -30, 0],
    y: [0, -20, 20, 0],
    scale: [1, 1.1, 1],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};
const buttonVariants = {
  idle: { scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" } },
  clicked: { scale: [1, 0.9, 1.1, 1], transition: { duration: 0.4 } },
};

const CONTACT_URL = "https://mominah-edulearnai.hf.space/contact/";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    message:   "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus]       = useState("");
  const isMobile                   = useIsMobile();

  // Update form data as user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    // map camelCase state to snake_case payload
    const payload = {
      first_name: formData.firstName,
      last_name:  formData.lastName,
      email:      formData.email,
      message:    formData.message,
    };

    try {
      const res = await fetch(CONTACT_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("Your message has been sent successfully!");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        // read and log the server's error details
        const errData = await res.json().catch(() => null);
        console.warn("Contact API error:", errData);
        setStatus("There was a problem sending your message. (See console for details.)");
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setStatus("Error: Unable to send your message at this time.");
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <style>{`
        .glow-border {
          border: 2px solid #facc15;
          box-shadow: 0 0 15px 5px rgba(250, 204, 21, 0.7);
        }
        @keyframes moveDot {
          0%   { top: 0; left: 0; }
          25%  { top: 0; left: calc(100% - 8px); }
          50%  { top: calc(100% - 8px); left: calc(100% - 8px); }
          75%  { top: calc(100% - 8px); left: 0; }
          100% { top: 0; left: 0; }
        }
      `}</style>

      <motion.div
        className="min-h-screen flex flex-col md:flex-row bg-white"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        {/* Animated circles on desktop */}
        {!isMobile && (
          <div className="md:w-1/2 flex items-center justify-center p-8 bg-white">
            <div className="space-y-8">
              {[32, 24, 16].map((size) => (
                <motion.div
                  key={size}
                  className={`w-${size} h-${size} bg-yellow-400 rounded-full`}
                  variants={circleVariants}
                  animate="animate"
                />
              ))}
            </div>
          </div>
        )}

        {/* Contact form */}
        <div className="md:w-1/2 flex items-center justify-center p-8">
          <div className="relative w-full max-w-md">
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-lg shadow-xl w-full glow-border"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                className="text-3xl font-bold text-black mb-6 text-center"
                variants={itemVariants}
              >
                Contact Us
              </motion.h1>

              {["firstName","lastName","email"].map((field) => (
                <motion.div key={field} className="mb-4" variants={itemVariants}>
                  <label htmlFor={field} className="block text-black font-semibold mb-1">
                    {field === "email" ? "Email" : field === "firstName" ? "First Name" : "Last Name"}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter your ${field === "email" ? "email" : field.replace(/([A-Z])/g, " $1").toLowerCase().trim()}`}
                    className="w-full px-4 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                    required
                  />
                </motion.div>
              ))}

              <motion.div className="mb-4" variants={itemVariants}>
                <label htmlFor="message" className="block text-black font-semibold mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  className="w-full px-4 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                  required
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-400 text-white py-2 rounded hover:bg-yellow-500 transition-colors"
                variants={buttonVariants}
                initial="idle"
                whileHover="idle"
                whileTap="clicked"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </motion.button>

              {status && (
                <motion.p
                  className="mt-4 text-center text-yellow-400 font-semibold"
                  variants={itemVariants}
                >
                  {status}
                </motion.p>
              )}
            </motion.form>

            {/* Moving dots */}
            <div className="absolute inset-0 pointer-events-none">
              {[0,1,2,3].map((i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{ animation: "moveDot 4s linear infinite", animationDelay: `${i}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
