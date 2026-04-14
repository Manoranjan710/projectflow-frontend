"use client";
import React from "react";
import { useCallback, useEffect, useState, useMemo } from "react";
import { deleteProject, getProjects } from "@/services/projectApi";
import CreateProjectModal from "@/components/CreateProjectModal";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import getApiErrorMessage from "@/utils/getApiErrorMessage";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";

const Page = () => {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const fetchProjects = useCallback(async () => {
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
  }, [page, search, status]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleConfirmDelete = async () => {
    if (!projectToDelete?.id || isDeleting) return;

    const projectId = projectToDelete.id;
    setIsDeleting(true);

    const promise = deleteProject(projectId).then((res) => {
      setProjectToDelete(null);
      return res;
    });

    toast.promise(promise, {
      loading: "Deleting project...",
      success: "Project deleted.",
      error: (err) => getApiErrorMessage(err),
    });

    try {
      await promise;
      await fetchProjects();
    } finally {
      setIsDeleting(false);
    }
  };

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
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Action
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
                    <td className="px-4 py-3 text-right">
                      <div className="ml-auto h-8 w-16 animate-pulse rounded bg-slate-200" />
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
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(project);
                        }}
                        className="inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                        aria-label={`Delete ${project?.title ?? "project"}`}
                        title="Delete project"
                      >
                        Delete
                      </button>
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

      {projectToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Delete project confirmation"
          onClick={() => !isDeleting && setProjectToDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900">
              Delete project?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              This will permanently delete{" "}
              <span className="font-medium text-slate-900">
                {projectToDelete?.title ?? "this project"}
              </span>
              .
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProjectToDelete(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-70"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
