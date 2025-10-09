"use client";
import { useRef, useState } from "react";
import API from "../utils/api";
import { toast } from "sonner"; // ✅ import Sonner

export default function BusInfo({ onBusSaved }) {
  const serialInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [bus, setBus] = useState({
    busCode: "",
    ownerName: "",
    chassisNo: "",
    engineNo: "",
    model: "",
    serialNo: "",
  });

  // 🔹 Auto-generate Bus Code parts
  const handleModelChange = (value) => {
    const last4 = bus.chassisNo?.slice(-4) || "";
    const autoPrefix = value + last4;
    setBus({
      ...bus,
      model: value,
      busCode: autoPrefix + (bus.serialNo || ""),
    });
    if (bus.chassisNo && serialInputRef.current) serialInputRef.current.focus();
  };

  const handleChassisChange = (val) => {
    let updatedBus = { ...bus, chassisNo: val };
    if (bus.model && val.length >= 4) {
      const last4 = val.slice(-4);
      updatedBus.busCode = bus.model + last4 + (bus.serialNo || "");
    }
    setBus(updatedBus);
  };

  const handleSerialChange = (val) => {
    const last4 = bus.chassisNo?.slice(-4) || "";
    setBus({
      ...bus,
      serialNo: val,
      busCode: (bus.model ? bus.model : "") + last4 + val,
    });
  };

  // 🔹 Save Bus to DB
  const handleSaveBus = async () => {
    if (!bus.model || !bus.chassisNo || !bus.serialNo) {
      toast.error("Please fill Model, Chassis No, and Serial No.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/buses", bus);
      toast.success(`Bus ${data.bus.busCode} saved successfully!`);
      onBusSaved(data.bus);

      // Reset form
      setBus({
        busCode: "",
        ownerName: "",
        chassisNo: "",
        engineNo: "",
        model: "",
        serialNo: "",
      });
    } catch (err) {
      console.error("Error saving bus:", err);
      toast.error(err.response?.data?.error || "Error saving bus.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 border rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">🚌 Add Bus</h3>

      <div className="grid grid-cols-6 gap-4 items-end">
        {/* Model */}
        <div>
          <label className="text-sm text-gray-600">Model</label>
          <select
            value={bus.model}
            onChange={(e) => handleModelChange(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Model</option>
            <option value="SP">Spider (SP)</option>
            <option value="HY">Hymer (HY)</option>
            <option value="TO">Tourista (TO)</option>
            <option value="KA">Kasper (KA)</option>
            <option value="AR">Arrow (AR)</option>
            <option value="SE">Semi Deluxe (SE)</option>
            <option value="SL">Sleeper (SL)</option>
            <option value="SS">Sleeper Seater (SS)</option>
          </select>
        </div>

        {/* Chassis */}
        <div>
          <label className="text-sm text-gray-600">Chassis No.</label>
          <input
            type="text"
            value={bus.chassisNo}
            onChange={(e) => handleChassisChange(e.target.value)}
            placeholder="Enter Chassis No."
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Engine */}
        <div>
          <label className="text-sm text-gray-600">Engine No.</label>
          <input
            type="text"
            value={bus.engineNo}
            onChange={(e) => setBus({ ...bus, engineNo: e.target.value })}
            placeholder="Enter Engine No."
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Serial */}
        <div>
          <label className="text-sm text-gray-600">Serial (Last 2)</label>
          <input
            type="text"
            maxLength={2}
            ref={serialInputRef}
            value={bus.serialNo || ""}
            onChange={(e) => handleSerialChange(e.target.value.toUpperCase())}
            placeholder="01"
            className="border p-2 rounded w-full text-center"
          />
        </div>

        {/* Owner */}
        <div>
          <label className="text-sm text-gray-600">Owner Name</label>
          <input
            type="text"
            value={bus.ownerName}
            onChange={(e) => setBus({ ...bus, ownerName: e.target.value })}
            placeholder="Enter Owner Name"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Bus Code */}
        <div>
          <label className="text-sm text-gray-600">Bus Code</label>
          <input
            type="text"
            value={bus.busCode}
            readOnly
            className="border p-2 rounded w-full bg-gray-100 text-blue-700 font-semibold text-center"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSaveBus}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 text-sm"
        >
          {loading ? "Saving..." : "💾 Save Bus"}
        </button>
      </div>
    </div>
  );
}
