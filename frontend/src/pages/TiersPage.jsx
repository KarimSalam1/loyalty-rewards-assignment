import Card from "../ui/Card";

const tiers = [
  {
    name: "Bronze",
    minPoints: 0,
    multiplier: "1x",
    benefits: "Basic membership level.",
    accent: "text-amber-400 border-amber-500",
  },
  {
    name: "Silver",
    minPoints: 1000,
    multiplier: "1.2x",
    benefits: "Priority customer service.",
    accent: "text-gray-300 border-gray-400",
  },
  {
    name: "Gold",
    minPoints: 5000,
    multiplier: "1.5x",
    benefits: "Free upgrades and special rewards.",
    accent: "text-yellow-300 border-yellow-400",
  },
  {
    name: "Platinum",
    minPoints: 10000,
    multiplier: "2x",
    benefits: "VIP benefits and premium services.",
    accent: "text-purple-300 border-purple-500",
  },
];

export default function TiersPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 text-slate-100">
      <h1 className="text-3xl font-bold text-center">Loyalty Tiers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tiers.map((tier) => (
          <Card key={tier.name}>
            <div
              className={`p-5 rounded-xl border ${tier.accent} bg-slate-900/40 hover:bg-slate-900/60 transition`}
            >
              <h2
                className={`text-2xl font-semibold mb-3 ${
                  tier.accent.split(" ")[0]
                }`}
              >
                {tier.name}
              </h2>

              <p className="text-slate-300 mb-1">
                <span className="font-bold">Minimum Tier Points:</span>{" "}
                {tier.minPoints}
              </p>

              <p className="text-slate-300 mb-1">
                <span className="font-bold">Earn Multiplier:</span>{" "}
                {tier.multiplier}
              </p>

              <p className="text-slate-300">
                <span className="font-bold">Benefits:</span> {tier.benefits}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
