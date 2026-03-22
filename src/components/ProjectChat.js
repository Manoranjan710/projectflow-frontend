"use client";

import { useState, useEffect, useRef } from "react";
import axiosClient from "@/api/axiosClient";

export default function ProjectChat({ projectId }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollerRef = useRef(null);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({
        top: scrollerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const simulateStreaming = (text) => {
    let index = 0;

    const interval = setInterval(() => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (!last || last.role !== "assistant") return prev;

        const updated = [...prev];
        updated[updated.length - 1] = {
          ...last,
          content: text.slice(0, index),
        };

        return updated;
      });

      index += 1;

      if (index > text.length) clearInterval(interval);
    }, 20);
  };

  const askQuestion = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    setError("");
    const userMessage = { role: "user", content: trimmedQuestion };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");

    try {
      setLoading(true);

      const res = await axiosClient.post(`/projects/${projectId}/ask`, {
        question: trimmedQuestion,
      });

      const answerText = res.data?.data?.answer || "I couldn't find an answer.";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      simulateStreaming(answerText);
    } catch (err) {
      setError("Something went wrong. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full grow min-h-0">
      <div
        ref={scrollerRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-4 bg-white/70"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.length === 0 && (
          <div className="text-sm text-slate-500">
            Ask anything about the project and I'll find the right answer.
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={`${index}-${msg.content?.slice(0, 10)}`}
            className={`flex gap-3 rounded-2xl p-3 shadow-sm transition-all ${
              msg.role === "user"
                ? "bg-gradient-to-r from-blue-500/90 to-indigo-500/80 text-white self-end"
                : "bg-slate-100 text-slate-900 self-start"
            }`}
          >
            <span
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold uppercase tracking-wide ${
                msg.role === "user"
                  ? "bg-white/25 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {msg.role === "user" ? "You" : "AI"}
            </span>
            <div className="text-sm leading-relaxed whitespace-pre-line">
              {msg.content || (
                <span className="animate-pulse text-slate-500">Typing…</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-slate-200/70 bg-white/90 backdrop-blur-sm">
        <div className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") askQuestion();
            }}
            placeholder="Ask something..."
            className="flex-1 rounded-xl border border-slate-200/80 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={askQuestion}
            disabled={loading || !question.trim()}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
      </div>
    </div>
  );
}
