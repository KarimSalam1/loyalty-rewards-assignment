import { useNavigate } from "react-router-dom";
import Card from "../../ui/Card";

export default function AccountsHomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Accounts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card onClick={() => navigate("/accounts/create")}>
          <button
            onClick={() => navigate("/accounts/create")}
            className="w-full text-left space-y-2 cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-emerald-400 cursor-pointer">
              ➕ Create Account
            </h2>
            <p className="text-sm text-slate-400 cursor-pointer">
              Create a new loyalty account for a customer
            </p>
          </button>
        </Card>

        <Card onClick={() => navigate("/accounts/view")}>
          <button
            onClick={() => navigate("/accounts/view")}
            className="w-full text-left space-y-2 cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-blue-400 cursor-pointer">
              🔍 View Account
            </h2>
            <p className="text-sm text-slate-400 cursor-pointer">
              View balance, tier, and account details
            </p>
          </button>
        </Card>
      </div>
    </div>
  );
}
