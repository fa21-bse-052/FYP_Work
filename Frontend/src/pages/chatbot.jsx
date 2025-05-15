import React, { useState, useRef } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { FiSend, FiPaperclip } from 'react-icons/fi'

const backendBaseUrl = 'https://mominah-edulearnai.hf.space'

export default function ChatbotNoRag() {
  const [sessionId, setSessionId] = useState('')
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loadingSession, setLoadingSession] = useState(false)
  const [loadingAnswer, setLoadingAnswer] = useState(false)
  const [ocrProcessing, setOcrProcessing] = useState(false)
  const [error, setError] = useState('')

  const inputFieldRef = useRef(null)
  const ocrFileInputRef = useRef(null)

  // Create a new chat session
  const handleCreateSession = async () => {
    setLoadingSession(true)
    setError('')
    setMessages([])
    try {
      const res = await axios.post(`${backendBaseUrl}/norag/session`)
      const sid = res.data.session_id
      if (!sid) throw new Error('No session_id in response')
      setSessionId(sid)
    } catch (err) {
      setError(err.message || 'Failed to create session')
    } finally {
      setLoadingSession(false)
    }
  }

  // OCR upload to prefill input
  const handleOCRUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setOcrProcessing(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await axios.post(
        `${backendBaseUrl}/upload`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      const text = res.data.extracted_text || ''
      if (!text) throw new Error('No text extracted')
      setInputValue(text)
      inputFieldRef.current?.focus()
    } catch (err) {
      setError(err.message || 'OCR failed')
    } finally {
      e.target.value = ''
      setOcrProcessing(false)
    }
  }

  // Send user message and receive answer
  const handleSend = async () => {
    if (!sessionId) {
      setError('Please create a session first.')
      return
    }
    if (!inputValue.trim()) {
      setError('Please enter a message.')
      return
    }
    setLoadingAnswer(true)
    setError('')
    const userMsg = { sender: 'user', text: inputValue.trim(), timestamp: new Date().toLocaleTimeString() }
    setMessages(prev => [...prev, userMsg])

    try {
      const res = await axios.post(
        `${backendBaseUrl}/norag/chat`,
        { session_id: sessionId, question: inputValue.trim() },
        { headers: { 'Content-Type': 'application/json' } }
      )
      const ans = res.data.answer
      if (!ans) throw new Error('No answer in response')
      const botMsg = { sender: 'system', text: ans, timestamp: new Date().toLocaleTimeString() }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      setError(err.message || 'Failed to send message')
    } finally {
      setLoadingAnswer(false)
      setInputValue('')
      inputFieldRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <button
          onClick={handleCreateSession}
          disabled={loadingSession}
          className={`w-full py-2 px-4 font-bold rounded bg-blue-500 text-white ${loadingSession ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {loadingSession ? 'Creating…' : 'New Chat'}
        </button>

        {sessionId && (
          <div className="text-sm mt-4">
            <span className="font-medium">Session ID:</span> {sessionId}
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm mt-2">
            <strong>Error:</strong> {error}
          </div>
        )}
      </aside>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-white">
        {!sessionId ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-sm">Click "New Chat" to get started.</p>
          </div>
        ) : (
          <>  
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>  
                  <div className={`max-w-xs px-3 py-2 rounded ${m.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} text-sm`}>  
                    {m.sender === 'system' ? <ReactMarkdown>{m.text}</ReactMarkdown> : m.text}
                    <div className="text-xs text-gray-500 text-right mt-1">{m.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="border-t border-gray-300 p-2 flex items-center space-x-2">
              <button
                onClick={() => ocrFileInputRef.current.click()}
                disabled={ocrProcessing}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {ocrProcessing ? <span className="text-xs">Processing…</span> : <FiPaperclip size={20} />}
              </button>
              <input
                ref={inputFieldRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Type your message…"
              />
              <button onClick={handleSend} className="p-1 hover:bg-gray-200 rounded">
                <FiSend size={20} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={ocrFileInputRef}
        type="file"
        accept=".pdf,image/*"
        onChange={handleOCRUpload}
        hidden
      />
    </div>
  )
}
