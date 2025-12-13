import { useState, useEffect } from "react";
import { api } from "../../api";
import { useReset } from "../../context/reset/useReset";
import { useLoading } from "../../context/loading/useLoading";

export default function RedeemPoints() {
  const [customerId, setCustomerId] = useState("");
  const [points, setPoints] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, resetAll } = useReset();
  const { setLoading } = useLoading();

  const redeem = async () => {
    resetFields();
    resetAll();

    try {
      setLoading(true);
      const res = await api.post("/redeem", {
        customerId: Number(customerId),
        points: Number(points),
        description: "Frontend redemption",
      });

      const fifo = res.data.fifoBreakdown || [];
      const total = fifo.reduce((sum, item) => sum + item.deducted, 0);

      setSuccess(`Redemption successful. Total deducted: ${total} points.`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to process redemption.");
    } finally {
      setLoading(false);
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
    <div className="space-y-4 text-slate-100">
      <h2 className="text-xl font-semibold text-center">Redeem Points</h2>

      <div className="space-y-1">
        <label className="text-sm text-slate-300">Customer ID</label>
        <input
          type="number"
          placeholder="Enter customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded-md focus:outline-none focus:border-red-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-slate-300">Points to Redeem</label>
        <input
          type="number"
          placeholder="Enter points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded-md focus:outline-none focus:border-red-500"
        />
      </div>

      <button
        onClick={redeem}
        className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 cursor-pointer mx-auto block w-40 text-center"
      >
        Redeem
      </button>

      {error && <p className="text-red-400 text-center">{error}</p>}
      {success && <p className="text-green-400 text-center">{success}</p>}
    </div>
  );
}
