import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const employees = [
  { name: "Employee 01", email: "employee01@example.com", status: "Active" },
  { name: "Employee 02", email: "employee02@example.com", status: "Active" },
];

export default function RecentEmployees() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Recent Employees
        </CardTitle>
        <CardDescription>Recently added employee accounts.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {employees.map((employee, index) => (
          <div key={employee.email}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">{employee.name}</p>
                <p className="text-sm text-slate-500">{employee.email}</p>
              </div>

              <Badge className="bg-green-50 text-green-600 hover:bg-green-50">
                {employee.status}
              </Badge>
            </div>

            {index < employees.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
