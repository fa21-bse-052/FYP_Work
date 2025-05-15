import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import ReactMarkdown from "react-markdown";

const backendBaseUrl = "https://mominah-edulearnai.hf.space";

const ChatbotPage = () => {
  const navigate = useNavigate();
  // — Core chat states —
  const [botId, setBotId] = useState(Cookies.get("bot_id") || null);
  const [chatId, setChatId] = useState(Cookies.get("chat_id") || null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [chats, setChats] = useState([]);

  // — Loading states —
  const [kbUploading, setKbUploading] = useState(false);
  const [isCreatingBot, setIsCreatingBot] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);

  // — UI flow & toggles —
  const [currentStep, setCurrentStep] = useState("initializeBot");
  const [showPrevChats, setShowPrevChats] = useState(false);

  // — File input refs —
  const kbFileInputRef = useRef(null);
  const ocrFileInputRef = useRef(null);

  // — Text input ref (to focus after results) —
  const inputFieldRef = useRef(null);

  const access_token = Cookies.get("access_token");
  const location = useLocation();

  // — Determine prompt template —
  const determineTemplate = () => {
    if (location.state?.customPrompt) return location.state.customPrompt;
    if (location.state?.task) {
      const t = location.state.task.toLowerCase();
      if (t.includes("solve")) {
        if (t.includes("quiz")) return "quiz_solving";
        if (t.includes("assignment")) return "assignment_solving";
        if (t.includes("paper")) return "paper_solving";
      }
      if (t.includes("create")) {
        if (t.includes("quiz")) return "quiz_creation";
        if (t.includes("assignment")) return "assignment_creation";
        if (t.includes("paper")) return "paper_creation";
      }
    }
    return "quiz_solving";
  };

  // — Bot/Kb/Chat handlers —
  const handleCreateNewBot = () => {
    if (!access_token) return;
    setIsCreatingBot(true);
    axios
      .post(
        `${backendBaseUrl}/initialize_bot?prompt_type=${determineTemplate()}`,
        {},
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then((res) => {
        setBotId(res.data.bot_id);
        Cookies.set("bot_id", res.data.bot_id, { expires: 7, secure: true });
        setCurrentStep("addData");
      })
      .catch(console.error)
      .finally(() => setIsCreatingBot(false));
  };

  const handleKBUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setKbUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bot_id", botId || "");
    try {
      await axios.post(`${backendBaseUrl}/upload_document`, fd, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setCurrentStep("createNewChat");
    } catch (err) {
      console.error(err);
    } finally {
      e.target.value = "";
      setKbUploading(false);
    }
  };

  const handleNewChat = () => {
    if (!botId || !access_token) return;
    setIsStartingChat(true);
    axios
      .post(`${backendBaseUrl}/create_bot/${botId}`, {}, { headers: { Authorization: `Bearer ${access_token}` } })
      .then(() =>
        axios.post(`${backendBaseUrl}/new_chat/${botId}`, {}, { headers: { Authorization: `Bearer ${access_token}` } })
      )
      .then((res) => {
        setChatId(res.data.chat_id);
        Cookies.set("chat_id", res.data.chat_id, { expires: 7, secure: true });
        setMessages([]);
        setCurrentStep("chatScreen");
      })
      .catch(console.error)
      .finally(() => setIsStartingChat(false));
  };

  // navigate to Video RAG page
  const handleVideoRag = () => {
    navigate("/video-rag");
  };

  useEffect(() => {
    if (access_token && botId) {
      axios
        .get(`${backendBaseUrl}/list_chats/${botId}`, { headers: { Authorization: `Bearer ${access_token}` } })
        .then((res) => setChats(res.data.chat_ids || []))
        .catch(console.error);
    }
  }, [access_token, botId]);

  const loadChatMessages = (cid) => {
    axios
      .get(`${backendBaseUrl}/chat_history/${cid}?bot_id=${botId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setMessages(res.data);
        setChatId(cid);
        Cookies.set("chat_id", cid, { expires: 7, secure: true });
        setCurrentStep("chatScreen");
      })
      .catch(console.error);
  };

  // — OCR handler —
  const handleOCRUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOcrProcessing(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await axios.post(`${backendBaseUrl}/upload`, fd);
      setInputValue(res.data.extracted_text || "");
      inputFieldRef.current?.focus();
    } catch (err) {
      console.error("OCR error", err);
    } finally {
      e.target.value = "";
      setOcrProcessing(false);
    }
  };

  // — Chat send & streaming —
  const streamResponse = (fullText) => {
    const tokens = fullText.split(" ");
    let i = 0,
      cur = "";
    const id = setInterval(() => {
      cur += tokens[i] + " ";
      setMessages((prev) =>
        prev.map((m, idx) =>
          idx === prev.length - 1 && m.sender === "system" ? { ...m, text: cur.trim() } : m
        )
      );
      if (++i >= tokens.length) clearInterval(id);
    }, 100);
  };

  const handleSend = () => {
    if (!inputValue.trim() || !botId || !chatId) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length, text: inputValue, sender: "user", timestamp: new Date().toLocaleTimeString() },
      { id: prev.length + 1, text: "", sender: "system", timestamp: new Date().toLocaleTimeString() },
    ]);
    const q = inputValue;
    setInputValue("");
    axios
      .post(
        `${backendBaseUrl}/query`,
        { query: q, bot_id: botId, chat_id: chatId },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then((res) => streamResponse(res.data.response))
      .catch(console.error);
  };

  return (
    <div className="flex flex-col md:flex-row h-[675px]">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={handleCreateNewBot}
            disabled={isCreatingBot}
            className={`py-2 px-4 font-bold rounded bg-blue-500 text-white ${
              isCreatingBot ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {isCreatingBot ? "Creating…" : "New Bot"}
          </button>
          <button
            onClick={() => kbFileInputRef.current.click()}
            disabled={kbUploading}
            className={`py-2 px-4 font-bold rounded bg-yellow-400 text-gray-900 ${
              kbUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-500"
            }`}
          >
            {kbUploading ? "Uploading…" : "Add Data"}
          </button>
          <button
            onClick={handleNewChat}
            disabled={isStartingChat}
            className={`py-2 px-4 font-bold rounded bg-green-500 text-white ${
              isStartingChat ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
            }`}
          >
            {isStartingChat ? "Starting…" : "New Chat"}
          </button>
          <button
            onClick={handleVideoRag}
            className="py-2 px-4 font-bold rounded bg-purple-500 text-white hover:bg-purple-600"
          >
            Video RAG
          </button>
        </div>

        {currentStep !== "chatScreen" && (
          <p className="text-sm mb-4">Initialize → Add data → New chat</p>
        )}

        <h2 className="font-bold mb-2">Previous Chats</h2>
        <div className="hidden md:block">
          {chats.length ? (
            chats.map((c) => (
              <div
                key={c}
                onClick={() => loadChatMessages(c)}
                className="p-2 rounded hover:bg-gray-300 cursor-pointer mb-1 text-sm"
              >
                Chat: {c}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No chats</p>
          )}
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setShowPrevChats(!showPrevChats)}
            className="w-full bg-blue-500 text-white py-2 rounded mb-2 text-sm"
          >
            {showPrevChats ? "Hide Chats" : "Show Chats"}
          </button>
          {showPrevChats &&
            (chats.length ? (
              chats.map((c) => (
                <div
                  key={c}
                  onClick={() => loadChatMessages(c)}
                  className="p-2 rounded hover:bg-gray-300 cursor-pointer mb-1 text-sm"
                >
                  Chat: {c}
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-sm">No chats</p>
            ))}
        </div>
      </aside>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-white">
        {currentStep !== "chatScreen" ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-sm">Follow sidebar steps to get started.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex my-1 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-2 py-1 rounded ${
                      m.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                    } text-sm`}
                  >
                    {m.sender === "system" ? <ReactMarkdown>{m.text}</ReactMarkdown> : m.text}
                    <div className="text-xs text-gray-500 text-right">{m.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input bar */}
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
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Type your message"
              />
              <button onClick={handleSend} className="p-1 hover:bg-gray-200 rounded">
                <FiSend size={20} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={kbFileInputRef}
        type="file"
        accept=".csv,.doc,.docx,.epub,image/*,.md,.msg,.odt,.org,.pdf,.ppt,.pptx,.rtf,.rst,.tsv,.xlsx"
        onChange={handleKBUpload}
        hidden
      />
      <input
        ref={ocrFileInputRef}
        type="file"
        accept=".pdf,image/*"
        onChange={handleOCRUpload}
        hidden
      />
    </div>
  );
};

export default ChatbotPage;
