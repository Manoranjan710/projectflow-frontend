"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectDetails } from "@/services/projectApi";
import { addMember, getAvailableUsers, removeMember } from "@/services/memberApi";
import Link from "next/link";
import { toast } from "sonner";
import getApiErrorMessage from "@/utils/getApiErrorMessage";
import Pagination from "@/components/ui/Pagination";
import ProjectChatWidget from "@/components/ProjectChatWidget";

export default function ProjectPage() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);

  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [projectError, setProjectError] = useState("");
  const [usersError, setUsersError] = useState("");

  const [removingMemberId, setRemovingMemberId] = useState(null);
  const [addingUserId, setAddingUserId] = useState(null);

  const PAGE_SIZE = 5;
  const [membersPage, setMembersPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);

  const fetchProject = async () => {
    if (!id) return;

    setIsLoadingProject(true);
    setProjectError("");

    try {
      const res = await getProjectDetails(id);

      setProject(res?.data?.project ?? null);
      setMembers(res?.data?.members ?? []);
    } catch (err) {
      console.error(err);
      setProjectError("Failed to load project details.");
      toast.error(getApiErrorMessage(err));
      setProject(null);
      setMembers([]);
    } finally {
      setIsLoadingProject(false);
    }
  };

  const fetchUsers = async () => {
    if (!id) return;

    setIsLoadingUsers(true);
    setUsersError("");

    try {
      const res = await getAvailableUsers(id);
      setUsers(res?.data ?? []);
    } catch (err) {
      console.error(err);
      setUsersError("Failed to load available users.");
      toast.error(getApiErrorMessage(err));
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchProject();
    fetchUsers();
  }, [id]);

  useEffect(() => {
    setMembersPage(1);
  }, [members.length]);

  useEffect(() => {
    setUsersPage(1);
  }, [users.length]);

  const handleAdd = async (userId) => {
    if (!id) return;

    try {
      setAddingUserId(userId);
      const promise = addMember(id, userId).then((res) => {
        fetchProject();
        fetchUsers();
        return res;
      });

      toast.promise(promise, {
        loading: "Adding member...",
        success: "Member added.",
        error: (err) => getApiErrorMessage(err),
      });

      await promise;
    } finally {
      setAddingUserId(null);
    }
  };

  const handleRemove = async (userId) => {
    if (!id) return;

    try {
      setRemovingMemberId(userId);
      const promise = removeMember(id, userId).then((res) => {
        fetchProject();
        fetchUsers();
        return res;
      });

      toast.promise(promise, {
        loading: "Removing member...",
        success: "Member removed.",
        error: (err) => getApiErrorMessage(err),
      });

      await promise;
    } finally {
      setRemovingMemberId(null);
    }
  };

  const showSections = isLoadingProject || Boolean(project);
  const membersTotalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE));
  const usersTotalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const pagedMembers = members.slice(
    (membersPage - 1) * PAGE_SIZE,
    membersPage * PAGE_SIZE,
  );
  const pagedUsers = users.slice((usersPage - 1) * PAGE_SIZE, usersPage * PAGE_SIZE);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          <Link href="/dashboard" className="hover:underline">
            Projects
          </Link>{" "}
          <span className="text-slate-400">/</span>{" "}
          <span className="text-slate-700">Project</span>
        </div>
        <button
          type="button"
          onClick={() => {
            fetchProject();
            fetchUsers();
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {(projectError || usersError) && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center justify-between gap-3">
          <div>
            {projectError && <div>{projectError}</div>}
            {usersError && <div>{usersError}</div>}
          </div>
          <button
            type="button"
            onClick={() => {
              fetchProject();
              fetchUsers();
            }}
            className="shrink-0 rounded bg-red-600 px-3 py-1.5 text-white"
          >
            Retry
          </button>
        </div>
      )}
      {/* Project Info */}

      <div className="mb-8">
        {isLoadingProject ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
            <div className="h-9 w-72 bg-slate-200 rounded" />
            <div className="mt-3 h-4 w-[520px] max-w-full bg-slate-200 rounded" />
            <div className="mt-2 h-4 w-[360px] max-w-full bg-slate-200 rounded" />
            <div className="mt-4 h-6 w-28 bg-slate-200 rounded" />
          </div>
        ) : project ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {project.title}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {project.description || "No description provided"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Status: {project.status}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">
              Project not found
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              This project may have been deleted or you may not have access.
            </p>
            <div className="mt-4">
              <Link href="/dashboard" className="text-slate-900 hover:underline">
                Back to dashboard
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Members Section */}

      {showSections && (
        <>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Project members
            </h2>
            {!isLoadingProject && (
              <div className="text-sm text-slate-600">
                {members.length} total
              </div>
            )}
          </div>

          <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoadingProject ? (
                  <tr className="border-t">
                    <td colSpan={3} className="px-4 py-6 text-sm text-slate-600">
                      Loading members...
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr className="border-t">
                    <td colSpan={3} className="px-4 py-6 text-sm text-slate-600">
                      No members yet. Add someone from the list below.
                    </td>
                  </tr>
                ) : (
                  pagedMembers.map((member) => (
                    <tr key={member.id} className="border-t">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {member.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {member.email}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        <button
                          type="button"
                          onClick={() => handleRemove(member.id)}
                          disabled={removingMemberId === member.id}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                        >
                          {removingMemberId === member.id
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {!isLoadingProject && members.length > 0 && membersTotalPages > 1 && (
              <div className="border-t border-slate-200 px-4">
                <Pagination
                  page={membersPage}
                  totalPages={membersTotalPages}
                  onPageChange={(p) => setMembersPage(p)}
                />
              </div>
            )}
          </div>

          {/* Available Users */}

          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Available users
            </h2>
            {!isLoadingUsers && (
              <div className="text-sm text-slate-600">
                {users.length} available
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoadingUsers ? (
                  <tr className="border-t">
                    <td colSpan={3} className="px-4 py-6 text-sm text-slate-600">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr className="border-t">
                    <td colSpan={3} className="px-4 py-6 text-sm text-slate-600">
                      No available users to add.
                    </td>
                  </tr>
                ) : (
                  pagedUsers.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {user.email}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        <button
                          type="button"
                          onClick={() => handleAdd(user.id)}
                          disabled={addingUserId === user.id}
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                        >
                          {addingUserId === user.id ? "Adding..." : "Add"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {!isLoadingUsers && users.length > 0 && usersTotalPages > 1 && (
              <div className="border-t border-slate-200 px-4">
                <Pagination
                  page={usersPage}
                  totalPages={usersTotalPages}
                  onPageChange={(p) => setUsersPage(p)}
                />
              </div>
            )}
          </div>
        </>
      )}
      {project && <ProjectChatWidget projectId={id} />}
    </div>
  );
}
