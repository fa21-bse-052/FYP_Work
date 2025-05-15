import React from "react";
import { motion } from "framer-motion";
import { FaPython, FaReact, FaJs, FaAws, FaDocker } from "react-icons/fa";
import { SiTensorflow, SiPytorch, SiLangchain, SiHuggingface, SiFastapi, SiFramer, SiKubernetes, SiPostgresql, SiMongodb, SiOpenai } from "react-icons/si";
import { TbBrandMeta, TbBrandNextjs } from "react-icons/tb";

const techStack = [
  { name: "Python", icon: <FaPython size={50} className="text-yellow-500" />, reverse: false },
  { name: "ReactJS", icon: <FaReact size={50} className="text-blue-500" />, reverse: true },
  { name: "JavaScript", icon: <FaJs size={50} className="text-yellow-400" />, reverse: false },
  { name: "Langchain", icon: <SiLangchain size={50} className="text-green-500" />, reverse: true },
  { name: "Hugging Face", icon: <SiHuggingface size={50} className="text-yellow-300" />, reverse: false },
  { name: "Meta Llama", icon: <TbBrandMeta size={50} className="text-blue-700" />, reverse: true },
  { name: "Framer Motion", icon: <SiFramer size={50} className="text-purple-500" />, reverse: false },
  { name: "FastAPI", icon: <SiFastapi size={50} className="text-green-400" />, reverse: true },
  { name: "Next.js", icon: <TbBrandNextjs size={50} className="text-black" />, reverse: false },
  { name: "AWS", icon: <FaAws size={50} className="text-orange-500" />, reverse: true },
  { name: "TensorFlow", icon: <SiTensorflow size={50} className="text-orange-400" />, reverse: false },
  { name: "PyTorch", icon: <SiPytorch size={50} className="text-red-500" />, reverse: true },
  { name: "Kubernetes", icon: <SiKubernetes size={50} className="text-blue-400" />, reverse: false },
  { name: "Docker", icon: <FaDocker size={50} className="text-blue-500" />, reverse: true },
  { name: "PostgreSQL", icon: <SiPostgresql size={50} className="text-blue-600" />, reverse: false },
  { name: "MongoDB", icon: <SiMongodb size={50} className="text-green-500" />, reverse: true },
  { name: "OpenAI", icon: <SiOpenai size={50} className="text-gray-600" />, reverse: false },
];

function About() {
  // Variants for overall page startup animation
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Variants for the profile card (including a hover effect)
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <>
      {/* Neon Border & Moving Dots Styles */}
      <style>{`
        .neon-border {
          border: 2px solid #facc15; /* yellow-400 */
          animation: neon 1.5s ease-in-out infinite alternate;
        }
        @keyframes neon {
          from {
            box-shadow: 0 0 5px #facc15, 0 0 10px #facc15;
          }
          to {
            box-shadow: 0 0 20px #facc15, 0 0 30px #facc15;
          }
        }
        @keyframes moveDot {
          0% { top: 0; left: 0; }
          25% { top: 0; left: calc(100% - 8px); }
          50% { top: calc(100% - 8px); left: calc(100% - 8px); }
          75% { top: calc(100% - 8px); left: 0; }
          100% { top: 0; left: 0; }
        }
      `}</style>

      <motion.div
        className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        {/* Relative container for Profile Card with Neon Border & Dots */}
        <div className="relative inline-block mb-8">
          <motion.div
            className="bg-white p-8 rounded-lg shadow-2xl text-center w-full max-w-md neon-border"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.img
              src="/me.jpg" // Replace with your actual image path
              alt="Momina Irfan"
              className="h-32 w-32 rounded-full mx-auto shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <h2 className="text-3xl font-bold mt-4">Momina Irfan</h2>
            <p className="text-gray-600 text-sm mt-2">
              BS-SE Student | AI & Web Developer
            </p>
            <p className="mt-4 text-gray-800 font-medium">
              3+ years of experience in AI & Web Development with a focus on
              creating engaging user experiences and robust, scalable solutions.
            </p>
          </motion.div>

          {/* Animated Moving Dots */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{ animation: "moveDot 4s linear infinite", animationDelay: "0s" }}
            ></div>
            <div
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{ animation: "moveDot 4s linear infinite", animationDelay: "1s" }}
            ></div>
            <div
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{ animation: "moveDot 4s linear infinite", animationDelay: "2s" }}
            ></div>
            <div
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{ animation: "moveDot 4s linear infinite", animationDelay: "3s" }}
            ></div>
          </div>
        </div>

        {/* Tech Stack Showcase with Alternating Animation Directions */}
        <div className="mt-10 overflow-hidden w-full max-w-5xl">
          {/* Forward Scrolling */}
          <motion.div
            className="flex space-x-12 items-center"
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            {techStack
              .filter((tech) => !tech.reverse)
              .map((tech, index) => (
                <div key={index} className="flex flex-col items-center">
                  {tech.icon}
                  <p className="text-sm font-medium mt-2">{tech.name}</p>
                </div>
              ))}
          </motion.div>

          {/* Reverse Scrolling */}
          <motion.div
            className="flex space-x-12 items-center mt-6"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            {techStack
              .filter((tech) => tech.reverse)
              .map((tech, index) => (
                <div key={index} className="flex flex-col items-center">
                  {tech.icon}
                  <p className="text-sm font-medium mt-2">{tech.name}</p>
                </div>
              ))}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

export default About;
