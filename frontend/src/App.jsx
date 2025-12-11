import BatchPost from "./components/BatchPost";
import CreateAccount from "./components/CreateAccount";
import EarnPoints from "./components/EarnPoints";
import RedeemPoints from "./components/RedeemPoints";
import ViewAccount from "./components/ViewAccount";
import ViewTransactions from "./components/ViewTransactions";

export default function App() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center">
        Loyalty Rewards Dashboard
      </h1>

      <CreateAccount />
      <ViewAccount />
      <EarnPoints />
      <RedeemPoints />
      <BatchPost />
      <ViewTransactions />
    </div>
  );
}
