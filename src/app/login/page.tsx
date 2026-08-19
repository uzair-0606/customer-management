"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setError("Invalid email or password.");
      return;
    }

    /*
      Auth.js has successfully authenticated the user.

      We now ask the session who the user is
      so that we can redirect them to the
      appropriate dashboard.
    */

    const response = await fetch("/api/auth/session");
    const session = await response.json();

    if (session?.user?.role === "SUPER_ADMIN") {
      router.push("/Super_Admin/dashboard");
      return;
    }

    if (session?.user?.role === "EMPLOYEE") {
      router.push("/Employee/dashboard");
      return;
    }

    setLoading(false);
    setError("Unable to determine user role.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl">

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Customer Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign In To Your Account
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-semibold text-blue-700">
              Development Login
            </p>

            <p className="mt-2 text-xs text-blue-600">
              Super Admin:
              <br />
              admin@example.com
            </p>

            <p className="mt-2 text-xs text-blue-600">
              Password:
              <br />
              Admin@123
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}