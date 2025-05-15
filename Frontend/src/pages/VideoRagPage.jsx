import React, { useState, useRef } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import ReactMarkdown from "react-markdown";

const backendBaseUrl = "https://mominah-edulearnai.hf.space";
const token = Cookies.get("access_token");

export default function VideoRagPage() {
  // URL input for transcription
  const [youtubeUrl, setYoutubeUrl] = useState("");
  // RAG session ID
  const [sessionId, setSessionId] = useState(null);
  // Chat messages
  const [messages, setMessages] = useState([]);
  // Loading states
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  // Chat‐input state
  const [inputValue, setInputValue] = useState("");

  // Refs
  const fileInputRef = useRef();      // for video-file upload
  const ocrFileInputRef = useRef();   // for OCR‐upload
  const inputFieldRef = useRef();     // for focusing the chat input

  // — Reset everything to start a new chat —
  const handleReset = () => {
    setYoutubeUrl("");
    setSessionId(null);
    setMessages([]);
    setInputValue("");
    setLoading(false);
    setUploading(false);
    setOcrProcessing(false);
  };

  // — 1) Transcribe via YouTube URL —
  const handleUrlSubmit = async () => {
    if (!youtubeUrl.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendBaseUrl}/transcribe_video`,
        { youtube_url: youtubeUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSessionId(data.session_id);
      setMessages([
        {
          id: 0,
          sender: "system",
          text: `🎬 Session started (ID: ${data.session_id}). Ask your first question below.`,
        },
      ]);
      setYoutubeUrl("");
    } catch (err) {
      console.error("URL submit error:", err.response?.data ?? err);
      alert(
        `Failed to transcribe URL (status ${err.response?.status}). ` +
          "Check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  // — 2) Transcribe via file upload —
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post(
        `${backendBaseUrl}/upload_video`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSessionId(data.session_id);
      setMessages([
        {
          id: 0,
          sender: "system",
          text: `📤 Session started (ID: ${data.session_id}). Ask your first question below.`,
        },
      ]);
    } catch (err) {
      console.error("Upload error:", err.response?.data ?? err);
      alert(
        `Failed to upload video (status ${err.response?.status}). ` +
          "Check console for details."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // — 3) OCR handler (PDF / image → extracted text into chat input) —
  const handleOCRUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOcrProcessing(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await axios.post(`${backendBaseUrl}/upload`, fd);
      setInputValue(res.data.extracted_text || "");
      inputFieldRef.current?.focus();
    } catch (err) {
      console.error("OCR error:", err);
    } finally {
      setOcrProcessing(false);
      e.target.value = "";
    }
  };

  // — Helper: stream a system answer word-by-word —
  const streamAnswer = (fullText, messageId) => {
    let idx = 0;
    const words = fullText.split(/(\s+)/); // keep spaces
    const interval = setInterval(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, text: m.text + words[idx] }
            : m
        )
      );
      idx++;
      if (idx >= words.length) clearInterval(interval);
    }, 30);
  };

  // — 4) Send a user query & stream the RAG response —
  const handleSend = async () => {
    const question = inputValue.trim();
    if (!question || !sessionId) return;

    // add user message
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length,
        sender: "user",
        text: question,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    // add empty system stub
    const sysId = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { id: sysId, sender: "system", text: "", timestamp: new Date().toLocaleTimeString() },
    ]);

    setInputValue("");
    try {
      const { data } = await axios.post(
        `${backendBaseUrl}/vid_query`,
        { session_id: sessionId, query: question },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      streamAnswer(data.answer || "I don't know.", sysId);
    } catch (err) {
      console.error("Query error:", err.response?.data ?? err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === sysId
            ? { ...m, text: "⚠️ Failed to fetch answer." }
            : m
        )
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[675px]">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-gray-100 p-4 space-y-4">
        <button
          onClick={handleReset}
          className="w-full py-2 font-bold rounded bg-red-500 text-white hover:bg-red-600"
        >
          New Chat
        </button>
        <div>
          <h2 className="font-bold text-lg mb-2">YouTube Video RAG</h2>
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Enter YouTube URL"
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-2"
          />
          <button
            onClick={handleUrlSubmit}
            disabled={loading}
            className={`w-full py-2 font-bold rounded bg-purple-500 text-white ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-600"
            }`}
          >
            {loading ? "Processing…" : "Transcribe URL"}
          </button>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-2">Or Upload a Video</h2>
          <input
            type="file"
            accept="video/*"
            ref={fileInputRef}
            onChange={handleVideoUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className={`w-full py-2 font-bold rounded bg-green-500 text-white ${
              uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
            }`}
          >
            {uploading ? "Uploading…" : "Upload & Transcribe"}
          </button>
        </div>
      </aside>

      {/* Chat window */}
      <div className="flex-1 flex flex-col bg-white">
        {/* message list */}
        <div className="flex-1 overflow-y-auto p-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex my-1 ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-2 py-1 rounded ${
                  m.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                } text-sm`}
              >
                {m.sender === "system" ? (
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                ) : (
                  m.text
                )}
                <div className="text-xs text-gray-500 text-right">
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar w/ OCR icon */}
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
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={!sessionId}
            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder={
              sessionId
                ? "Ask a question about the video"
                : "Transcribe a video first"
            }
          />
          <button
            onClick={handleSend}
            disabled={!sessionId || !inputValue.trim()}
            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>

      {/* Hidden OCR file input */}
      <input
        ref={ocrFileInputRef}
        type="file"
        accept="application/pdf,image/*"
        onChange={handleOCRUpload}
        hidden
      />
    </div>
  );
}
