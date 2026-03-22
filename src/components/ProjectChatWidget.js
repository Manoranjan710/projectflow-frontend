"use client";

import { useState } from "react";
import ProjectChat from "./ProjectChat";

const ChatIcon = () => (
  <svg
    aria-hidden="true"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 0-2.6 6.4L21 21l-2.6-6.6A9 9 0 0 0 21 12z" />
    <path d="M8 12h8M8 16h5" />
  </svg>
);

const CloseIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function ProjectChatWidget({ projectId }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-4 rounded-full shadow-2xl transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      >
        <ChatIcon />
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 w-[360px] max-w-full h-[520px] bg-gradient-to-br from-white/90 to-slate-50 shadow-[0_35px_60px_-15px_rgba(15,23,42,0.5)] rounded-2xl border border-white/60 overflow-hidden flex flex-col backdrop-blur">
          <div className="px-5 py-4 border-b border-slate-200/60 bg-white/70 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-lg font-semibold text-slate-900 tracking-wide">AI Assistant</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Context-aware help</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full bg-slate-100 hover:bg-slate-200 p-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
              aria-label="Close chat window"
            >
              <CloseIcon />
            </button>
          </div>

          <ProjectChat projectId={projectId} />
        </div>
      )}
    </>
  );
}
