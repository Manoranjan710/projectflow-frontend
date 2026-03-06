"use client";
import React from "react";
import { useEffect, useState } from "react";
import { getProjects } from "@/services/projectApi";

const page = () => {

  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const result = await getProjects({
        page: 1,
        limit: 10
      });
      setProjects(result?.data.items);
    } catch (err) {
      alert("Failed to fetch projects.");
    }
  };

  useEffect(()=>{
    fetchProjects();
  },[])

  return (
    <div>
      <h2 className="text-2xl py-6">Projects list</h2>
      <table  className="w-full bg-white shadow rounded">
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
            <tr key={project.id} className="border-t">
              <td className="p-3">{project?.title}</td> 
              <td className="p-3">{project?.description}</td>
              <td className="p-3">{project?.status}</td>
              <td className="p-3">{project?.created_by}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default page;