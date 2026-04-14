"use client";

import { useSearchParams } from "next/navigation";
import { useGetPaymentErrorQuery } from "@/lib/store/payment/paymentApiSlice";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCcw, ShoppingCart, ArrowLeft, AlertTriangle } from "lucide-react";

export function PaymentErrorClient() {
  const searchParams = useSearchParams();
  const order_id = searchParams.get("order_id") || "";
  const transaction_id = searchParams.get("transaction_id") || "";
  const messageParam = searchParams.get("message") || "";

  const { data, isLoading, error } = useGetPaymentErrorQuery(
    { order_id, transaction_id, message: messageParam },
    { skip: !order_id || !transaction_id }
  );

  return (
    <div className="relative bg-white p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 max-w-lg w-full text-center overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-40 w-40 bg-red-50 rounded-full blur-3xl opacity-60" />
      
      <div className="relative z-10">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-200">
            <XCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Ödəniş uğursuz oldu</h1>
        <p className="text-gray-500 mb-10 font-medium">
          {messageParam || "Təəssüf ki, ödəniş zamanı xəta baş verdi. Xahiş edirik daxil etdiyiniz məlumatları yoxlayıb yenidən cəhd edin."}
        </p>
        
        <div className="bg-red-50/50 backdrop-blur-sm p-6 rounded-2xl text-left border border-red-100 mb-10 transition-all">
          <div className="flex justify-between mb-4 pb-4 border-b border-red-100">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Sifariş ID</span>
              <span className="font-bold text-gray-900 font-mono text-sm">{order_id || "Yüklənir..."}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Tranzaksiya</span>
              <span className="font-bold text-gray-900 font-mono text-sm truncate max-w-[140px]">{transaction_id || "..."}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest">
            <AlertTriangle className="h-3 w-3" />
            Əməliyyat rədd edildi
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/cart" className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-7 rounded-2xl shadow-lg shadow-blue-100 transition-all hover:translate-y-[-2px]">
              Səbətə qayıt <ShoppingCart className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/shop" className="flex-1">
            <Button variant="outline" className="w-full border-gray-200 text-gray-700 font-black py-7 rounded-2xl hover:bg-gray-50 transition-all">
              Alış-verişə davam
            </Button>
          </Link>
        </div>
        
        <p className="mt-8 text-xs text-gray-400 font-medium">
          Dəstək üçün bizimlə əlaqə saxlaya bilərsiniz.
        </p>
      </div>
    </div>
  );
}
