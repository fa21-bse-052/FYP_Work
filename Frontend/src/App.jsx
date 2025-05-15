// src/App.jsx
import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'

import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Services from './pages/Services'
import ReviewsPage from './pages/ReviewsPage'
import ProfileManagement from './pages/ProfileManagement'

import StudentDashboard from './pages/Dashboard/StudentDashboard'
import TeacherDashboard from './pages/Dashboard/TeacherDashboard'
import UniversityDashboard from './pages/Dashboard/UniversityDashboard'

import ChatbotWithRag from './pages/ChatbotPage'
import ChatbotWithoutRag from './pages/chatbot'
import VideoRagPage from './pages/VideoRagPage'

// grading page
import Check from './pages/check'

// new UniBot page
import UniBot from './pages/unibot'

import NotFound from './pages/NotFound'

function App() {
  const location = useLocation()

  // paths where we do NOT show the footer
  const hideFooterPaths = [
    '/chatbot-with-rag',
    '/chatbot-without-rag',
    '/video-rag',
    '/check',
    '/unibot',
  ]
  const showFooter = !hideFooterPaths.includes(location.pathname)

  return (
    <>
      <CustomCursor />
      <Navbar />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/services" element={<Services />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/profile" element={<ProfileManagement />} />

        {/* Dashboards */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/university-dashboard" element={<UniversityDashboard />} />

        {/* Chatbot & Video-RAG */}
        <Route path="/chatbot-with-rag" element={<ChatbotWithRag />} />
        <Route path="/chatbot-without-rag" element={<ChatbotWithoutRag />} />
        <Route path="/video-rag" element={<VideoRagPage />} />

        {/* Grading page */}
        <Route path="/check" element={<Check />} />

        {/* New UniBot page */}
        <Route path="/unibot" element={<UniBot />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {showFooter && <Footer />}
    </>
  )
}

export default App
