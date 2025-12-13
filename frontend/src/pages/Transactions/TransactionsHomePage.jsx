import { useNavigate } from "react-router-dom";
import Card from "../../ui/Card";

export default function TransactionsHomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Transactions</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card onClick={() => navigate("/transactions/earn")}>
          <button
            onClick={() => navigate("/transactions/earn")}
            className="w-full text-left space-y-2 cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-green-400 cursor-pointer">
              ➕ Earn Points
            </h2>
            <p className="text-sm text-slate-400 cursor-pointer">
              Add loyalty points for a customer
            </p>
          </button>
        </Card>

        <Card onClick={() => navigate("/transactions/redeem")}>
          <button
            onClick={() => navigate("/transactions/redeem")}
            className="w-full text-left space-y-2 cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-red-400 cursor-pointer">
              ➖ Redeem Points
            </h2>
            <p className="text-sm text-slate-400 cursor-pointer">
              Redeem points using FIFO logic
            </p>
          </button>
        </Card>

        <Card onClick={() => navigate("/transactions/history")}>
          <button
            onClick={() => navigate("/transactions/history")}
            className="w-full text-left space-y-2 cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-blue-400 cursor-pointer">
              📄 Transaction History
            </h2>
            <p className="text-sm text-slate-400 cursor-pointer">
              View all transactions for a customer
            </p>
          </button>
        </Card>
      </div>
    </div>
  );
}
