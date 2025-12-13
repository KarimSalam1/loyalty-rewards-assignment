import Statistics from "../../components/Statistics/Statistics";
import Card from "../../ui/Card";

export default function StatisticsPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Dashboard</h1>

      <Card>
        <Statistics />
      </Card>
    </div>
  );
}
