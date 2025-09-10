"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../../../utils/api";
import { getToken, clearAuth } from "../../../../utils/auth";




export default function AdminItemsPage() {
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  // 🔐 Client-side guard: only admins allowed
  useEffect(() => {
    const verify = async () => {
      const token = getToken();
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        const { data } = await API.get("/auth/profile");
        if (data.role !== "admin") {
          router.replace("/dashboard");
          return;
        }
        setAuthLoading(false);
      } catch {
        clearAuth();
        router.replace("/login");
      }
    };
    verify();
  }, [router]);

  // 📦 Load items after auth passes
  useEffect(() => {
    if (authLoading) return;

    const load = async () => {
      try {
        const { data } = await API.get("/items");
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr("Failed to load items");
      } finally {
        setItemsLoading(false);
      }
    };
    load();
  }, [authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        ⏳ Verifying admin access...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              📦 Admin • Items
            </h1>
            <p className="text-gray-600">Manage inventory items (list only for now)</p>
          </div>

          {/* Next step will wire these */}
          <div className="flex gap-3">
            <button
              disabled
              className="px-4 py-2 rounded-lg bg-gray-300 text-white cursor-not-allowed"
              title="Coming next"
            >
              + Add Item
            </button>
          </div>
        </div>

        {err && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg">
            ⚠️ {err}
          </div>
        )}

        {itemsLoading ? (
          <div className="p-6 bg-white rounded-xl shadow">⏳ Loading items…</div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Code</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Unit</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td className="p-4 text-center text-gray-500" colSpan={7}>
                      No items found.
                    </td>
                  </tr>
                ) : (
                  items.map((it) => (
                    <tr key={it._id || it.id} className="border-t">
                      <td className="p-3">{it.name || "-"}</td>
                      <td className="p-3">{it.code || it.itemCode || it.sku || "-"}</td>
                      <td className="p-3">{it.quantity ?? "-"}</td>
                      <td className="p-3">{it.unit || "-"}</td>
                      <td className="p-3">{it.price ?? "-"}</td>
                      <td className="p-3">{it.category || "-"}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            disabled
                            title="Edit coming next"
                            className="px-3 py-1 rounded-md bg-gray-200 text-gray-600 cursor-not-allowed"
                          >
                            Edit
                          </button>
                          <button
                            disabled
                            title="Delete coming next"
                            className="px-3 py-1 rounded-md bg-gray-200 text-gray-600 cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
