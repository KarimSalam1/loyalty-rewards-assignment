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
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-2">Transaction History</h2>

      <input
        type="number"
        placeholder="Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      <button
        onClick={() => loadTransactions(1)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        Load Transactions
      </button>

      {error && (
        <p className="text-red-600 mt-2 whitespace-pre-line">{error}</p>
      )}
      {success && (
        <p className="text-green-600 mt-2 whitespace-pre-line">{success}</p>
      )}

      <div className="mt-4">
        {list.length === 0 && !error && (
          <p className="text-gray-500">No transactions found.</p>
        )}

        {list.map((tx) => (
          <div
            key={tx._id}
            className="border p-3 rounded mb-2 bg-gray-50 flex justify-between"
          >
            <div>
              <p>
                <strong>{tx.type}</strong> – {tx.category}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(tx.transactionDate).toLocaleString()}
              </p>
              {tx.batchId && (
                <p className="text-xs text-purple-600">Batch: {tx.batchId}</p>
              )}

              <p className="text-xs text-black-600">
                Processed: {tx.posted ? "Yes" : "No"}
              </p>
            </div>

            <p
              className={`font-bold ${
                tx.type === "EARN" ? "text-green-600" : "text-red-600"
              }`}
            >
              {tx.points}
            </p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-4 mt-4">
          <button
            disabled={page <= 1}
            onClick={() => loadTransactions(page - 1)}
            className={`px-3 py-1 rounded  ${
              page <= 1
                ? "bg-gray-300 cursor-not-allowed "
                : "bg-gray-500 text-white cursor-pointer "
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
            className={`px-3 py-1 rounded ${
              page >= totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-500 text-white cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
