import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function CustomCursor() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Cursor variants for Framer Motion
  const cursorVariants = {
    default: {
      x: cursorPosition.x, // Directly follow the cursor
      y: cursorPosition.y,
      scale: 1,
      border: "2px solid #FFD700", // Yellow border
      backgroundColor: "transparent",
    },
    hover: {
      x: cursorPosition.x, // Directly follow the cursor
      y: cursorPosition.y,
      scale: 2, // Grows in size
      border: "2px solid #FFD700", // Yellow border
      backgroundColor: "transparent",
    },
  };

  // Set cursor variant when hovering over interactive elements
  useEffect(() => {
    const interactiveElements = document.querySelectorAll("a, button, [role='button'], .interactive");
    const handleMouseEnter = () => setCursorVariant("hover");
    const handleMouseLeave = () => setCursorVariant("default");

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  // Hide the default browser cursor
  useEffect(() => {
    document.body.style.cursor = "none";
  }, []);

  return (
    <motion.div
      className="custom-cursor"
      variants={cursorVariants}
      animate={cursorVariant}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "30px", // Default size
        height: "30px", // Default size
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-50%, -50%)", // Ensure the cursor stays centered
      }}
    />
  );
}

export default CustomCursor;
