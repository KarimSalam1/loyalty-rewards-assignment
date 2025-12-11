import BatchPost from "../components/BatchPost";
import Card from "../ui/Card";

export default function BatchPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center">Batch Processing</h1>

      <Card>
        <BatchPost />
      </Card>
    </div>
  );
}
