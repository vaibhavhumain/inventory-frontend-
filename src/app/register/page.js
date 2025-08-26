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

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="backdrop-blur bg-white/70 border border-white/50 shadow-xl rounded-2xl p-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-blue-100">
              <span className="text-xl">🧾</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-500 mt-1">Register to continue to Stock Ledger</p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                name="name" value={form.name} onChange={onChange} required
                placeholder="John Doe"
                className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                name="username" value={form.username} onChange={onChange} required
                placeholder="johndoe"
                className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" name="email" value={form.email} onChange={onChange} required
                placeholder="john@example.com" autoComplete="email"
                className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password" value={form.password} onChange={onChange} required
                  placeholder="••••••••" autoComplete="new-password"
                  className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters recommended.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role" value={form.role} onChange={onChange}
                className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {err && (
              <p className="text-red-600 text-sm border border-red-200 bg-red-50 p-2 rounded-lg">
                {err}
              </p>
            )}

            <button
              type="submit" disabled={loading}
              className={`w-full py-2.5 rounded-xl font-medium text-white transition ${
                loading ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700 shadow"
              }`}
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
