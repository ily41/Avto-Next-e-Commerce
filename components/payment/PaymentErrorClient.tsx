"use client";

import { useSearchParams } from "next/navigation";
import { useGetPaymentErrorQuery } from "@/lib/store/payment/paymentApiSlice";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

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
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-10 h-10 text-red-500" />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
      <p className="text-gray-500 mb-6">{messageParam || "Unfortunately, your payment could not be processed."}</p>
      
      <div className="bg-gray-50 p-4 rounded-lg text-left text-sm mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Order ID:</span>
          <span className="font-semibold">{order_id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Transaction:</span>
          <span className="font-semibold">{transaction_id}</span>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <Link href="/cart" className="flex-1">
          <Button variant="outline" className="w-full">
            Return to Cart
          </Button>
        </Link>
        <Link href="/checkout" className="flex-1">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Try Again
          </Button>
        </Link>
      </div>
    </div>
  );
}
