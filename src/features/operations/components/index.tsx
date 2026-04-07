"use client";
import React from 'react';

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { paths } from "@/config/paths";
import { OperationsKpi } from "./operations-kpi";
import { ActiveIncidentsTable } from "./active-incidents-table";

export function OperationsDashboard() {
  return (
    <div className="flex-1 p-8 bg-background">
      {/* Breadcrumb — sits directly below the header navbar */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root.getHref()}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Operations</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface">Operations Dashboard</h1>
        <p className="text-sm text-on-surface-variant text-slate-500">Real-time infrastructure and service health monitoring</p>
      </div>

      <OperationsKpi />

      <ActiveIncidentsTable />
      
      <footer className="mt-8 py-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">© 2024 ION NETWORK INTELLIGENCE SYSTEM • ENTERPRISE GRADE OPERATIONS</p>
      </footer>
    </div>
  );
}
