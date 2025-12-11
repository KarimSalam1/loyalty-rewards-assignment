import { useState, useEffect } from "react";
import { api } from "../api";
import { useReset } from "../context/reset/useReset";

export default function RedeemPoints() {
  const [customerId, setCustomerId] = useState("");
  const [points, setPoints] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, resetAll } = useReset();

  const redeem = async () => {
    resetFields();
    resetAll();

    try {
      const res = await api.post("/redeem", {
        customerId: Number(customerId),
        points: Number(points),
        description: "Frontend redemption",
      });

      const fifo = res.data.fifoBreakdown || [];
      const total = fifo.reduce((sum, item) => sum + item.deducted, 0);

      setSuccess(
        `Redemption request created successfully. Deducted a total of ${total} points.`
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to process redemption request."
      );
    }
  };

  const resetFields = () => {
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    register(() => {
      resetFields();
    });
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-2">Redeem Points</h2>

      <input
        type="number"
        placeholder="Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="w-full border p-2 rounded mb-2"
      />

      <input
        type="number"
        placeholder="Points to redeem"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      <button
        onClick={redeem}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
      >
        Redeem
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
}
