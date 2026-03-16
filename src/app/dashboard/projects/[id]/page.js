"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectDetails } from "@/services/projectApi";
import { addMember, getAvailableUsers, removeMember } from "@/services/memberApi";
import Link from "next/link";

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

  const handleAdd = async (userId) => {
    if (!id) return;

    try {
      setAddingUserId(userId);
      await addMember(id, userId);
      fetchProject();
      fetchUsers();
    } finally {
      setAddingUserId(null);
    }
  };

  const handleRemove = async (userId) => {
    if (!id) return;

    try {
      setRemovingMemberId(userId);
      await removeMember(id, userId);
      fetchProject();
      fetchUsers();
    } finally {
      setRemovingMemberId(null);
    }
  };

  const showSections = isLoadingProject || Boolean(project);

  return (
    <div>
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        {" / "}
        <span>Project</span>
      </div>

      {(projectError || usersError) && (
        <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center justify-between gap-3">
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
          <div className="animate-pulse">
            <div className="h-9 w-72 bg-gray-200 rounded" />
            <div className="mt-3 h-4 w-[520px] max-w-full bg-gray-200 rounded" />
            <div className="mt-2 h-4 w-[360px] max-w-full bg-gray-200 rounded" />
            <div className="mt-4 h-6 w-28 bg-gray-200 rounded" />
          </div>
        ) : project ? (
          <>
            <h1 className="text-3xl font-bold">{project.title}</h1>

            <p className="text-gray-600 mt-1">
              {project.description || "No description provided"}
            </p>

            <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-200 rounded">
              Status: {project.status}
            </span>
          </>
        ) : (
          <div className="bg-white shadow rounded p-6">
            <h1 className="text-2xl font-bold">Project not found</h1>
            <p className="text-gray-600 mt-1">
              This project may have been deleted or you may not have access.
            </p>
            <div className="mt-4">
              <Link href="/dashboard" className="text-blue-600 hover:underline">
                Back to dashboard
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Members Section */}

      {showSections && (
        <>
          <h2 className="text-xl font-semibold mb-3">Project Members</h2>

          <table className="w-full bg-white shadow rounded mb-8">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoadingProject ? (
                <tr className="border-t">
                  <td colSpan={3} className="p-6 text-gray-500">
                    Loading members...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr className="border-t">
                  <td colSpan={3} className="p-6 text-gray-500">
                    No members yet. Add someone from the list below.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="border-t">
                    <td className="p-3">{member.name}</td>
                    <td className="p-3">{member.email}</td>

                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleRemove(member.id)}
                        disabled={removingMemberId === member.id}
                        className="text-red-600 disabled:opacity-60"
                      >
                        {removingMemberId === member.id ? "Removing..." : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Available Users */}

          <h2 className="text-xl font-semibold mb-3">Available Users</h2>

          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoadingUsers ? (
                <tr className="border-t">
                  <td colSpan={3} className="p-6 text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr className="border-t">
                  <td colSpan={3} className="p-6 text-gray-500">
                    No available users to add.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>

                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleAdd(user.id)}
                        disabled={addingUserId === user.id}
                        className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-60"
                      >
                        {addingUserId === user.id ? "Adding..." : "Add"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
