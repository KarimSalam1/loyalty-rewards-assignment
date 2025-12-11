import { useState, useEffect } from "react";
import { api } from "../api";
import { useReset } from "../context/reset/useReset";

export default function CreateAccount() {
  const [customerId, setCustomerId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, resetAll } = useReset();

  const create = async () => {
    resetFields();
    resetAll();

    try {
      const res = await api.post("/accounts", {
        customerId: Number(customerId),
      });

      setResult(res.data);
      setSuccess("Account created successfully!");
    } catch (err) {
      setResult(null);
      setError(err.response?.data?.message || "Unable to create account.");
    }
  };

  const resetFields = () => {
    setResult(null);
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    register(() => {
      resetFields();
    });
  }, []);

  return (
    <div className="space-y-6 text-slate-100">
      <h2 className="text-xl font-semibold text-center">Create Account</h2>

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
        onClick={create}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer mx-auto block w-40 text-center"
      >
        Create Account
      </button>

      {error && <p className="text-red-400 text-center">{error}</p>}
      {success && <p className="text-green-400 text-center">{success}</p>}

      {result && (
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-md text-center">
          <p className="text-slate-300 text-sm">Account Number</p>
          <p className="text-lg font-semibold text-emerald-400">
            {result.accountNumber}
          </p>
        </div>
      )}
    </div>
  );
}
