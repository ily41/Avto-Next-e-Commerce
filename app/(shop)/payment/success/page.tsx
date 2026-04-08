import { PaymentSuccessClient } from "@/components/payment/PaymentSuccessClient";
import { Suspense } from "react";
export const dynamic = 'force-dynamic';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div>Loading result...</div>}>
        <PaymentSuccessClient />
      </Suspense>
    </div>
  );
}
