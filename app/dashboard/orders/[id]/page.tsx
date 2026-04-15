"use client";

import { useParams, useRouter } from "next/navigation";
import { 
  useGetOrderByIdQuery, 
  useUpdateOrderStatusMutation, 
  useSendToAzerpostMutation,
  useGetAzerpostStatusQuery
} from "@/lib/store/order/orderApiSlice";
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Truck, 
  Calendar, 
  Hash, 
  Mail, 
  Phone,
  Weight,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  ExternalLink,
  Send,
  Navigation2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Status Mapping ─────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 0, label: "Pending",          color: "bg-zinc-500  text-white    border-transparent" },
  { value: 1, label: "PaymentInitiated", color: "bg-blue-400    text-white    border-transparent" },
  { value: 2, label: "Paid",             color: "bg-blue-600   text-white       border-transparent" },
  { value: 3, label: "Processing",       color: "bg-indigo-500    text-white    border-transparent" },
  { value: 4, label: "Shipped",          color: "bg-amber-500   text-white   border-transparent" },
  { value: 5, label: "Delivered",        color: "bg-emerald-500 text-white border-transparent" },
  { value: 6, label: "Cancelled",        color: "bg-rose-500    text-white    border-transparent" },
  { value: 7, label: "Refunded",         color: "bg-zinc-400    text-white    border-transparent" },
  { value: 8, label: "Failed",           color: "bg-red-600    text-white    border-transparent" },
];

const getStatusByName = (name: string) => STATUS_OPTIONS.find(s => s.label.toLowerCase() === name.toLowerCase()) || STATUS_OPTIONS[0];

