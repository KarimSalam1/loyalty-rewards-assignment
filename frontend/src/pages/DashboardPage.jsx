import React from "react";

function DashboardPage() {
  const stats = {
    totalPointsIssued: 125000,
    totalPointsRedeemed: 38500,
    totalAccounts: 42,
    totalTiers: 4,
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
          <div className="text-sm text-slate-400">Total Points Issued</div>
          <div className="text-2xl font-bold text-emerald-400">
            {stats.totalPointsIssued.toLocaleString()}
          </div>
        </div>

        <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
          <div className="text-sm text-slate-400">Total Points Redeemed</div>
          <div className="text-2xl font-bold text-emerald-400">
            {stats.totalPointsRedeemed.toLocaleString()}
          </div>
        </div>

        <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
          <div className="text-sm text-slate-400">Accounts</div>
          <div className="text-2xl font-bold text-emerald-400">
            {stats.totalAccounts}
          </div>
        </div>

        <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
          <div className="text-sm text-slate-400">Tiers</div>
          <div className="text-2xl font-bold text-emerald-400">
            {stats.totalTiers}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="text-lg font-semibold mb-4">Recent Transactions</div>
        <div className="text-slate-400 text-sm">
          Transaction table will go here
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
