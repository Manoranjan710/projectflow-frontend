"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectDetails } from "@/services/projectApi";
import { getAvailableUsers, addMember } from "@/services/memberApi";

export default function ProjectPage() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchProject = async () => {
    const res = await getProjectDetails(id);

    setProject(res.data.project);
    setMembers(res.data.members);
  };

  const fetchUsers = async () => {
    const res = await getAvailableUsers(id);

    setUsers(res.data);
  };

  useEffect(() => {
    fetchProject();
    fetchUsers();
  }, []);

  const handleAdd = async (userId) => {
    await addMember(id, userId);

    fetchProject();
    fetchUsers();
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      {/* Project Info */}

      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>

      <p className="text-gray-600 mb-6">{project.description}</p>

      {/* Members Section */}

      <h2 className="text-xl font-semibold mb-3">Project Members</h2>

      <ul className="mb-6">
        {members.map((member) => (
          <li key={member.id}>
            {member.name} ({member.email})
          </li>
        ))}
      </ul>

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
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>

              <td className="p-3">
                <button
                  onClick={() => handleAdd(user.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
