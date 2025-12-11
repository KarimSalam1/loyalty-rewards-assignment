import { useState } from "react";
import { api } from "../api";

export default function BatchPost() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const runBatch = async () => {
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/batch-post");

      setSuccess(
        `Batch posted successfully!\n` +
          `Processed: ${res.data.processed} transaction(s)\n` +
          `Earned: ${res.data.totalEarned} points\n` +
          `Redeemed: ${res.data.totalRedeemed} points`
      );
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-2">Batch Post</h2>

      <button
        onClick={runBatch}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer"
      >
        Run Batch
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
}
