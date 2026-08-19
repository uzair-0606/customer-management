"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterEmployee = {
  id: string;
  name: string;
};

type EmailStatus =
  | "PENDING"
  | "SENT"
  | "FAILED";

type CustomerFiltersProps = {
  date: string;
  startDate: string;
  endDate: string;
  employee: string;
  emailStatus: EmailStatus | null | "";

  employees: FilterEmployee[];

  onDateChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onEmployeeChange: (value: string) => void;
  onEmailStatusChange: (
    value: EmailStatus | ""
  ) => void;

  onClear: () => void;
};

export default function CustomerFilters({
  date,
  startDate,
  endDate,
  employee,
  emailStatus,
  employees,
  onDateChange,
  onStartDateChange,
  onEndDateChange,
  onEmployeeChange,
  onEmailStatusChange,
  onClear,
}: CustomerFiltersProps) {
  /*
   * Convert null into an empty string.
   */
  const safeEmailStatus = emailStatus ?? "";

  return (
    <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Filters
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Filter customer records.
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Date */}
        <div className="space-y-2">
          <label
            htmlFor="date"
            className="text-sm font-medium text-slate-700"
          >
            Date
          </label>

          <Input
            id="date"
            type="date"
            value={date}
            onChange={(event) =>
              onDateChange(event.target.value)
            }
          />
        </div>

        {/* From */}
        <div className="space-y-2">
          <label
            htmlFor="start-date"
            className="text-sm font-medium text-slate-700"
          >
            From
          </label>

          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(event) =>
              onStartDateChange(event.target.value)
            }
          />
        </div>

        {/* To */}
        <div className="space-y-2">
          <label
            htmlFor="end-date"
            className="text-sm font-medium text-slate-700"
          >
            To
          </label>

          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(event) =>
              onEndDateChange(event.target.value)
            }
          />
        </div>

        {/* Employee */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Employee
          </label>

          <Select
            value={employee || "all"}
            onValueChange={(value) => {
              onEmployeeChange(
                value === null || value === "all"
                  ? ""
                  : value
              );
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Employees" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Employees
              </SelectItem>

              {employees.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Email Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Email Status
          </label>

          <Select
            value={safeEmailStatus || "all"}
            onValueChange={(value) => {
              if (
                value === "PENDING" ||
                value === "SENT" ||
                value === "FAILED"
              ) {
                onEmailStatusChange(value);
              } else {
                onEmailStatusChange("");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Statuses
              </SelectItem>

              <SelectItem value="PENDING">
                Pending
              </SelectItem>

              <SelectItem value="SENT">
                Sent
              </SelectItem>

              <SelectItem value="FAILED">
                Failed
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clear Filters */}
      <div className="mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onClear}
        >
          Clear Filters
        </Button>
      </div>
    </section>
  );
}