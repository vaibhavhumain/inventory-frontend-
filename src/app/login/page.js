"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "../../../utils/api";
import { saveAuth, getToken, clearAuth } from "../../../utils/auth";

export default function Login() {
  const router = useRouter();
  const [justRegistered, setJustRegistered] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setJustRegistered(params.get("registered") === "1");
  }, []);

  useEffect(() => {
    const verify = async () => {
      const t = getToken();
      if (!t) return;
      try {
        await API.get("/auth/profile");
        router.replace("/dashboard");
      } catch {
        clearAuth();
      }
    };
    verify();
  }, [router]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", form);
      saveAuth(data);
      router.push("/dashboard");
    } catch (error) {
      setErr(error?.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 blur-2xl bg-gradient-to-tr from-blue-400/40 to-purple-400/40 rounded-3xl"></div>

        <div className="relative backdrop-blur-xl bg-white/80 border border-white/30 shadow-2xl rounded-3xl p-8">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 text-white shadow-lg">
              🔐
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p className="text-gray-600 mt-1">Log in to continue</p>
          </div>

          {justRegistered && (
            <div className="mt-5 flex items-center gap-2 text-sm text-green-800 bg-green-50 border border-green-200 p-3 rounded-lg">
              ✅ <span>Account created successfully. Please log in.</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
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
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-10 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

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
                  autoComplete="current-password"
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
            </div>

            {err && (
              <div className="flex items-center gap-2 text-red-700 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
                ⚠️ <span>{err}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition transform ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            New here?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
 