"use client";

import { useGetMyOrdersQuery } from "@/lib/store/order/orderApiSlice";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ChevronRight, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";

const statusConfig = {
  Pending: { icon: Clock, className: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Gözləmədə" },
  Processing: { icon: Package, className: "bg-blue-50 text-blue-700 border-blue-200", label: "Hazırlanır" },
  Shipped: { icon: Truck, className: "bg-indigo-50 text-indigo-700 border-indigo-200", label: "Yoldadır" },
  Completed: { icon: CheckCircle, className: "bg-green-50 text-green-700 border-green-200", label: "Tamamlandı" },
  Cancelled: { icon: XCircle, className: "bg-red-50 text-red-700 border-red-200", label: "Ləğv edildi" },
};

export function OrderList() {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error || !orders) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-[#f2f2f2]">
        <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p className="text-gray-600 font-bold">Sifariş tapılmadı.</p>
        <Button variant="ghost" asChild className="mt-4 text-blue-600 font-bold">
          <Link href="/">Mağazaya qayıt</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Sifarişləriniz</h3>
        <Badge variant="outline" className="bg-gray-50 text-gray-500 border-[#f2f2f2] font-black uppercase text-[10px]">
          {orders.length} CƏMİ
        </Badge>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-[#f2f2f2]">
          <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-600 font-bold">Hələ heç bir sifariş verməmisiniz.</p>
          <Button variant="ghost" asChild className="mt-4 text-blue-600 font-bold">
            <Link href="/">Alış-verişə başla</Link>
          </Button>
        </div>
      ) : (
        orders.map((order) => {
          const status = (order.status as keyof typeof statusConfig) || "Pending";
          const Config = statusConfig[status] || statusConfig.Pending;

          return (
            <Link key={order.id} href={`/profile/orders/${order.id}`}>
              <Card className="hover:border-blue-200 transition-all border-[#f2f2f2] shadow-sm mb-4 rounded-xl group">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-[#f2f2f2] group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Sifariş #{order.orderNumber}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-black uppercase tracking-wider mt-1">
                          <span>{formatDate(order.createdAt)}</span>
                          <span>•</span>
                          <span>{order.items.length} məhsul</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10">
                      <div className="text-right">
                        <div className="text-lg font-black text-gray-900 tracking-tight">${order.totalAmount.toFixed(2)}</div>
                        <Badge variant="outline" className={`mt-1 h-5 px-1.5 text-[10px] font-black uppercase tracking-widest ${Config.className}`}>
                          <Config.icon className="mr-1 h-3 w-3" /> {Config.label}
                        </Badge>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })
      )}
    </div>
  );
}
