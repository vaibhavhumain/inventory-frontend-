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
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState("");

  // check query string ?registered=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setJustRegistered(params.get("registered") === "1");
  }, []);

  // auto-redirect if already logged in
  useEffect(() => {
    const verify = async () => {
      const t = getToken();
      if (!t) return;
      try {
        const { data } = await API.get("/auth/profile");
        if (data.role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/dashboard");
        }
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
    setSuccess(false);

    try {
      const { data } = await API.post("/auth/login", form);
      saveAuth(data);

      // ✅ show success animation
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        if (data.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }, 1200);
    } catch (error) {
      setErr(error?.response?.data?.error || "Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 animate-gradient">
      <div className="relative w-full max-w-md">
        {/* Glow Layer */}
        <div className="absolute inset-0 blur-2xl bg-gradient-to-tr from-blue-400/40 to-teal-400/40 rounded-3xl"></div>

        <div className="relative backdrop-blur-xl bg-white/80 border border-white/30 shadow-2xl rounded-3xl p-8">
          {/* header */}
          <div className="text-center">
            <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-teal-500 text-white shadow-lg">
              🔐
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p className="text-gray-600 mt-1">Log in to continue</p>
          </div>

          {/* registered alert */}
          {justRegistered && (
            <div className="mt-5 flex items-center gap-2 text-sm text-green-800 bg-green-50 border border-green-200 p-3 rounded-lg">
              ✅ <span>Account created successfully. Please log in.</span>
            </div>
          )}

          {/* form */}
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

            {/* error */}
            {err && (
              <div className="flex items-center gap-2 text-red-700 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
                ⚠️ <span>{err}</span>
              </div>
            )}

            {/* button with spinner + success */}
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition transform ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : success
                  ? "bg-green-600"
                  : "bg-gradient-to-r from-blue-600 to-teal-600 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : success ? (
                <>✅ Success</>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* footer */}
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
