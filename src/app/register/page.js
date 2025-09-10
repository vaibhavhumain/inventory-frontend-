"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "../../../utils/api";
import { getToken } from "../../../utils/auth";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", username: "", email: "", password: "", role: "user",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (getToken()) router.replace("/dashboard");
  }, [router]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await API.post("/auth/register", form);
      router.push("/login?registered=1");
    } catch (error) {
      setErr(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 animate-gradient">
      <div className="relative w-full max-w-md">
        {/* Glow Layer */}
        <div className="absolute inset-0 blur-2xl bg-gradient-to-tr from-blue-400/40 to-teal-400/40 rounded-3xl"></div>

        <div className="relative backdrop-blur-xl bg-white/80 border border-white/30 shadow-2xl rounded-3xl p-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-teal-500 text-white shadow-lg">
              🧾
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Create your account
            </h1>
            <p className="text-gray-600 mt-1">Register to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  👤
                </span>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  placeholder="John Doe"
                  className="w-full pl-10 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🆔
                </span>
                <input
                  name="username"
                  value={form.username}
                  onChange={onChange}
                  required
                  placeholder="johndoe"
                  className="w-full pl-10 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  📧
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  placeholder="john@example.com"
                  autoComplete="email"
                  className="w-full pl-10 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-20 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-600 px-2 py-1 rounded-md hover:bg-blue-50"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 characters recommended.
              </p>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={onChange}
                className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Error */}
            {err && (
              <div className="flex items-center gap-2 text-red-700 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
                ⚠️ <span>{err}</span>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition transform ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-teal-600 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
