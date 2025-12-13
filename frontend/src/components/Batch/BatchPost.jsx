import { useState } from "react";
import { api } from "../../api";
import { useReset } from "../../context/reset/useReset";
import { useLoading } from "../../context/loading/useLoading";

export default function BatchPost() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { resetAll } = useReset();
  const { setLoading } = useLoading();

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
      setLoading(true);
      const res = await api.post("/batch-post");

      setSuccess(
        `Batch posted successfully!\nProcessed: ${res.data.processed} transaction(s)\nEarned: ${res.data.totalEarned} points\nRedeemed: ${res.data.totalRedeemed} points`
      );

      startAutoClear();
      resetAll();
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
      startAutoClear();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <h2 className="text-xl font-semibold text-center">Batch Post</h2>

      <p className="text-center text-slate-400 text-sm max-w-md mx-auto">
        This process will post all pending EARN and REDEEM transactions, update
        account balances, and assign a batch ID.
      </p>

      <button
        onClick={runBatch}
        className="bg-purple-600 text-white px-4 py-2 rounded-md 
                 hover:bg-purple-700 cursor-pointer mx-auto block w-48 text-center"
      >
        Run Batch Posting
      </button>

      {error && (
        <div className="text-red-300 bg-red-900/20 border border-red-700 p-3 rounded-md text-center whitespace-pre-line">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-300 bg-green-900/20 border border-green-700 p-3 rounded-md text-center whitespace-pre-line">
          {success}
        </div>
      )}
    </div>
  );
}
