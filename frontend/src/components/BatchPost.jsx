import { useState } from "react";
import { api } from "../api";
import { useReset } from "../context/reset/useReset";

export default function BatchPost() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { resetAll } = useReset();

  const startAutoClear = () => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);
  };

  const runBatch = async () => {
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/batch-post");

      setSuccess(
        `Batch posted successfully!\nProcessed: ${res.data.processed} transaction(s)\nEarned: ${res.data.totalEarned} points\nRedeemed: ${res.data.totalRedeemed} points`
      );

      startAutoClear();
      resetAll();
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
      startAutoClear();
    }
  };

  return (
    <div className="space-y-4 text-slate-100">
      <h2 className="text-xl font-semibold text-center">Batch Post</h2>

      <button
        onClick={runBatch}
        className="bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 cursor-pointer mx-auto block w-40 text-center"
      >
        Run Batch
      </button>

      {error && (
        <p className="text-red-400 text-center whitespace-pre-line">{error}</p>
      )}
      {success && (
        <p className="text-green-400 text-center whitespace-pre-line">
          {success}
        </p>
      )}
    </div>
  );
}
