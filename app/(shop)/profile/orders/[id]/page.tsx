"use client";
export const dynamic = "force-dynamic";

import { useGetOrderByIdQuery } from "@/lib/store/order/orderApiSlice";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  ShoppingBag,
  Truck,
  CreditCard,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Navigation2,
  Weight,
  Fingerprint,
  Hash,
  Building2,
  Home,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { AzerpostTrackingSection } from "@/components/order/AzerpostTrackingSection";

// ── Status config ──────────────────────────────────────────────────────────────
const statusConfig = {
  Pending:          { icon: Clock,         color: "bg-zinc-100  text-zinc-600    border-zinc-200",   label: "Gözləmədə"  },
  PaymentInitiated: { icon: RefreshCcw,    color: "bg-blue-50    text-blue-600    border-blue-100",   label: "Ödənişdə"   },
  Paid:             { icon: CheckCircle2,  color: "bg-blue-600   text-white       border-transparent",label: "Ödənilib"   },
  Processing:       { icon: RefreshCcw,    color: "bg-blue-50    text-blue-600    border-blue-100",   label: "Hazırlanır" },
  Shipped:          { icon: Truck,         color: "bg-amber-50   text-amber-600   border-amber-100",  label: "Yoldadır"   },
  Completed:        { icon: CheckCircle2,  color: "bg-emerald-50 text-emerald-600 border-emerald-100",label: "Tamamlandı" },
  Delivered:        { icon: CheckCircle2,  color: "bg-emerald-50 text-emerald-600 border-emerald-100",label: "Çatdırıldı" },
  Cancelled:        { icon: XCircle,       color: "bg-rose-50    text-rose-600    border-rose-100",   label: "Ləğv edildi"},
  Failed:           { icon: AlertTriangle, color: "bg-rose-50    text-rose-600    border-rose-100",   label: "Uğursuz"    },
} as const;
type StatusKey = keyof typeof statusConfig;

const deliveryTypeLabel: Record<number, { label: string; icon: React.ElementType }> = {
  0: { label: "Poçt şöbəsinə çatdırılma", icon: Building2 },
  1: { label: "Evə çatdırılma",            icon: Home      },
};

