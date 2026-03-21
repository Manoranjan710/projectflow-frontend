"use client";

import { useState } from "react";
import ProjectChat from "./ProjectChat";

export default function ProjectChatWidget({ projectId }) {

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg"
      >
        💬
      </button>

      {/* Chat Popup */}
      {open && (
        <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white shadow-xl rounded-lg flex flex-col">

          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-semibold">AI Assistant</h3>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <ProjectChat projectId={projectId} />

        </div>
      )}
    </>
  );
}