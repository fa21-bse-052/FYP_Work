import React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
}

const buttonVariants = {
  hover: { scale: 1.1, backgroundColor: "#facc15" },
  tap: { scale: 0.95 },
}

// Create cards
const createCardsWithRag = [
  {
    id: 1,
    heading: "Teacher Create - With Document",
    title: "Create Quiz",
    image: "quiz.jpg",
    description:
      "This tool uses a provided document to help you design detailed quiz questions. It ensures your quiz content is accurate and well-referenced.",
  },
  {
    id: 2,
    heading: "Teacher Create - With Document",
    title: "Create Assignment",
    image: "assignment.jpg",
    description:
      "Create assignments by leveraging a document as a reference, helping you generate comprehensive questions and instructions.",
  },
  {
    id: 3,
    heading: "Teacher Create - With Document",
    title: "Create Paper",
    image: "exam.jpg",
    description:
      "Generate paper content using key reference documents. This feature is ideal for creating research-based assessments or exam papers.",
  },
]

const createCardsWithoutRag = [
  {
    id: 4,
    heading: "Teacher Create - Without Document",
    title: "Create Quiz",
    image: "quiz.jpg",
    description:
      "Quickly create quiz questions based on the chatbot's built-in knowledge without uploading a document. Ideal for rapid quiz generation.",
  },
  {
    id: 5,
    heading: "Teacher Create - Without Document",
    title: "Create Assignment",
    image: "assignment.jpg",
    description:
      "Generate assignments using the chatbot's internal knowledge base, perfect for general assignments without needing reference materials.",
  },
  {
    id: 6,
    heading: "Teacher Create - Without Document",
    title: "Create Paper",
    image: "exam.jpg",
    description:
      "Draft research papers or exam prompts quickly using the built-in model, without the requirement of supplied documents.",
  },
]

// Check cards
const checkCardsWithRag = [
  {
    id: 7,
    heading: "Teacher Check - With Document",
    title: "Check Quiz",
    image: "quiz.jpg",
    description:
      "Review quizzes using the provided document as a benchmark. This helps ensure consistency and correctness in your quiz assessments.",
  },
  {
    id: 8,
    heading: "Teacher Check - With Document",
    title: "Check Assignment",
    image: "assignment.jpg",
    description:
      "Verify assignment content against reference materials. This mode helps you ensure that assignments are well-founded and accurate.",
  },
  {
    id: 9,
    heading: "Teacher Check - With Document",
    title: "Check Paper",
    image: "exam.jpg",
    description:
      "Evaluate paper submissions by comparing them with key documents. It’s ideal for in-depth review and ensuring the quality of academic content.",
  },
]

const checkCardsWithoutRag = [
  {
    id: 10,
    heading: "Teacher Check - Without Document",
    title: "Check Quiz",
    image: "quiz.jpg",
    description:
      "Quickly review quiz content without the need for external references. This mode is great for fast assessments and immediate feedback.",
  },
  {
    id: 11,
    heading: "Teacher Check - Without Document",
    title: "Check Assignment",
    image: "assignment.jpg",
    description:
      "Efficiently review assignments using your expertise and built-in guidelines. Perfect for rapid evaluations when documents aren’t provided.",
  },
  {
    id: 12,
    heading: "Teacher Check - Without Document",
    title: "Check Paper",
    image: "exam.jpg",
    description:
      "Assess paper content quickly without external documentation. Use this mode for preliminary reviews and fast quality checks.",
  },
]

const TeacherDashboard = () => {
  const navigate = useNavigate()

  const renderCard = (card, withRag) => {
    const isCheckCard = card.heading.startsWith("Teacher Check")
    const buttonLabel = isCheckCard ? "Check" : "Create"

    const handleClick = () => {
      if (isCheckCard && withRag) {
        // Navigate to the /check page when it's a "With Document" check card
        navigate("/check", {
          state: { task: card.title, mode: "with-document" },
        })
      } else {
        // Fallback to existing chatbot routes
        navigate(
          withRag ? "/chatbot-with-rag" : "/chatbot-without-rag",
          { state: { chatbotType: "Teacher", task: card.title } }
        )
      }
    }

    return (
      <motion.div
        key={card.id}
        className="bg-white text-black border border-yellow-400 rounded-lg shadow-lg p-6 flex flex-col space-y-4"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      >
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-32 object-cover rounded"
        />
        <h4 className="text-sm text-gray-500">{card.heading}</h4>
        <h3 className="text-xl font-bold">{card.title}</h3>
        <p>{card.description}</p>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleClick}
          className="bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-300 transition duration-300"
        >
          {buttonLabel}
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Teacher Dashboard
      </h1>

      {/* Create Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Create Content</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {createCardsWithRag.map((card) => renderCard(card, true))}
          {createCardsWithoutRag.map((card) => renderCard(card, false))}
        </motion.div>
      </section>

      {/* Check Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Check Content</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {checkCardsWithRag.map((card) => renderCard(card, true))}
          {checkCardsWithoutRag.map((card) => renderCard(card, false))}
        </motion.div>
      </section>
    </div>
  )
}

export default TeacherDashboard
