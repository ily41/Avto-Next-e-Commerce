"use client";

import { useGetMyOrdersQuery } from "@/lib/store/order/orderApiSlice";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  ChevronRight,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCcw,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// ── Status Config ──────────────────────────────────────────────────────────────
const statusConfig = {
  Pending:         { icon: Clock,         color: "bg-zinc-100  text-zinc-600    border-zinc-200",   label: "Gözləmədə"  },
  PaymentInitiated:{ icon: RefreshCcw,    color: "bg-blue-50    text-blue-600    border-blue-100",   label: "Ödənişdə"   },
  Paid:            { icon: CheckCircle2,  color: "bg-blue-600   text-white       border-transparent",label: "Ödənilib"   },
  Processing:      { icon: RefreshCcw,    color: "bg-blue-50    text-blue-600    border-blue-100",   label: "Hazırlanır" },
  Shipped:         { icon: Truck,         color: "bg-amber-50   text-amber-600   border-amber-100",  label: "Yoldadır"   },
  Completed:       { icon: CheckCircle2,  color: "bg-emerald-50 text-emerald-600 border-emerald-100",label: "Tamamlandı" },
  Delivered:       { icon: CheckCircle2,  color: "bg-emerald-50 text-emerald-600 border-emerald-100",label: "Çatdırıldı" },
  Cancelled:       { icon: XCircle,       color: "bg-rose-50    text-rose-600    border-rose-100",   label: "Ləğv edildi"},
  Failed:          { icon: AlertTriangle, color: "bg-rose-50    text-rose-600    border-rose-100",   label: "Uğursuz"    },
} as const;

type StatusKey = keyof typeof statusConfig;

// ── Component ──────────────────────────────────────────────────────────────────
export function OrderList() {
  const { isAuth } = useAuth();
  const { data: orders, isLoading, error } = useGetMyOrdersQuery(undefined, {
    skip: !isAuth,
  });

  // ── Loading ──
  if (isLoading || !isAuth) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[88px] w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  // ── Error / Empty (no orders array) ──
  if (error || !orders) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-[#f2f2f2]">
        <div className="h-16 w-16 rounded-2xl bg-white border border-[#f2f2f2] flex items-center justify-center mb-4 shadow-sm">
          <Package className="h-8 w-8 text-gray-300" />
        </div>
        <p className="text-gray-600 font-bold text-sm">Sifariş tapılmadı.</p>
        <p className="text-gray-400 text-xs font-medium mt-1 mb-4">Hələ heç bir sifariş verməmisiniz.</p>
        <Button variant="ghost" asChild className="text-blue-600 font-bold text-xs">
          <Link href="/"><ShoppingBag className="h-4 w-4 mr-2" />Alış-verişə başla</Link>
        </Button>
      </div>
    );
  }

  // ── Zero orders ──
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-[#f2f2f2]">
        <div className="h-16 w-16 rounded-2xl bg-white border border-[#f2f2f2] flex items-center justify-center mb-4 shadow-sm">
          <ShoppingBag className="h-8 w-8 text-gray-300" />
        </div>
        <p className="text-gray-600 font-bold text-sm">Sifarişiniz yoxdur.</p>
        <p className="text-gray-400 text-xs font-medium mt-1 mb-4">Mağazamıza baş çəkin!</p>
        <Button variant="ghost" asChild className="text-blue-600 font-bold text-xs">
          <Link href="/"><ShoppingBag className="h-4 w-4 mr-2" />Alış-verişə başla</Link>
        </Button>
      </div>
    );
  }

  // ── Orders List ──
  return (
    <div className="space-y-3">
      {/* Header bar */}
      <div className="flex items-center justify-between px-1 mb-1">
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
          Sifarişləriniz
        </p>
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-400 border-[#f2f2f2] font-black uppercase text-[10px] tracking-wider"
        >
          {orders.length} ədəd
        </Badge>
      </div>

      {orders.map((order) => {
        const statusKey  = (order.status as StatusKey) in statusConfig ? (order.status as StatusKey) : "Pending";
        const cfg        = statusConfig[statusKey];
        const StatusIcon = cfg.icon;
        const itemCount  = order.items?.length ?? 0;

        return (
          <Link
            key={order.id}
            href={`/profile/orders/${order.id}`}
            className="group block"
          >
            <div className="bg-white border border-[#f2f2f2] rounded-2xl px-5 py-4 flex items-center justify-between gap-4 hover:border-blue-200 hover:shadow-sm transition-all">
              {/* Left: icon + info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-50 border border-[#f2f2f2] flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <Package className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                    Sifariş #{order.orderNumber}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 flex-wrap">
                    <span>{formatDate(order.createdAt)}</span>
                    <span>·</span>
                    <span>{itemCount} məhsul</span>
                  </div>
                </div>
              </div>

              {/* Right: amount + badge + arrow */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-base font-black text-gray-900 tracking-tight">
                    ₼{order.totalAmount.toFixed(2)}
                  </p>
                  <Badge
                    variant="outline"
                    className={`mt-1 text-[10px] font-black uppercase tracking-wider px-2 h-5 flex items-center gap-1 ${cfg.color}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {cfg.label}
                  </Badge>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
