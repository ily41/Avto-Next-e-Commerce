"use client";
export const dynamic = 'force-dynamic';

import { useGetOrderByIdQuery } from "@/lib/store/order/orderApiSlice";
import { useParams } from "next/navigation";
import { ArrowLeft, Package, User, MapPin, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

const statusConfig = {
  Pending: { label: "Gözləmədə" },
  Processing: { label: "Hazırlanır" },
  Shipped: { label: "Yoldadır" },
  Completed: { label: "Tamamlandı" },
  Cancelled: { label: "Ləğv edildi" },
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { data: order, isLoading, error } = useGetOrderByIdQuery(id as string);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-[#f2f2f2]">
        <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p className="text-gray-600 font-bold">Sifariş tapılmadı.</p>
        <Button variant="ghost" asChild className="mt-4 text-blue-600 font-bold">
          <Link href="/profile/orders">Sifarişlərə qayıt</Link>
        </Button>
      </div>
    );
  }

  const statusLabel = statusConfig[order.status as keyof typeof statusConfig]?.label || order.status;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-gray-100">
            <Link href="/profile/orders">
              <ArrowLeft className="h-5 w-5 text-gray-400" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Sifariş #{order.orderNumber}</h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
              {formatDate(order.createdAt, { month: 'long', day: 'numeric', year: 'numeric' })} tarixində yerləşdirilib
            </p>
          </div>
        </div>
        <Badge className="bg-blue-600 text-white hover:bg-blue-700 h-9 px-6 text-[11px] font-black uppercase tracking-widest rounded-xl shadow-sm border-none">
          {statusLabel}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <Card className="border-[#f2f2f2] shadow-sm overflow-hidden rounded-2xl">
            <CardHeader className="bg-gray-50/50 border-b border-[#f2f2f2] px-6 py-4">
              <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> Sifariş daxilindəki məhsullar ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#f2f2f2]">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-[#f2f2f2]">
                        <Package className="h-8 w-8" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.productName}</h4>
                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Say: {item.quantity}</div>
                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Artikul: {item.productSku || "Yoxdur"}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-gray-900">${item.unitPrice.toFixed(2)}</div>
                      <div className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">Cəmi: ${item.totalPrice.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="border-[#f2f2f2] shadow-sm overflow-hidden rounded-2xl">
            <CardHeader className="bg-gray-50/50 border-b border-[#f2f2f2] px-6 py-4">
              <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                Ödəniş məlumatları
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Üsul</p>
                  <p className="text-sm font-bold text-gray-800 uppercase tracking-tight">{order.payment.paymentMethod || "Birbaşa ödəniş"}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Status</p>
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-tight">{order.payment.status === "Success" ? "Uğurlu" : order.payment.status}</p>
                </div>
                {order.payment.epointTransactionId && (
                  <div className="col-span-2 space-y-1 pt-6 border-t border-[#f2f2f2]">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Tranzaksiya ID</p>
                    <p className="text-xs font-mono text-gray-400 break-all">{order.payment.epointTransactionId}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Summary */}
          <Card className="border-none shadow-xl bg-blue-600 text-white overflow-hidden rounded-3xl relative">
            <CardHeader className="border-b border-blue-500/30 px-8 py-6 relative z-10">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-blue-100">Sifariş xülasəsi</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-5 relative z-10">
              <div className="flex justify-between text-sm text-blue-50 font-bold">
                <span className="opacity-80">Məbləğ</span>
                <span>${order.subTotal.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-white font-bold bg-white/10 p-2 rounded-lg">
                  <span>Endirim ({order.promoCode})</span>
                  <span>-${order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              {order.walletAmountUsed > 0 && (
                <div className="flex justify-between text-sm text-white font-bold border-t border-blue-500/30 pt-4">
                  <span>Balansdan istifadə</span>
                  <span>-${order.walletAmountUsed.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-6 border-t border-blue-400/30 flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Yekun ödəniş</span>
                <span className="text-4xl font-black tracking-tighter">${order.totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
            {/* Design accents */}
            <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          </Card>

          {/* Details */}
          <Card className="border-[#f2f2f2] shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-[#f2f2f2] px-6 py-4">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-gray-400">Müştəri məlumatları</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-gray-50 border border-[#f2f2f2] flex items-center justify-center text-gray-400">
                    <User className="h-5 w-5" />
                </div>
                <div className="space-y-1 mt-0.5">
                    <p className="text-sm font-bold text-gray-900 leading-none">{order.customerName}</p>
                    <p className="text-[11px] text-gray-400 font-bold tracking-tight mt-1">{order.customerEmail}</p>
                    <p className="text-[11px] text-gray-400 font-bold tracking-tight">{order.customerPhone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 pt-6 border-t border-[#f2f2f2]">
                <div className="h-10 w-10 rounded-xl bg-gray-50 border border-[#f2f2f2] flex items-center justify-center text-gray-400">
                    <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1 mt-0.5">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Çatdırılma ünvanı</p>
                    <p className="text-[11px] text-gray-600 font-bold leading-relaxed">{order.shippingAddress || "Ünvan qeyd edilməyib"}</p>
                </div>
              </div>

              {order.notes && (
                <div className="pt-6 border-t border-[#f2f2f2]">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-2">Sifariş qeydləri</p>
                  <p className="text-xs text-gray-500 italic bg-gray-50 p-4 rounded-xl border border-[#f2f2f2]">"{order.notes}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
