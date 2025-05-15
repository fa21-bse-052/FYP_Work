// src/pages/Dashboard/UniversityDashboard.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Container animation variants.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Card animation variants.
const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

// Button animation variants.
const buttonVariants = {
  hover: { scale: 1.1, backgroundColor: "#facc15" },
  tap: { scale: 0.95 },
};

const UniversityDashboard = () => {
  const navigate = useNavigate();

  // Data for the university chatbot card.
  const card = {
    id: 1,
    heading: "University Chatbot",
    title: "Ask Your Questions",
    image: "uni.jpg", // Replace with your actual image path.
    description:
      "Have questions about university fees, teacher programs, or other campus-related topics? Our chatbot is here to provide you with quick and accurate answers.",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">
      <motion.div
        className="max-w-sm w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          key={card.id}
          className="bg-white text-black border border-yellow-400 rounded-lg shadow-lg p-6 flex flex-col space-y-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
        >
          {/* Card Image */}
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-32 md:h-40 object-cover rounded"
          />

          {/* Card Heading */}
          <h4 className="text-sm text-gray-500">{card.heading}</h4>

          {/* Card Title */}
          <h3 className="text-xl font-bold">{card.title}</h3>

          {/* Card Description */}
          <p>{card.description}</p>

          {/* Chat Button */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() =>
              navigate("/unibot", {
                state: { chatbotType: "University", task: card.title },
              })
            }
            className="bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-500 transition duration-300"
          >
            Chat
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UniversityDashboard;
