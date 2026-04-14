"use client";

export const dynamic = "force-dynamic";

import { OrderList } from "@/components/order/OrderList";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="rounded-full hover:bg-gray-100 shrink-0"
        >
          <Link href="/profile">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-500" />
            Sifarişlərim
          </h1>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
            Bütün sifariş tarixçəniz
          </p>
        </div>
      </div>

      {/* List card */}
      <div className="bg-white rounded-2xl border border-[#f2f2f2] p-6 shadow-sm">
        <OrderList />
      </div>
    </div>
  );
}
