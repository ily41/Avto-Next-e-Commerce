"use client";

import { AdminOrdersTable } from "@/components/dashboard/orders/AdminOrdersTable";
import { Package } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-table-dark table thead tr {
          border-bottom: 1px solid var(--border) !important;
          background: var(--muted) !important;
        }
        .admin-table-dark table thead th {
          color: var(--muted-foreground) !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          font-size: 10px !important;
        }
        .admin-table-dark table tbody tr {
          border-bottom: 1px solid var(--border) !important;
          background: transparent !important;
        }
        .admin-table-dark table tbody tr:hover {
          background: var(--accent) !important;
        }
        .admin-table-dark table td {
          color: var(--foreground) !important;
        }
        .admin-table-dark .rounded-md.border {
          border-color: var(--border) !important;
        }
      `}} />
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Package className="h-8 w-8 text-blue-500" />
          Orders Management
        </h1>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest leading-none">
          View and manage customer orders, statuses and delivery
        </p>
      </div>

      <div className="bg-card rounded-[24px] border shadow-xl p-6">
        <AdminOrdersTable />
      </div>
    </div>
  );
}
