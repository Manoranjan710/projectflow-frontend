"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="w-64 bg-white shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Projectflow</h2>
      <nav className="space-y-4">
        <button
          className="w-full text-left text-gray-700 hover:text-blue-600"
          onClick={() => router.push("/dashboard")}
        >
          Projects
        </button>
        <button
          className="w-full text-left text-gray-700 hover:text-red-600"
          onClick={logout}
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
