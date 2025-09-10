import axios from "axios";

const API = axios.create({
  baseURL: "https://inventory-backend-o7iw.onrender.com/api",
});
  
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
  
export async function downloadExcelByDate(date) {
  try {
    const res = await API.get(`/export/${date}`, { responseType: "blob" });

    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const filename = `inventory-${date}.xlsx`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("Excel download failed:", err);
    alert("Failed to download Excel file. Please try again.");
  }
}

export default API;