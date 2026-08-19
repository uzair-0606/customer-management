import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const stats = [
  { label: "Email Sent", value: 80, color: "bg-blue-600" },
  { label: "Pending", value: 15, color: "bg-yellow-500" },
  { label: "Failed", value: 5, color: "bg-red-500" },
];

export default function CustomerStatistics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Customer Statistics
        </CardTitle>
        <CardDescription>Overview of customer records.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-slate-600">{stat.label}</span>
              <span className="text-sm font-medium">{stat.value}%</span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div
                className={`h-2 rounded-full ${stat.color}`}
                style={{ width: `${stat.value}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