// ── Page ───────────────────────────────────────────────────────────────────────
export default function OrderDetailsPage() {
  const { id }   = useParams();
  const { data: order, isLoading, error } = useGetOrderByIdQuery(id as string);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-56 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-52 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-[#f2f2f2]">
        <Package className="h-12 w-12 text-gray-300 mb-4" />
        <p className="text-gray-700 font-bold text-base mb-1">Sifariş tapılmadı.</p>
        <p className="text-gray-400 text-sm mb-6">Bu sifariş mövcud deyil və ya sizə aid deyil.</p>
        <Button variant="ghost" asChild className="text-blue-600 font-bold">
          <Link href="/profile/orders">
            <ArrowLeft className="h-4 w-4 mr-2" /> Sifarişlərə qayıt
          </Link>
        </Button>
      </div>
    );
  }

  const statusKey  = (order.status as StatusKey) in statusConfig ? (order.status as StatusKey) : "Pending";
  const cfg        = statusConfig[statusKey];
  const StatusIcon = cfg.icon;
  const delivType  = order.deliveryType !== undefined ? deliveryTypeLabel[order.deliveryType] : null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-0">

      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-gray-100 bg-white border border-[#f2f2f2] shadow-sm shrink-0 h-11 w-11">
            <Link href="/profile/orders">
              <ArrowLeft className="h-5 w-5 text-gray-400" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
              Sifariş #{order.orderNumber}
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">
              {formatDate(order.createdAt, { month: "long", day: "numeric", year: "numeric" })} tarixində yerləşdirilib
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className={`h-10 px-6 text-[11px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 border-[#f2f2f2] shadow-sm ${cfg.color}`}
        >
          <StatusIcon className="h-4 w-4" />
          {cfg.label}
        </Badge>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left col (2/3) */}
        <div className="lg:col-span-2 space-y-8">

          {/* Order items */}
          <Card className="border-[#f2f2f2] shadow-sm rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="border-b border-[#f2f2f2] px-8 py-6">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Sifariş məhsulları ({order.items?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#f2f2f2]">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-6 px-8 py-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="h-16 w-16 shrink-0 bg-gray-50 rounded-2xl border border-[#f2f2f2] flex items-center justify-center text-gray-300">
                        <Package className="h-8 w-8" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-gray-900 text-base leading-snug line-clamp-1">{item.productName}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                          SAY: {item.quantity}
                          {item.productSku && <span className="text-gray-200">|</span>}
                          {item.productSku && `SKU: ${item.productSku}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-black text-gray-900">₼{item.unitPrice.toFixed(2)}</p>
                      <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">
                        Cəmi: ₼{item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery info */}
          <Card className="border-[#f2f2f2] shadow-sm rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="border-b border-[#f2f2f2] px-8 py-6">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Çatdırılma məlumatları
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Delivery type */}
                  {delivType && (
                    <InfoRow
                      icon={<delivType.icon className="h-4 w-4" />}
                      label="Çatdırılma növü"
                      value={delivType.label}
                    />
                  )}

                  {/* Post code */}
                  {order.deliveryPostCode && (
                    <InfoRow
                      icon={<Hash className="h-4 w-4" />}
                      label="Poçt kodu"
                      value={order.deliveryPostCode}
                      mono
                    />
                  )}

                  {/* Passport */}
                  {order.userPassport && (
                    <InfoRow
                      icon={<Fingerprint className="h-4 w-4" />}
                      label="Pasport"
                      value={order.userPassport}
                      mono
                    />
                  )}

                  {/* Weight */}
                  {order.packageWeight !== undefined && (
                    <InfoRow
                      icon={<Weight className="h-4 w-4" />}
                      label="Paket çəkisi"
                      value={`${order.packageWeight} kq`}
                    />
                  )}

                  {/* Fragile */}
                  {order.fragile !== undefined && (
                    <InfoRow
                      icon={<AlertTriangle className="h-4 w-4" />}
                      label="Kövrək məhsul"
                      value={order.fragile ? "Bəli" : "Xeyr"}
                      valueColor={order.fragile ? "text-orange-600" : "text-gray-900"}
                    />
                  )}
               </div>

              {/* Shipping address */}
              {order.shippingAddress && (
                <div className="pt-8 border-t border-[#f2f2f2]">
                  <InfoRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="Çatdırılma ünvanı"
                    value={order.shippingAddress}
                  />
                </div>
              )}

              <AzerpostTrackingSection order={order} />
            </CardContent>
          </Card>

          {/* Payment info */}
          <Card className="border-[#f2f2f2] shadow-sm rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="border-b border-[#f2f2f2] px-8 py-6">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Ödəniş məlumatları
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <InfoRow
                icon={<CreditCard className="h-4 w-4" />}
                label="Ödəniş üsulu"
                value={order.payment?.paymentMethod || "Birbaşa ödəniş"}
              />
              <InfoRow
                icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
                label="Status"
                value={order.payment?.status === "Success" ? "Uğurlu" : order.payment?.status || "—"}
                valueColor={order.payment?.status === "Success" ? "text-green-600" : "text-gray-900"}
              />
              {order.payment?.epointTransactionId && (
                <div className="sm:col-span-2 pt-6 border-t border-[#f2f2f2]">
                  <InfoRow
                    icon={<Hash className="h-4 w-4" />}
                    label="Tranzaksiya ID"
                    value={order.payment.epointTransactionId}
                    mono
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card className="border-[#f2f2f2] shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-[#f2f2f2] px-6 py-4">
                <CardTitle className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Sifariş qeydləri
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-gray-500 italic bg-gray-50 border border-[#f2f2f2] rounded-xl px-5 py-4">
                  "{order.notes}"
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right col (1/3): Summary */}
        <div className="space-y-8">
          
          {/* Price summary card */}
          <Card className="border-none shadow-2xl bg-blue-600 text-white rounded-[32px] overflow-hidden">
            <CardHeader className="border-b border-white/10 px-8 py-6">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-blue-100">
                Sifariş xülasəsi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <PriceLine label="Aralıq cəm" value={`₼${order.subTotal.toFixed(2)}`} />

                {order.discountAmount > 0 && (
                  <PriceLine
                    label={`Endirim${order.promoCode ? ` (${order.promoCode})` : ""}`}
                    value={`−₼${order.discountAmount.toFixed(2)}`}
                    accent
                  />
                )}

                {order.walletAmountUsed > 0 && (
                  <PriceLine label="Balansdan istifadə" value={`−₼${order.walletAmountUsed.toFixed(2)}`} accent />
                )}

                {order.installmentInterestAmount > 0 && (
                  <PriceLine label="Taksit faizi" value={`+₼${order.installmentInterestAmount.toFixed(2)}`} />
                )}
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Yekun ödəniş</p>
                <p className="text-4xl font-black tracking-tighter">₼{order.totalAmount.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Customer info */}
          <Card className="border-[#f2f2f2] shadow-sm rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="border-b border-[#f2f2f2] px-8 py-6">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <User className="h-4 w-4" />
                Müştəri məlumatları
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gray-50 border border-[#f2f2f2] flex items-center justify-center text-gray-400 shrink-0">
                  <User className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-gray-900 text-sm leading-none">{order.customerName}</p>
                  <p className="text-[11px] text-gray-400 font-bold mt-2 break-all uppercase tracking-tight">{order.customerEmail}</p>
                  <p className="text-[11px] text-gray-400 font-bold mt-1">{order.customerPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#f2f2f2] shadow-sm rounded-[32px] overflow-hidden bg-white">
            <CardContent className="p-8 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-gray-400 leading-relaxed uppercase tracking-tighter">
                Sualınız var? <Link href="/contact-us" className="text-blue-600 cursor-pointer hover:underline">Dəstək xidmətinə yazın</Link>
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

// ── Helper components ──────────────────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
  mono = false,
  className = "",
  valueColor = "text-gray-800",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
  valueColor?: string;
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="h-8 w-8 rounded-lg bg-gray-50 border border-[#f2f2f2] flex items-center justify-center text-gray-400 shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className={`text-sm font-bold mt-0.5 break-all leading-snug ${mono ? "font-mono" : ""} ${valueColor}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function PriceLine({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`flex justify-between text-sm font-bold ${accent ? "text-blue-200" : "text-blue-50/90"}`}>
      <span className="opacity-80">{label}</span>
      <span>{value}</span>
    </div>
  );
}
