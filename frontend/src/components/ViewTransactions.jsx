import { useState, useEffect } from "react";
import { api } from "../api";
import { useReset } from "../context/reset/useReset";

export default function ViewTransactions() {
  const [customerId, setCustomerId] = useState("");
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { register } = useReset();

  const loadTransactions = async (pageNumber = 1) => {
    setError("");
    setSuccess("");

    if (!customerId) {
      setError("Customer ID is required");
      return;
    }

    try {
      const res = await api.get("/transactions", {
        params: { customerId, page: pageNumber, limit: 5 },
      });

      setList(res.data.items);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);

      setSuccess(
        `Loaded ${res.data.items.length} transaction(s) on page ${res.data.page}.`
      );
    } catch (err) {
      setList([]);
      setError(err.response?.data?.message || "Could not load transactions");
    }
  };

  useEffect(() => {
    register(() => {
      setCustomerId("");
      setList([]);
      setError("");
      setSuccess("");
      setPage(1);
      setTotalPages(1);
    });
  }, []);

  return (
    <div className="space-y-4 text-slate-100">
      <h2 className="text-xl font-semibold text-center">Transaction History</h2>

      <input
        type="number"
        placeholder="Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded-md focus:outline-none focus:border-blue-500"
      />

      <button
        onClick={() => loadTransactions(1)}
        className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 cursor-pointer mx-auto block w-48 text-center"
      >
        Load Transactions
      </button>

      {error && (
        <p className="text-red-400 text-center whitespace-pre-line">{error}</p>
      )}
      {success && (
        <p className="text-green-400 text-center whitespace-pre-line">
          {success}
        </p>
      )}

      <div className="mt-4 space-y-2">
        {list.length === 0 && !error && (
          <p className="text-slate-400 text-center">No transactions found.</p>
        )}

        {list.map((tx) => (
          <div
            key={tx._id}
            className="bg-slate-800 border border-slate-700 p-3 rounded-md flex justify-between"
          >
            <div className="space-y-1">
              <p className="text-slate-200">
                <strong>{tx.type}</strong> – {tx.category}
              </p>

              <p className="text-sm text-slate-400">
                {new Date(tx.transactionDate).toLocaleString()}
              </p>

              {tx.batchId && (
                <p className="text-xs text-purple-400">Batch: {tx.batchId}</p>
              )}

              <p className="text-xs text-slate-300">
                Processed: {tx.posted ? "Yes" : "No"}
              </p>
            </div>

            <p
              className={`text-lg font-bold ${
                tx.type === "EARN" ? "text-green-400" : "text-red-400"
              }`}
            >
              {tx.points}
            </p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4 text-slate-200">
          <button
            disabled={page <= 1}
            onClick={() => loadTransactions(page - 1)}
            className={`px-3 py-1 rounded-md ${
              page <= 1
                ? "bg-slate-700 opacity-40 cursor-not-allowed"
                : "bg-slate-700 hover:bg-slate-600 cursor-pointer"
            }`}
          >
            Prev
          </button>

          <span>
            Page <strong>{page}</strong> / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => loadTransactions(page + 1)}
            className={`px-3 py-1 rounded-md ${
              page >= totalPages
                ? "bg-slate-700 opacity-40 cursor-not-allowed"
                : "bg-slate-700 hover:bg-slate-600 cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
