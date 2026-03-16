"use client";
import React from "react";
import { useEffect, useState, useMemo } from "react";
import { getProjects } from "@/services/projectApi";
import CreateProjectModal from "@/components/CreateProjectModal";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";

const page = () => {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  // Create debounced search function
  const debouncedSetSearch = useMemo(
    () => debounce((value) => setSearch(value), 500),
    [],
  );

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  // Update search state when inputValue changes (debounced)
  useEffect(() => {
    debouncedSetSearch(inputValue);
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [inputValue, debouncedSetSearch]);

  const fetchProjects = async () => {
    try {
      const result = await getProjects({
        page,
        limit: 5,
        search,
        status,
      });
      setProjects(result?.data.items);
      setTotalPages(result?.data.totalPages);
    } catch (err) {
      alert("Failed to fetch projects.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, status, search]);

  return (
    <div>
      <h2 className="text-2xl py-6">Projects list</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Create Project
        </button>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Created by</th>
          </tr>
        </thead>
        <tbody>
          {projects?.map((project) => (
            <tr
              key={project.id}
              className="border-t cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/dashboard/projects/${project.id}`)}
            >
              <td className="p-3">{project?.title}</td>
              <td className="p-3">{project?.description}</td>
              <td className="p-3">{project?.status}</td>
              <td className="p-3">{project?.created_by}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}

      <div className="flex gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreated={fetchProjects}
        />
      )}
    </div>
  );
};

export default page;
