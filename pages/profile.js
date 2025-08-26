    import { useEffect, useState } from "react";
import API from "../utils/api";
import { getToken, clearAuth } from "../utils/auth";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    (async () => {
      try {
        const { data } = await API.get("/auth/profile");
        setProfile(data);
      } catch (error) {
        setErr(error?.response?.data?.error || "Failed to load profile");
      }
    })();
  }, [router]);

  const logout = () => {
    clearAuth();
    router.push("/login");
  };

  if (!getToken()) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">My Profile</h1>
          <button onClick={logout} className="text-sm px-3 py-1.5 rounded bg-red-600 text-white">
            Logout
          </button>
        </div>

        {err && <p className="mt-3 text-red-600">{err}</p>}

        {profile && (
          <div className="mt-4 space-y-1">
            <p><span className="font-medium">Name:</span> {profile.name}</p>
            <p><span className="font-medium">Username:</span> {profile.username}</p>
            <p><span className="font-medium">Email:</span> {profile.email}</p>
            <p><span className="font-medium">Role:</span> {profile.role}</p>
            <p className="text-xs text-gray-500 mt-3">
              (Password is excluded from response as per controller.)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
 