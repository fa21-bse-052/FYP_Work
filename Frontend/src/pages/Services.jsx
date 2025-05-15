import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Services() {
  const [activeModule, setActiveModule] = useState(null);
  const navigate = useNavigate();

  const modules = [
    {
      id: "student",
      step: "01.",
      title: "Student Module",
      description: [
        "The Student Module is designed to enhance learning through AI-powered tools. Students can generate quizzes, access personalized study plans, and receive instant feedback on assignments.",
        "Our AI model adapts to individual learning styles, ensuring a customized experience for each student. With 24/7 support, students can clarify doubts, get explanations, and improve their knowledge retention.",
        "This module also integrates with various educational platforms, allowing students to upload assignments and receive AI-generated feedback instantly."
      ],
      extraInfo: [
        { title: "AI-driven Learning Support", text: "Get customized study plans, interactive quizzes, and intelligent recommendations based on your progress." },
        { title: "Instant Assignment Evaluation", text: "Upload assignments and receive instant AI-generated feedback, helping you improve in real time." },
        { title: "24/7 Virtual Assistance", text: "Never get stuck—our chatbot is always available to answer queries and explain difficult concepts." }
      ],
      deliverables: [
        "Personalized study recommendations",
        "AI-generated quizzes & mock tests",
        "Real-time feedback on assignments",
        "Integration with learning platforms"
      ],
      image: "student.jpg",
      alignRight: false,
    },
    {
      id: "teacher",
      step: "02.",
      title: "Teacher Module",
      description: [
        "The Teacher Module empowers educators with AI-driven tools to automate tasks such as grading, lesson planning, and performance tracking.",
        "Teachers can use the chatbot to create structured lesson plans in minutes, ensuring efficiency and consistency. The module also offers real-time analytics, helping teachers identify students who need extra attention.",
        "AI-powered grading reduces workload by automatically assessing student submissions, while also providing valuable insights into learning trends."
      ],
      extraInfo: [
        { title: "Smart Lesson Planning", text: "Create structured lesson plans in minutes with AI-generated content suggestions." },
        { title: "Automated Grading System", text: "Save time by allowing AI to assess assignments and provide insightful analytics on student performance." },
        { title: "Performance Insights", text: "Identify struggling students and adapt teaching methods based on AI-driven analysis." }
      ],
      deliverables: [
        "AI-powered lesson planning",
        "Automated grading and analytics",
        "Student progress tracking",
        "Customized content recommendations"
      ],
      image: "teacher.jpg",
      alignRight: true,
    },
    {
      id: "university",
      step: "03.",
      title: "University Module",
      description: [
        "The University Module enhances institutional efficiency by automating administrative processes and student interactions.",
        "AI chatbots handle admission inquiries, student queries, and campus-related concerns, freeing up human resources for more critical tasks.",
        "This module also offers AI-powered data analytics, helping universities make data-driven decisions to improve student engagement and resource allocation."
      ],
      extraInfo: [
        { title: "AI-powered Admissions", text: "Automate the admission process with intelligent application tracking and instant query resolution." },
        { title: "Efficient Student Support", text: "Reduce response times and provide 24/7 assistance through AI chatbots integrated with university systems." },
        { title: "Campus Resource Optimization", text: "Use AI analytics to optimize scheduling, resource allocation, and student engagement strategies." }
      ],
      deliverables: [
        "Automated admission process",
        "24/7 AI-powered student support",
        "Data-driven decision making",
        "Seamless integration with university systems"
      ],
      image: "university.jpg",
      alignRight: false,
    },
  ];

  const handleModuleClick = (id) => {
    setActiveModule(activeModule === id ? null : id);
  };

  return (
    <motion.main
      className="bg-white min-h-screen flex flex-col items-center px-4 md:px-8 py-8 md:py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header Section */}
      <section className="flex flex-col lg:flex-row items-center text-center lg:text-left mb-8 md:mb-12 w-full">
        <motion.div
          className="lg:w-1/2 flex flex-col items-center lg:items-start mb-6 lg:mb-0"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-4xl md:text-8xl font-bold text-black mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Revolutionizing Education <br />
            with <span className="text-yellow-400">EduLearn AI</span>
          </motion.h1>
          <motion.p
            className="text-gray-700 text-base md:text-lg mt-4 mb-6 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Our AI-powered solutions support students, teachers, and universities, providing tools to streamline educational processes and enhance learning experiences.
          </motion.p>
        </motion.div>
        <motion.div
          className="lg:w-1/2 mb-10 md:mb-80 flex justify-center lg:justify-end"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src="automation.gif"
            alt="Education"
            className="w-3/4 md:w-1/2 h-auto rounded-lg shadow-lg"
          />
        </motion.div>
      </section>

      {/* Modules Section */}
      <motion.div className="mt-8 md:mt-16 w-full">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-center mb-6 md:mb-10 text-gray-800"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          Our Modules
        </motion.h2>
        <div className="flex flex-col items-center w-full">
          {modules.map((module) => (
            <motion.div
              key={module.id}
              className="w-full p-4 md:p-6 rounded-lg shadow-md mb-4 md:mb-6 cursor-pointer"
              onClick={() => handleModuleClick(module.id)}
              whileHover={{ scale: 1.05 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-start">
                <span className="text-4xl md:text-6xl font-extrabold text-black mr-2 md:mr-4">
                  {module.step}
                </span>
                <motion.h3
                  className={`font-semibold text-gray-900 ${
                    activeModule === module.id ? "text-4xl md:text-6xl" : "text-2xl md:text-4xl"
                  }`}
                >
                  {module.title}
                </motion.h3>
              </div>
              <AnimatePresence>
                {activeModule === module.id && (
                  <motion.div
                    className="mt-4 flex flex-col md:flex-row items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className={`md:w-1/2 ${module.alignRight ? "order-last" : ""}`}>
                      {module.description.map((para, index) => (
                        <p key={index} className="text-base md:text-lg text-gray-700 leading-relaxed mb-2">
                          {para}
                        </p>
                      ))}
                      {module.extraInfo.map((info, index) => (
                        <div key={index} className="mb-2">
                          <h5 className="text-xl md:text-2xl font-semibold text-gray-900">{info.title}</h5>
                          <p className="text-base md:text-lg text-gray-700">{info.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="md:w-1/2 flex flex-col items-center mt-4 md:mt-0">
                      <motion.img
                        src={module.image}
                        alt={module.title}
                        className="w-40 h-40 md:w-64 md:h-64 object-cover rounded-lg shadow-lg"
                        whileHover={{ scale: 1.1 }}
                      />
                      <h5 className="text-xl md:text-2xl font-semibold text-gray-900 mt-4">
                        Deliverables:
                      </h5>
                      <ul className="list-disc list-inside text-gray-700 text-base md:text-lg">
                        {module.deliverables.map((deliverable, index) => (
                          <li key={index} className="mb-1">
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                      <motion.button
                        className="mt-4 bg-yellow-400 text-black py-2 px-4 md:py-3 md:px-6 rounded hover:bg-yellow-300 transition"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/chatbot");
                        }}
                      >
                        Chat with Us
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.main>
  );
}

export default Services;
