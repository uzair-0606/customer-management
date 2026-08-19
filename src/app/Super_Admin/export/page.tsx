"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/layout/sidebar";
import ExportPanel from "@/components/export/exportpanel";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { Customer } from "@/types/customer";

type ExportData = {
  totalCustomers: number;
  allCustomers: Customer[];
  filteredCustomers: Customer[];
  activeFilters: string[];
};

export default function ExportPage() {
  const router = useRouter();

  const [exportData, setExportData] =
    useState<ExportData | null>(null);

  useEffect(() => {
    try {
      const storedData =
        sessionStorage.getItem(
          "customerExportData"
        );

      if (!storedData) {
        router.push(
          "/Super_Admin/customers"
        );
        return;
      }

      const parsedData =
        JSON.parse(storedData);

      setExportData(parsedData);
    } catch (error) {
      console.error(
        "Failed to load export data:",
        error
      );

      router.push(
        "/Super_Admin/customers"
      );
    }
  }, [router]);

  if (!exportData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <main className="ml-64 p-8">
          <Card className="space-y-4 p-10">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 p-8">

        {/* Header */}
        <header className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Super Admin
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Export
          </h1>

          <p className="mt-2 text-slate-500">
            Export customer records and generate reports.
          </p>
        </header>

        {/* Export Panel */}
        <ExportPanel
          totalCustomers={
            exportData.totalCustomers
          }

          allCustomers={
            exportData.allCustomers
          }

          filteredCustomers={
            exportData.filteredCustomers
          }

          activeFilters={
            exportData.activeFilters
          }
        />

      </main>
    </div>
  );
}