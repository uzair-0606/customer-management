import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: number;
};

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <Card className="gap-2 py-5">
      <CardHeader className="gap-1 px-5">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl font-bold text-slate-900">
          {value.toLocaleString()}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
