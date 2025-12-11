import { useState } from "react";
import { api } from "../api";

export default function ViewTransactions() {
  const [customerId, setCustomerId] = useState("");
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setSuccess("");
    setError("");
    setList([]);

    try {
      const res = await api.get(`/transactions?customerId=${customerId}`);
      setList(res.data);
      setSuccess(
        `Loaded ${res.data.length} transactions for customer ${customerId}`
      );
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-2">Transaction History</h2>

      <input
        placeholder="Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      <button
        onClick={load}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer"
      >
        Load
      </button>

      <div className="mt-4 space-y-3">
        {list.map((tx) => (
          <div key={tx._id} className="border p-3 rounded bg-gray-50 shadow-sm">
            <p>Type: {tx.type}</p>
            <p>Category: {tx.category}</p>
            <p>Points: {tx.points}</p>
            <p>Posted: {tx.posted ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
}
