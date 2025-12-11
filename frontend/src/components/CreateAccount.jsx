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
      console.log(err);
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
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-2">Create Account</h2>

      <input
        type="number"
        placeholder="Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="w-full border p-2 rounded mb-2"
      />

      <button
        onClick={create}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        Create
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}

      {result && (
        <p className="text-gray-700 mt-2">
          Account Number: {result.accountNumber}
        </p>
      )}
    </div>
  );
}
