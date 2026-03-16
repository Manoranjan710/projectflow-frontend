"use client";
import React from "react";
import { useState } from "react";
import { loginUser } from "@/services/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import getApiErrorMessage from "@/utils/getApiErrorMessage";

const page = () => {
    const [loginFormData, setLoginFormData] = useState({
        email: "",
        password: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const handleChange = (e)=>{
        setLoginFormData({
            ...loginFormData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        const promise = loginUser(loginFormData).then((res) => {
          const token = res?.data?.accessToken;
          if (!token) throw new Error("Invalid login response.");
          localStorage.setItem("token", token);
          router.replace("/dashboard");
          return res;
        });

        toast.promise(promise, {
          loading: "Signing in...",
          success: "Welcome back!",
          error: (err) => getApiErrorMessage(err),
        });

        try {
          await promise;
        } finally {
          setIsSubmitting(false);
        }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-white/10 ring-1 ring-white/10" />
          <h2 className="text-2xl font-semibold text-white">Sign in</h2>
          <p className="mt-1 text-sm text-slate-300">
            Use your ProjectFlow account to continue.
          </p>
        </div>

        <div className="mt-7 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-white/20"
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-white/20"
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default page;
