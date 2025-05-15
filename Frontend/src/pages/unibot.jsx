import React, { useState, useRef } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { FiSend, FiPaperclip } from 'react-icons/fi'

const backendBaseUrl = 'https://mominah-edulearnai.hf.space'

export default function UniBot() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loadingAnswer, setLoadingAnswer] = useState(false)
  const [ocrProcessing, setOcrProcessing] = useState(false)
  const [error, setError] = useState('')

  const inputFieldRef = useRef(null)
  const ocrFileInputRef = useRef(null)

  const handleNewChat = () => {
    setMessages([])
    setInputValue('')
    setError('')
    inputFieldRef.current?.focus()
  }

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

  const simulateStreaming = (fullText) => {
    const words = fullText.split(' ')
    let currentText = ''
    let index = 0

    const interval = setInterval(() => {
      if (index >= words.length) {
        clearInterval(interval)
        return
      }
      currentText += (index === 0 ? '' : ' ') + words[index]
      index++

      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          text: currentText,
          timestamp: new Date().toLocaleTimeString()
        }
        return updated
      })
    }, 80) // word delay (in ms)
  }

  const handleSend = async () => {
    const query = inputValue.trim()
    if (!query) {
      setError('Please enter a message.')
      return
    }

    setLoadingAnswer(true)
    setError('')
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: query, timestamp: new Date().toLocaleTimeString() }
    ])

    try {
      const res = await axios.post(
        `${backendBaseUrl}/llm/ask`,
        { query },
        { headers: { 'Content-Type': 'application/json' } }
      )

      console.log('/llm/ask response:', res.data)

      const ans =
        res.data.answer ??
        res.data.response ??
        res.data.data ??
        res.data.result ??
        ''

      if (!ans) {
        throw new Error(
          'No answer found. Response keys: ' + JSON.stringify(Object.keys(res.data))
        )
      }

      // Add empty system message first to start streaming
      setMessages(prev => [
        ...prev,
        { sender: 'system', text: '', timestamp: new Date().toLocaleTimeString() }
      ])

      simulateStreaming(ans)
    } catch (err) {
      console.error('handleSend error:', err)
      if (err.response?.data) {
        setError(
          typeof err.response.data === 'string'
            ? err.response.data
            : JSON.stringify(err.response.data)
        )
      } else {
        setError(err.message || 'Failed to send message')
      }
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
          onClick={handleNewChat}
          className="w-full py-2 px-4 font-bold rounded bg-green-500 text-white hover:bg-green-600"
        >
          New Chat
        </button>
        {error && (
          <div className="text-red-600 text-sm mt-2">
            <strong>Error:</strong> {error}
          </div>
        )}
      </aside>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-white">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-sm text-gray-600">
              Start your conversation by typing below.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded ${
                    m.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  } text-sm`}
                >
                  {m.sender === 'system' ? (
                    <ReactMarkdown>{m.text || (loadingAnswer ? '...' : '')}</ReactMarkdown>
                  ) : (
                    m.text
                  )}
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="border-t border-gray-300 p-2 flex items-center space-x-2">
          <button
            onClick={() => ocrFileInputRef.current.click()}
            disabled={ocrProcessing}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {ocrProcessing ? (
              <span className="text-xs">Processing…</span>
            ) : (
              <FiPaperclip size={20} />
            )}
          </button>
          <input
            ref={inputFieldRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Type your message…"
          />
          <button
            onClick={handleSend}
            disabled={loadingAnswer}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>

      {/* Hidden file input for OCR */}
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
