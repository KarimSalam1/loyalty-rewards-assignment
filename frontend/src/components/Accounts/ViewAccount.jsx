import { useEffect, useState } from "react";
import { api } from "../../api";
import { useReset } from "../../context/reset/useReset";
import { useLoading } from "../../context/loading/useLoading";

export default function ViewAccount() {
  const [customerId, setCustomerId] = useState("");
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, resetAll } = useReset();
  const { setLoading } = useLoading();

  const load = async () => {
    resetAll();
    resetFields();

    try {
      setLoading(true);
      const res = await api.get(`/accounts/${customerId}`);
      setAccount(res.data);
      setSuccess(`Account loaded successfully for customer ${customerId}`);
    } catch (err) {
      const message = err.response?.data?.message || "Account not found.";
      setError(message);
    } finally {
      setLoading(false);
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
    <div className="space-y-6 text-slate-100">
      <h2 className="text-xl font-semibold text-center">View Account</h2>

      <div className="space-y-1">
        <label className="text-sm text-slate-300">Customer ID</label>
        <input
          type="number"
          placeholder="Enter customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded-md 
                   focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        onClick={load}
        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 
                 cursor-pointer mx-auto block w-40 text-center"
      >
        Load Account
      </button>

      {error && <p className="text-red-400 text-center">{error}</p>}
      {success && <p className="text-green-400 text-center">{success}</p>}

      {account && (
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-2 text-center mt-4">
          <div>
            <p className="text-xs text-slate-400">Account Number</p>
            <p className="text-lg font-semibold text-emerald-400">
              {account.accountNumber}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Tier</p>
            <p className="text-base font-semibold text-slate-200">
              {account.tier}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Balance</p>
            <p className="text-xl font-bold text-slate-100">
              {account.currentBalance}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Tier Qualifying Points</p>
            <p className="text-base font-semibold text-slate-200">
              {account.tierQualifyingPoints}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
