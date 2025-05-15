import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  // Animation variants for the section
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between child animations
        delayChildren: 0.5, // Delay before stagger starts
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Animation Variants for Transform
  const sectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const listItemVariants = {
    hidden: { scale: 0.8, rotate: -5 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Card Variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  // List Item Variants
  const listVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  const hoverEffect = {
    whileHover: { scale: 1.05, color: "#4F46E5", transition: { duration: 0.3 } },
  };

  return (
    <div className="w-full bg-white text-black">
      {/* First Section: Animated Website Name and Logo */}
      <motion.div
        className="flex flex-col items-center justify-center bg-white py-8 md:py-16 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-black"
          variants={childVariants}
        >
          EduLearn AI
        </motion.h1>
        <motion.img
          src="download.gif"
          alt="Logo Animation"
          className="h-32 w-32 md:h-auto md:w-auto object-contain mt-6 md:mt-10"
          variants={childVariants}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 200 }}
        />
      </motion.div>

      {/* Second Section: Overview and Services */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start p-8 md:p-16 mt-8 md:mt-20 mr-4 md:mr-30"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side: Overview */}
        <motion.div className="w-full md:w-1/3" variants={textVariants}>
          <p className="text-sm font-bold ml-4 md:ml-40">Overview</p>
        </motion.div>

        {/* Right Side: Description and Services */}
        <motion.div className="w-full md:w-2/3 pl-4 md:pl-16" variants={textVariants}>
          <p className="text-2xl md:text-4xl font-extrabold mr-4 md:mr-40">
            EduLearn AI is an AI-powered educational platform designed to enhance the learning experience.
          </p>
          <p className="text-xl md:text-2xl font-semibold mt-4 md:mt-6 mr-4 md:mr-40">Services</p>
          <motion.ul className="list-disc text-lg pl-6 mt-4 mr-4 md:mr-40">
            {[
              "Automated grading system for quizzes and assignments",
              "Personalized learning paths",
              "Real-time progress tracking",
              "Instant access to learning materials",
              "Seamless system integration",
            ].map((item, index) => (
              <motion.li
                key={index}
                className="mb-2"
                variants={listItemVariants}
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>

      {/* Third Section: In Detail */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start p-8 md:p-16 mt-8 md:mt-20 mr-4 md:mr-30"
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Left Side: In Detail Title */}
        <motion.div className="w-full md:w-1/3" layout>
          <p className="text-sm font-bold ml-4 md:ml-40">In Detail</p>
        </motion.div>

        {/* Right Side: Detailed Description */}
        <motion.div className="w-full md:w-2/3 pl-4 md:pl-16" layout>
          {/* Task Section */}
          <motion.h3 className="text-xl md:text-2xl font-extrabold mr-4 md:mr-40" layout>
            Task
          </motion.h3>
          <motion.p className="text-base md:text-lg mt-4 mr-4 md:mr-40" layout>
            We aimed to create an innovative educational platform that seamlessly bridges the gap between traditional teaching methods and modern technology. The challenge was to deliver a solution that would cater to both teachers and students, ensuring usability, engagement, and accessibility.
          </motion.p>

          {/* Solutions Section */}
          <motion.h3 className="text-xl md:text-2xl font-extrabold mt-4 md:mt-8 mr-4 md:mr-40" layout>
            Solutions
          </motion.h3>
          <motion.p className="text-base md:text-lg mt-4 mr-4 md:mr-40" layout>
            After conducting extensive research on the needs and pain points of educators and learners, we identified the following key challenges and addressed them with targeted solutions:
          </motion.p>

          {/* For Students */}
          <motion.h4 className="text-lg md:text-xl font-semibold mt-4 md:mt-6 mr-4 md:mr-40" layout>
            For Students
          </motion.h4>
          <motion.ul className="list-disc text-base md:text-lg pl-6 mt-4 mr-4 md:mr-40" layout>
            <li>Interactive Quizzes and Assignments: Gamified assessments designed to make learning fun and competitive.</li>
            <li>Personalized Study Plans: Adaptive learning paths tailored to individual strengths and weaknesses.</li>
            <li>Motivational Tools: Regular quotes and challenges to keep students inspired.</li>
            <li>Skill Development: Access to skill-building modules beyond traditional curriculum topics.</li>
          </motion.ul>

          {/* For Teachers */}
          <motion.h4 className="text-lg md:text-xl font-semibold mt-4 md:mt-6 mr-4 md:mr-40" layout>
            For Teachers
          </motion.h4>
          <motion.ul className="list-disc text-base md:text-lg pl-6 mt-4 mr-4 md:mr-40" layout>
            <li>Comprehensive Dashboard: A user-friendly interface with summary analytics, class schedules, and grading tools.</li>
            <li>Effortless Content Creation: Tools to design and manage quizzes, assignments, and lesson plans.</li>
            <li>Feedback and Communication: Features to provide personalized feedback, interact with students, and track their progress.</li>
          </motion.ul>

          {/* For Universities */}
          <motion.h4 className="text-lg md:text-xl font-semibold mt-4 md:mt-6 mr-4 md:mr-40" layout>
            For Universities
          </motion.h4>
          <motion.ul className="list-disc text-base md:text-lg pl-6 mt-4 mr-4 md:mr-40" layout>
            <li>Centralized Administrative Assistance: Automated solutions for handling university-related queries and policies.</li>
            <li>Campus Services Access: Easy navigation of campus services and resources.</li>
            <li>Policy Guidance and Notifications: Proactive updates on important guidelines and announcements.</li>
          </motion.ul>
        </motion.div>
      </motion.div>

      {/* Feature Section */}
      <div className="bg-white text-black py-8 md:py-16 mt-8 md:mt-20">
        <motion.div
          className="bg-white text-black py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Left Side: Features Title */}
          <motion.div className="w-full md:w-1/3" variants={textVariants}>
            <p className="text-sm font-bold ml-4 md:ml-40 mb-4 md:mb-40">Features</p>
          </motion.div>

          <div className="overflow-hidden w-full">
            <motion.div
              className="flex space-x-8"
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{
                repeat: Infinity,
                duration: 25,
                ease: "linear",
              }}
              style={{ display: "flex", width: "max-content" }}
            >
              {[
                {
                  title: "Interactive Learning",
                  description: [
                    "AI-powered quizzes & assessments",
                    "Adaptive assignments for personalized learning",
                    "Real-time progress tracking & feedback",
                  ],
                },
                {
                  title: "Personalized Education",
                  description: [
                    "Customized learning paths for students",
                    "AI-driven recommendations based on performance",
                    "Smart insights for teachers & students",
                  ],
                },
                {
                  title: "Seamless Integration",
                  description: [
                    "Compatible with Google Classroom & Moodle",
                    "Easy integration with existing LMS",
                    "Supports multiple file formats & APIs",
                  ],
                },
                {
                  title: "Real-time Feedback",
                  description: [
                    "Instant grading with AI automation",
                    "Detailed performance analytics",
                    "Smart suggestions for improvement",
                  ],
                },
                {
                  title: "Collaboration Tools",
                  description: [
                    "Live chat & screen-sharing features",
                    "Virtual whiteboard for brainstorming",
                    "Group discussions & team projects",
                  ],
                },
                {
                  title: "Mobile-Friendly",
                  description: [
                    "Access anytime, anywhere",
                    "Optimized for desktops, tablets, & smartphones",
                    "Offline mode for uninterrupted learning",
                  ],
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card p-6 bg-white rounded-lg shadow-lg text-left flex flex-col justify-center"
                  whileHover={{ scale: 1.05 }}
                  style={{ minWidth: "220px", minHeight: "320px" }}
                >
                  <h4 className="text-2xl text-black font-semibold mb-4">{feature.title}</h4>
                  <ul className="text-lg list-disc pl-5">
                    {feature.description.map((point, i) => (
                      <li key={i} className="mb-2">
                        {point} <br />
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Results Section */}
      <motion.div
        className="bg-white text-black py-8 md:py-16 px-4 md:px-10 mt-8 md:mt-20 mr-4 md:mr-30 rounded-xl shadow-lg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row justify-between items-start p-8 md:p-16 mt-8 md:mt-20 mr-4 md:mr-30">
          {/* Left Side: Results Title */}
          <motion.div className="w-full md:w-1/3" variants={textVariants}>
            <p className="text-sm font-bold ml-4 md:ml-40">Results</p>
          </motion.div>

          {/* Right Side: Description */}
          <div className="w-full md:w-2/3 pl-4 md:pl-6">
            <motion.p className="text-2xl md:text-5xl font-extrabold mb-4 md:mb-6 text-gray-900" variants={textVariants}>
              EduLearn AI brings impactful results to the education sector.
            </motion.p>
            <motion.p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6" variants={textVariants}>
              Online learning can now be more entertaining and convenient, thanks to EduLearn AI. Working on this project gave us a lot of interesting insights into online education. Some of them are:
            </motion.p>

            <motion.ul className="space-y-4 text-base md:text-lg text-gray-800 pl-8 list-none" variants={containerVariants}>
              <motion.li className="relative pl-6 flex items-center space-x-3" variants={listVariants} {...hoverEffect}>
                <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                <p>91% of students worldwide were impacted by temporary school closures during COVID-19.</p>
              </motion.li>
              <motion.li className="relative pl-6 flex items-center space-x-3" variants={listVariants} {...hoverEffect}>
                <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                <p>60% of students found online learning boring and struggled with motivation.</p>
              </motion.li>
              <motion.li className="relative pl-6 flex items-center space-x-3" variants={listVariants} {...hoverEffect}>
                <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                <p>80% of users prefer educational apps for digital learning support.</p>
              </motion.li>
            </motion.ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
