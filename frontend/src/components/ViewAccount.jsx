import { useState } from "react";
import { api } from "../api";

export default function ViewAccount() {
  const [customerId, setCustomerId] = useState("");
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setSuccess("");
    setError("");
    setAccount(null);

    try {
      const res = await api.get(`/accounts/${customerId}`);
      setAccount(res.data);
      setSuccess(`Account loaded successfully for customer ${customerId}`);
    } catch (err) {
      const message = err.response?.data?.message || "Account not found.";
      setError(message);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-2">View Account</h2>

      <input
        type="number"
        placeholder="Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      <button
        onClick={load}
        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
      >
        Load
      </button>

      {account && (
        <div className="mt-3 space-y-1">
          <p>Account#: {account.accountNumber}</p>
          <p>Tier: {account.tier}</p>
          <p>Balance: {account.currentBalance}</p>
          <p>Tier Points: {account.tierQualifyingPoints}</p>
        </div>
      )}
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
}
