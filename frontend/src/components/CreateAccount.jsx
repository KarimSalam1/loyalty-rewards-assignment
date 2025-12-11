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
      setError(err.response.data?.message);
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
    <div className="space-y-4 text-slate-100">
      <h2 className="text-xl font-semibold text-center">Create Account</h2>

      <input
        type="number"
        placeholder="Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded-md focus:outline-none focus:border-blue-500"
      />

      <button
        onClick={create}
        className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 cursor-pointer mx-auto block w-32 text-center"
      >
        Create
      </button>

      {error && <p className="text-red-400 text-center">{error}</p>}
      {success && <p className="text-green-400 text-center">{success}</p>}

      {result && (
        <p className="text-slate-300 text-center">
          Account Number: {result.accountNumber}
        </p>
      )}
    </div>
  );
}