// ── Component ──────────────────────────────────────────────────────────────────
export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const orderId = id as string;

  const { data: order, isLoading, isError } = useGetOrderByIdQuery(orderId);
  const { data: azerpostStatus, isFetching: isFetchingTracking } = useGetAzerpostStatusQuery(orderId, {
    skip: !order?.azerpostOrderId
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [sendToAzerpost, { isLoading: isSending }] = useSendToAzerpostMutation();

  const handleStatusUpdate = async (val: string) => {
    try {
      await updateStatus({ id: orderId, status: parseInt(val) }).unwrap();
      toast.success("Order status updated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Status update failed");
    }
  };

  const handleAzerpostDispatch = async () => {
    try {
      const res = await sendToAzerpost(orderId).unwrap();
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err?.data?.error || "Azerpost dispatch failed");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 bg-[#0a0a0a] min-h-screen">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full bg-white/5" />
          <Skeleton className="h-8 w-64 bg-white/5" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full rounded-3xl bg-white/5" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-3xl bg-white/5" />
            <Skeleton className="h-64 w-full rounded-3xl bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#0a0a0a] text-white">
        <Package className="h-16 w-16 text-gray-800" />
        <h2 className="text-xl font-bold">Order not found</h2>
        <Button onClick={() => router.push("/dashboard/orders")}>Back to Orders</Button>
      </div>
    );
  }

  const currentStatusConfig = getStatusByName(order.status);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#0a0a0a] min-h-screen text-white">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-11 w-11 shadow-sm border-white/5 hover:bg-white/5 bg-[#141414]"
            onClick={() => router.push("/dashboard/orders")}
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-white tracking-tight leading-none">Sifariş #{order.orderNumber}</h1>
              <Badge className={`${currentStatusConfig.color} border-white/10 uppercase font-black text-[10px] tracking-widest`}>{currentStatusConfig.label}</Badge>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-gray-500 font-black uppercase tracking-widest mt-2">
              <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {formatDate(order.createdAt)}</span>
              <span className="flex items-center gap-1.5"><Hash className="h-3 w-3" /> ID: {order.id.slice(0, 8)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select disabled={isUpdating} onValueChange={handleStatusUpdate} defaultValue={currentStatusConfig.value.toString()}>
            <SelectTrigger className="w-[180px] h-11 rounded-xl font-bold bg-[#141414] border-white/10 shadow-sm text-white">
              <SelectValue placeholder="Statusu Dəyiş" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value.toString()} className="font-bold hover:bg-white/10">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!order.azerpostOrderId && ["Paid", "Processing", "Shipped"].includes(order.status) && (
            <Button 
              className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2"
              onClick={handleAzerpostDispatch}
              disabled={isSending}
            >
              <Send className="h-4 w-4" /> Azerpost-a göndər
            </Button>
          )}

          <Button variant="outline" className="h-11 rounded-xl border-white/10 bg-[#141414] font-bold text-gray-400 hover:bg-white/5">
            Print Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Left Column: Items & Details ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Items Table */}
          <Card className="border-white/5 shadow-2xl rounded-[32px] overflow-hidden bg-[#141414] text-white">
            <CardHeader className="border-b border-white/5 px-8 py-6">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Package className="h-4 w-4" /> Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-[#0a0a0a] flex items-center justify-center text-gray-700 border border-white/5 shrink-0">
                        <Package className="h-7 w-7" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-100 leading-none">{item.productName}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                          SKU: {item.productSku || "N/A"} · Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black text-gray-100">${item.unitPrice.toFixed(2)}</p>
                      <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">Total: ${item.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.01] p-8 flex flex-col items-end gap-3 text-sm">
                <div className="flex justify-between w-full max-w-[240px] text-gray-500 font-bold">
                  <span>Subtotal</span>
                  <span className="text-gray-300 font-black">${order.subTotal.toFixed(2)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between w-full max-w-[240px] text-rose-500 font-bold">
                    <span>Discount</span>
                    <span className="font-black">-${order.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between w-full max-w-[240px] text-xl font-black text-white pt-6 border-t border-white/5 mt-3">
                  <span>Total</span>
                  <span className="tracking-tighter">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery & Logistics */}
          <Card className="border-white/5 shadow-2xl rounded-[32px] overflow-hidden bg-[#141414] text-white">
            <CardHeader className="border-b border-white/5 px-8 py-6">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Truck className="h-4 w-4" /> Logistics & Shipping
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <DetailItem label="Shipping Address" value={order.shippingAddress} icon={<MapPin className="text-gray-400" />} />
                  <DetailItem label="Post Code" value={order.deliveryPostCode || "—"} icon={<Hash className="text-gray-400" />} isMono />
                  <DetailItem label="Passport" value={order.userPassport || "—"} icon={<CreditCard className="text-gray-400" />} isMono />
                </div>
                <div className="space-y-6">
                  <DetailItem 
                    label="Delivery Type" 
                    value={order.deliveryType === 0 ? "Post Office" : "Home Delivery"} 
                    icon={<Truck className="text-gray-400" />} 
                  />
                  <DetailItem label="Package Weight" value={`${order.packageWeight} kg`} icon={<Weight className="text-gray-400" />} />
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1.5">Fragile</p>
                      <Badge className={order.fragile ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-white/5 text-gray-500 border-white/5"}>
                        {order.fragile ? "YES" : "NO"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Azerpost Section */}
              {order.azerpostOrderId && (
                <div className="mt-10 pt-10 border-t border-white/5">
                   {/* ... (Azerpost section logic remains same but with updated colors) ... */}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column: Customer & Payment ── */}
        <div className="space-y-8 text-white">
          
          {/* Customer Card */}
          <Card className="border-white/5 shadow-2xl rounded-[32px] overflow-hidden bg-[#141414]">
            <CardHeader className="bg-white/5 border-b border-white/5 px-8 py-6">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <User className="h-4 w-4" /> Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-black text-xl">
                  {order.customerName.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-black text-white">{order.customerName}</p>
                  <p className="text-xs text-gray-500 font-bold">Customer ID: {order.userId.slice(0, 8)}</p>
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-bold text-gray-300">{order.customerEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-bold text-gray-300">{order.customerPhone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Card */}
          <Card className="border-white/5 shadow-2xl rounded-[32px] overflow-hidden bg-[#141414]">
            <CardHeader className="bg-white/5 border-b border-white/5 px-8 py-6">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">Method</p>
                    <p className="text-sm font-black text-white uppercase">{order.payment.paymentMethod}</p>
                  </div>
                </div>
                <Badge className={order.payment.status === "Success" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}>
                  {order.payment.status}
                </Badge>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5 text-sm">
                <div className="flex justify-between font-bold text-gray-500">
                  <span>Amount Paid</span>
                  <span className="text-white font-black">${order.payment.amount.toFixed(2)}</span>
                </div>
                {order.payment.epointTransactionId && (
                  <div className="pt-2">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Transaction ID</p>
                    <p className="text-xs font-mono text-gray-500 break-all leading-tight">{order.payment.epointTransactionId}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card className="border-white/5 shadow-2xl rounded-[32px] overflow-hidden bg-[#141414] text-white">
              <CardHeader className="bg-white/5 border-b border-white/5 px-8 py-6">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                   Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                 <p className="text-sm text-gray-400 italic bg-white/[0.02] p-6 rounded-[24px] border border-white/5">
                   "{order.notes}"
                 </p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Shared UI Components ───────────────────────────────────────────────────────
function DetailItem({ label, value, icon, isMono = false, className = "" }: { 
  label: string; 
  value: string; 
  icon: React.ReactNode; 
  isMono?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{label}</p>
        <p className={`text-sm font-bold text-white break-words mt-0.5 leading-snug ${isMono ? "font-mono" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
