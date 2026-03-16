"use client";

import { useState } from "react";
import { createProject } from "@/services/projectApi";

export default function CreateProjectModal({ onClose, onCreated }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await createProject({
        title,
        description
      });

      onCreated(); // refresh list
      onClose();   // close modal

    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="bg-white p-6 rounded w-96">

        <h2 className="text-xl font-bold mb-4">
          Create Project
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Project title"
            className="w-full border p-2 mb-3 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full border p-2 mb-3 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Create
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}