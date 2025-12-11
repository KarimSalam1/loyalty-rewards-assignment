import { useEffect, useState } from "react";
import { api } from "../api";
import { useReset } from "../context/reset/useReset";

export default function ViewAccount() {
  const [customerId, setCustomerId] = useState("");
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, resetAll } = useReset();

  const load = async () => {
    resetAll();
    resetFields();

    try {
      const res = await api.get(`/accounts/${customerId}`);
      setAccount(res.data);
      setSuccess(`Account loaded successfully for customer ${customerId}`);
    } catch (err) {
      const message = err.response?.data?.message || "Account not found.";
      setError(message);
    }
  };

  const resetFields = () => {
    setError("");
    setSuccess("");
    setAccount(null);
  };

  useEffect(() => {
    register(() => {
      resetFields();
    });
  }, []);

  return (
    <div className="space-y-4 text-slate-100">
      <h2 className="text-xl font-semibold text-center">View Account</h2>

      <input
        type="number"
        placeholder="Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded-md focus:outline-none focus:border-blue-500"
      />

      <button
        onClick={load}
        className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 cursor-pointer mx-auto block w-32 text-center"
      >
        Load
      </button>

      {account && (
        <div className="text-center space-y-1 text-slate-300">
          <p>Account#: {account.accountNumber}</p>
          <p>Tier: {account.tier}</p>
          <p>Balance: {account.currentBalance}</p>
          <p>Tier Points: {account.tierQualifyingPoints}</p>
        </div>
      )}

      {error && <p className="text-red-400 text-center">{error}</p>}
      {success && <p className="text-green-400 text-center">{success}</p>}
    </div>
  );
}
