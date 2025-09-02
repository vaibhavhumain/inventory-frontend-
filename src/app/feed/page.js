"use client";
import { useRouter } from "next/navigation";
import API from "../../../utils/api";
import AddItemForm from "../../../components/AddItemForm";

export default function FeedPage() {
  const router = useRouter();

  const handleSaveItem = async (newItem) => {
    try {
      const res = await API.post("/items", newItem);
      console.log("Item saved:", res.data);
      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating item:", err);
      alert("Failed to create item");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Feed Stock</h1>
      <AddItemForm
        onClose={() => router.push("/dashboard")}  
        onSave={handleSaveItem}
      />
    </div>
  );
}
