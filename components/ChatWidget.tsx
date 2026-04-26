"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "كم رسوم التحويل؟",
  "كم وقت يستغرق؟",
  "كم وفّرت اليوم؟",
  "كيف يعمل VeloPay؟",
];

const BADGE_STORAGE_KEY = "velopay_chat_opened";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 أهلاً! أنا مساعد VeloPay الذكي. كيف يمكنني مساعدتك في تحويل أموالك اليوم؟",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check localStorage on mount — if user opened before, no badge
  useEffect(() => {
    const opened = localStorage.getItem(BADGE_STORAGE_KEY);
    if (opened === "true") {
      setHasOpened(true);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleOpen = () => {
    setOpen(true);
    if (!hasOpened) {
      setHasOpened(true);
      localStorage.setItem(BADGE_STORAGE_KEY, "true");
    }
  };

  const handleToggle = () => {
    if (open) {
      setOpen(false);
    } else {
      handleOpen();
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      const reply = data.content || "عذراً، لم أتمكن من الرد. حاول مرة أخرى.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      console.error("[ChatWidget] Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى. 🔄",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const showBadge = !hasOpened;

  return (
    <div className="fixed bottom-6 left-6 z-50" dir="rtl">
      {/* Chat window */}
      {open && (
        <div className="mb-4 flex w-80 flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 rounded-t-2xl bg-[#13B601] px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
              V
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">VeloPay AI</div>
              <div className="flex items-center gap-1.5 text-xs text-green-100">
                <span className="h-1.5 w-1.5 rounded-full bg-green-200 animate-pulse" />
                متصل الآن
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white text-lg leading-none"
              aria-label="إغلاق"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex h-72 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#13B601] text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions — show when only the greeting is present */}
          {messages.length <= 1 && (
            <div className="border-t border-gray-100 px-3 py-2">
              <p className="mb-2 text-xs text-gray-400">أسئلة سريعة:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="rounded-full border border-[#13B601]/30 bg-[#13B601]/5 px-3 py-1 text-xs text-[#13B601] transition hover:bg-[#13B601]/10"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                placeholder="اكتب سؤالك..."
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#13B601] transition"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#13B601] text-white transition hover:bg-[#0fa301] disabled:opacity-40"
                aria-label="إرسال"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 rotate-180">
                  <path
                    d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={handleToggle}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#13B601] shadow-lg shadow-[#13B601]/30 transition hover:bg-[#0fa301] active:scale-95"
        aria-label="فتح المساعد الذكي"
      >
        {open ? (
          <span className="text-xl text-white">✕</span>
        ) : (
          <span className="text-2xl">🤖</span>
        )}

        {/* Badge — only shows when user has never opened chat */}
        {showBadge && !open && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white animate-pulse">
            1
          </span>
        )}
      </button>
    </div>
  );
}
