import EarnPoints from "../components/EarnPoints";
import RedeemPoints from "../components/RedeemPoints";
import ViewTransactions from "../components/ViewTransactions";
import Card from "../ui/Card";

export default function TransactionsPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center">Transactions</h1>
      <Card>
        <EarnPoints />
      </Card>
      <Card>
        <RedeemPoints />
      </Card>
      <Card>
        <ViewTransactions />
      </Card>
    </div>
  );
}
