import { useNavigate } from "react-router-dom";
import Card from "../../ui/Card";
import EarnPoints from "../../components/Transactions/EarnPoints";

export default function EarnPointsPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-md text-slate-400 hover:text-white cursor-pointer"
      >
        ← Back
      </button>

      <Card>
        <EarnPoints />
      </Card>
    </div>
  );
}
