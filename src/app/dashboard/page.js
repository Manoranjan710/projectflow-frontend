"use client";
import React from "react";
import { useEffect, useState, useMemo } from "react";
import { getProjects } from "@/services/projectApi";
import CreateProjectModal from "@/components/CreateProjectModal";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import getApiErrorMessage from "@/utils/getApiErrorMessage";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";

const page = () => {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
    setIsLoading(true);
    setError("");
    try {
      const result = await getProjects({
        page,
        limit: 5,
        search,
        status,
      });
      setProjects(result?.data?.items ?? []);
      setTotalPages(result?.data?.totalPages ?? 1);
    } catch (err) {
      console.error(err);
      setProjects([]);
      setTotalPages(1);
      setError("Failed to fetch projects.");
      toast.error(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, status, search]);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
          <p className="mt-1 text-sm text-slate-600">
            Search, filter, and manage your projects.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          + Create project
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="text"
            placeholder="Search by project name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 md:max-w-sm"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 md:max-w-xs"
          >
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>

          <div className="flex-1" />

          <button
            type="button"
            onClick={fetchProjects}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {!isLoading && projects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description={
            search || status
              ? "Try adjusting your filters, or create a new project."
              : "Create your first project to get started."
          }
          actionLabel="+ Create project"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Created by
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-3">
                      <div className="h-4 w-44 animate-pulse rounded bg-slate-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-72 animate-pulse rounded bg-slate-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                    </td>
                  </tr>
                ))
              ) : (
                projects?.map((project) => (
                  <tr
                    key={project.id}
                    className="border-t cursor-pointer hover:bg-slate-50"
                    onClick={() =>
                      router.push(`/dashboard/projects/${project.id}`)
                    }
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {project?.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {project?.description || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                        {project?.status || "unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {project?.created_by || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="border-t border-slate-200 px-4">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      )}

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
