"use client";

import { Order } from "@/lib/store/order/orderApiSlice";
import { ExternalLink, Truck, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AzerpostTrackingSectionProps {
  order: Order;
}

export function AzerpostTrackingSection({ order }: AzerpostTrackingSectionProps) {
  if (!order.azerpostOrderId) {
    // Only show if order is paid/processing to avoid confusing pending orders
    const isDispatching = ["Paid", "Processing", "Shipped"].includes(order.status);
    
    if (isDispatching) {
      return (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            📦 Bağlama Azerpost-a göndərilir...
          </span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Truck className="h-4 w-4" /> Azerpost İzləmə
        </h4>
        <Badge className="bg-indigo-600 text-white border-transparent text-[9px] font-black tracking-widest px-2 h-5 uppercase">
          Göndərildi
        </Badge>
      </div>
      
      <div className="flex flex-col gap-1">
        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tight">İzləmə nömrəsi:</p>
        <p className="text-sm font-black text-indigo-900 font-mono tracking-wider">
          {order.azerpostOrderId}
        </p>
      </div>

      <a
        href={`https://azerpost.az/tracking?id=${order.azerpostOrderId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest bg-white/50 px-4 py-2 rounded-xl border border-indigo-100"
      >
        Bağlamanı izlə <ExternalLink className="h-3 w-3" />
      </a>
      
      {order.azerpostStatus && (
        <div className="pt-3 border-t border-indigo-100 mt-2">
           <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Cari status:</p>
           <p className="text-[11px] font-bold text-indigo-700">{order.azerpostStatus}</p>
        </div>
      )}
    </div>
  );
}
