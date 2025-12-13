import { useNavigate } from "react-router-dom";
import Card from "../../ui/Card";
import ViewTransactions from "../../components/Transactions/ViewTransactions";

export default function ViewTransactionsPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-md text-slate-400 hover:text-white cursor-pointer"
      >
        ← Back
      </button>

      <Card>
        <ViewTransactions />
      </Card>
    </div>
  );
}
