import { useEffect, useState } from "react";
import { api } from "../../api";
import { useLoading } from "../../context/loading/useLoading";

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const { setLoading } = useLoading();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/dashboard");
        setStats(res.data);
      } catch (err) {
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (error) {
    return <p className="text-red-400 text-center">{error}</p>;
  }

  if (!stats) {
    return <p className="text-slate-400 text-center">Loading statistics...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-100">
      <StatCard title="Total Accounts" value={stats.accounts.total} />

      <StatCard title="Points Earned" value={stats.points.earned} />

      <StatCard title="Points Redeemed" value={stats.points.redeemed} />

      <StatCard title="Outstanding Points" value={stats.points.outstanding} />

      <StatCard title="Total Transactions" value={stats.transactions.total} />

      <StatCard
        title="Pending Transactions"
        value={stats.transactions.pending}
      />

      <StatCard
        title="Last Batch Run"
        value={
          stats.batch.lastRun
            ? new Date(stats.batch.lastRun).toLocaleString()
            : "Never"
        }
      />
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4 space-y-1">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-semibold text-emerald-400">{value}</p>
    </div>
  );
}
