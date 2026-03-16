"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur">
        <div className="mx-auto mb-6 h-14 w-14 rounded-2xl bg-white/10 ring-1 ring-white/10" />
        <h1 className="text-3xl font-semibold text-white">ProjectFlow</h1>
        <p className="mt-3 text-sm text-slate-300">
          A clean, fast dashboard to manage projects and members.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/0 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
