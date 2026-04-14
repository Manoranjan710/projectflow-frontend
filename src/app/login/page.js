"use client";
import React from "react";
import { useState } from "react";
import { loginUser } from "@/services/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import getApiErrorMessage from "@/utils/getApiErrorMessage";

const Page = () => {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value,
    });
  };

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
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 pr-10 text-sm text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-white/20"
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((v) => !v)}
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                title={isPasswordVisible ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-200 hover:text-white "
              >
                {isPasswordVisible ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M2 2l20 20" />
                    <path d="M6.71 6.71C4.68 8.14 3.28 10.02 2 12c2.5 4 6.5 8 10 8 1.1 0 2.18-.26 3.2-.74" />
                    <path d="M10.58 10.58A2 2 0 0 0 12 16a2 2 0 0 0 1.42-.58" />
                    <path d="M9.88 4.24A9.77 9.77 0 0 1 12 4c3.5 0 7.5 4 10 8a18.94 18.94 0 0 1-3.06 3.85" />
                    <path d="M14.12 14.12A2 2 0 0 0 9.88 9.88" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8-10-8-10-8Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
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

export default Page;
