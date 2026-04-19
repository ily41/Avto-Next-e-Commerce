"use client";

import { CreditRequestsTable } from "@/components/dashboard/credit-requests/CreditRequestsTable";
import { Fingerprint } from "lucide-react";

export default function CreditRequestsPage() {
  return (
    <div className="p-6 space-y-6 bg-[#0a0a0a] min-h-screen text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-table-dark table thead tr {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          background: rgba(255, 255, 255, 0.02) !important;
        }
        .admin-table-dark table thead th {
          color: #6b7280 !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          font-size: 10px !important;
        }
        .admin-table-dark table tbody tr {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          background: transparent !important;
        }
        .admin-table-dark table tbody tr:hover {
          background: rgba(255, 255, 255, 0.03) !important;
        }
        .admin-table-dark table td {
          color: #e5e7eb !important;
        }
        .admin-table-dark .rounded-md.border {
          border-color: rgba(255, 255, 255, 0.05) !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}} />
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Fingerprint className="h-8 w-8 text-green-500" />
          Kredit Müraciətləri
        </h1>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-none">
          Tək şəxsiyyət vəsiqəsi ilə edilən ödəniş müraciətlərini idarə edin
        </p>
      </div>

      <div className="bg-[#141414] rounded-[24px] border border-white/5 shadow-xl p-6">
        <CreditRequestsTable />
      </div>
    </div>
  );
}
