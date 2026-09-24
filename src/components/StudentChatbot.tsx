"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, User, BrainCircuit } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function StudentChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am your Aether Academic Coach. I have safe access to your academic profile. Ask me about your performance, attendance rates, weak areas, or study actions.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    "How is my attendance?",
    "Am I at risk?",
    "What are my weak areas?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    setLoading(true);
    setInput("");

    try {
      const res = await fetch("/api/student/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "Sorry, I had trouble answering that." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-slate-200 p-6 flex flex-col h-[460px] justify-between relative overflow-hidden shadow-xs">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-xl bg-[#FCEEF0] flex items-center justify-center border border-[#6E1E27]/20">
            <BrainCircuit className="h-4 w-4 text-[#6E1E27]" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 flex items-center space-x-1.5 uppercase tracking-wide">
              <span>AI Academic Coach</span>
              <Sparkles className="h-3 w-3 text-[#6E1E27]" />
            </h3>
            <p className="text-[9px] text-slate-500 font-bold tracking-wider uppercase">Data-Grounded Scoped Chat</p>
          </div>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            disabled={loading}
            className="text-[9px] font-black text-slate-700 bg-white hover:bg-[#FCEEF0] hover:text-[#6E1E27] border border-slate-200 hover:border-[#6E1E27]/30 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat History Box */}
      <div className="flex-grow overflow-y-auto space-y-3.5 pr-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && (
              <div className="h-6 w-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <BrainCircuit className="h-3 w-3 text-emerald-600" />
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-[80%] text-[11px] leading-relaxed font-semibold border ${
                msg.sender === "user"
                  ? "bg-[#FCEEF0] text-[#6E1E27] border-[#6E1E27]/20 rounded-tr-none"
                  : "bg-[#F7F7F9] text-slate-900 border-slate-200 rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <div className="h-6 w-6 rounded-lg bg-[#FCEEF0] border border-[#6E1E27]/20 flex items-center justify-center shrink-0">
                <User className="h-3 w-3 text-[#6E1E27]" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-2.5">
            <div className="h-6 w-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <BrainCircuit className="h-3 w-3 text-emerald-600 animate-pulse" />
            </div>
            <div className="p-3 bg-[#F7F7F9] rounded-2xl rounded-tl-none border border-slate-200 text-slate-500 text-[10px] italic flex items-center space-x-1.5">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="flex items-center space-x-2 border-t border-slate-100 pt-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your performance..."
          className="flex-grow bg-[#F7F7F9] text-slate-900 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-semibold focus:border-[#6E1E27] focus:outline-none transition-all placeholder:text-slate-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="h-9 w-9 bg-[#6E1E27] hover:bg-[#5A171F] disabled:bg-[#6E1E27]/50 text-white rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-md shadow-[#6E1E27]/10"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
