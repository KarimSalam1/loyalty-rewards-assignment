import { useState, useEffect } from "react";
import { useReset } from "../../context/reset/useReset";
import { useLoading } from "../../context/loading/useLoading";
import { api } from "../../api";

export default function ViewTransactions() {
  const [customerId, setCustomerId] = useState("");
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { register } = useReset();
  const { setLoading } = useLoading();

  const loadTransactions = async (pageNumber = 1) => {
    setError("");
    setSuccess("");

    if (!customerId) {
      setError("Customer ID is required");
      return;
    }

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
    <div className="space-y-6 text-slate-100">
      <h2 className="text-xl font-semibold text-center">Transaction History</h2>

      <div className="space-y-1">
        <label className="text-sm text-slate-300">Customer ID</label>
        <input
          type="number"
          placeholder="Enter customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>

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

      <div className="mt-4 space-y-3">
        {list.length === 0 && !error && (
          <p className="text-slate-400 text-center">No transactions found.</p>
        )}

        {list.map((tx) => (
          <div
            key={tx._id}
            className="bg-slate-900/60 border border-slate-800 p-4 rounded-md flex justify-between items-center"
          >
            <div className="space-y-1">
              <p className="text-slate-200 font-medium">
                <span
                  className={`font-bold ${
                    tx.type === "EARN" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {tx.type}
                </span>{" "}
                · {tx.category}
              </p>

              <p className="text-xs text-slate-400">
                {new Date(tx.transactionDate).toLocaleString()}
              </p>

              {tx.batchId && (
                <p className="text-xs text-purple-400">Batch: {tx.batchId}</p>
              )}

              <p className="text-xs text-slate-400">
                Posted:{" "}
                <span className={tx.posted ? "text-green-400" : "text-red-400"}>
                  {tx.posted ? "Yes" : "No"}
                </span>
              </p>
            </div>

            <p
              className={`text-xl font-bold ${
                tx.type === "EARN" ? "text-green-400" : "text-red-400"
              }`}
            >
              {tx.points}
            </p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-6 text-slate-200">
          <button
            disabled={page <= 1}
            onClick={() => loadTransactions(page - 1)}
            className={`px-4 py-2 rounded-md transition ${
              page <= 1
                ? "bg-slate-700 opacity-40 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700 cursor-pointer"
            }`}
          >
            Prev
          </button>

          <span className="text-sm tracking-wide">
            Page <strong>{page}</strong> / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => loadTransactions(page + 1)}
            className={`px-4 py-2 rounded-md transition ${
              page >= totalPages
                ? "bg-slate-700 opacity-40 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700 cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
