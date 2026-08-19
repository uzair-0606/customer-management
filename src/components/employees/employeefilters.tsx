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

type EmployeeFiltersProps = {
  status: string;
  role: string;
  startDate: string;
  endDate: string;

  onStatusChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;

  onClear: () => void;
};

export default function EmployeeFilters({
  status,
  role,
  startDate,
  endDate,
  onStatusChange,
  onRoleChange,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: EmployeeFiltersProps) {
  return (
    <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Filters
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Filter employees by status, role, and joined date.
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Status */}
        <div className="space-y-2">
          <label
            htmlFor="employee-status"
            className="text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <Select
            value={status || "all"}
            onValueChange={(value) => {
              onStatusChange(
                value === null || value === "all"
                  ? ""
                  : value
              );
            }}
          >
            <SelectTrigger id="employee-status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Statuses
              </SelectItem>

              <SelectItem value="ACTIVE">
                Active
              </SelectItem>

              <SelectItem value="INACTIVE">
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label
            htmlFor="employee-role"
            className="text-sm font-medium text-slate-700"
          >
            Role
          </label>

          <Select
            value={role || "all"}
            onValueChange={(value) => {
              onRoleChange(
                value === null || value === "all"
                  ? ""
                  : value
              );
            }}
          >
            <SelectTrigger id="employee-role">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Roles
              </SelectItem>

              <SelectItem value="EMPLOYEE">
                Employee
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Joined From */}
        <div className="space-y-2">
          <label
            htmlFor="employee-start-date"
            className="text-sm font-medium text-slate-700"
          >
            Joined From
          </label>

          <Input
            id="employee-start-date"
            type="date"
            value={startDate}
            onChange={(event) =>
              onStartDateChange(event.target.value)
            }
          />
        </div>

        {/* Joined To */}
        <div className="space-y-2">
          <label
            htmlFor="employee-end-date"
            className="text-sm font-medium text-slate-700"
          >
            Joined To
          </label>

          <Input
            id="employee-end-date"
            type="date"
            value={endDate}
            onChange={(event) =>
              onEndDateChange(event.target.value)
            }
          />
        </div>
      </div>

      {/* Clear */}
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