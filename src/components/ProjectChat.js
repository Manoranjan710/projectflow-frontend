"use client";

import { useState } from "react";
import axiosClient from "@/api/axiosClient";

export default function ProjectChat({ projectId }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

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

      index++;

      if (index > text.length) clearInterval(interval);
    }, 20);
  };

  const askQuestion = async () => {
    if (!question) return;

    const userMessage = { role: "user", content: question };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");

    try {
      setLoading(true);

      const res = await axiosClient.post(`/projects/${projectId}/ask`, {
        question,
      });

      const aiMessage = {
        role: "assistant",
        content: res.data.data.answer,
      };

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      simulateStreaming(res.data.data.answer);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-8 height-[400px]  overflow-scroll">
      <h2 className="text-xl font-semibold mb-3">AI Assistant 🤖</h2>

      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") askQuestion();
          }}
          placeholder="Ask something..."
          className="flex-1 border p-2 rounded"
        />

        <button
          onClick={askQuestion}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded max-w-[80%] ${
              msg.role === "user"
                ? "bg-blue-600 text-white self-end ml-auto"
                : "bg-gray-200"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && <div className="text-gray-500 text-sm">Typing...</div>}
      </div>

      {loading && <p className="text-gray-500">Thinking...</p>}

      {answer && (
        <div className="bg-gray-100 p-3 rounded">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
