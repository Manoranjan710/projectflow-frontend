"use client";
import React from "react";
import { useState } from "react";
import { loginUser } from "@/services/authApi";
import { useRouter } from "next/navigation";

const page = () => {
    const [loginFormData, setLoginFormData] = useState({
        email: "",
        password: ""
    });

    const router = useRouter();

    const handleChange = (e)=>{
        setLoginFormData({
            ...loginFormData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(loginFormData);
            console.log(res);
            const token = res.data.accessToken;
            localStorage.setItem("token", token);
            router.push("/dashboard");
        } catch (err) {
            alert(err);
        }
    };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default page;
