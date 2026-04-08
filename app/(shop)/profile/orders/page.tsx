"use client";

import { OrderList } from "@/components/order/OrderList";
export const dynamic = 'force-dynamic';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-gray-100">
          <Link href="/profile">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Sifarişlərim</h1>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Sifarişlərinizin tarixçəsi</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#f2f2f2] p-8 shadow-sm">
        <OrderList />
      </div>
    </div>
  );
}
