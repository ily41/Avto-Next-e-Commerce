import { PaymentErrorClient } from "@/components/payment/PaymentErrorClient";
import { Suspense } from "react";
export const dynamic = 'force-dynamic';

export default function PaymentErrorPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div>Loading result...</div>}>
         <PaymentErrorClient />
      </Suspense>
    </div>
  );
}
