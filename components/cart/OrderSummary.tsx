"use client";

import { Button } from "@/components/ui/button";
import { PromoSection } from "./PromoSection";
import { Cart, CartItem } from "@/lib/store/cart/cartApiSlice";
import Link from "next/link";

interface OrderSummaryProps {
  isAuth: boolean;
  guestCart?: CartItem[];
  serverCart?: Cart;
  onApplyPromo: (code: string) => Promise<void>;
  onRemovePromo: () => Promise<void>;
}

export function OrderSummary({
  isAuth,
  guestCart = [],
  serverCart,
  onApplyPromo,
  onRemovePromo,
}: OrderSummaryProps) {
  // If authenticated, use server values strictly
  const subTotal = isAuth ? serverCart?.subTotal || 0 : guestCart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const totalDiscount = isAuth ? serverCart?.totalDiscount || 0 : 0; // Guest promo calculation not viable without API
  const finalAmount = isAuth ? serverCart?.finalAmount || 0 : subTotal; // Math matches: subTotal - totalDiscount. Since discount = 0 for guest, final = subTotal.
  const appliedPromo = isAuth ? serverCart?.appliedPromoCode || null : null; // Guest promo not supported without backend

  return (
    <div className="bg-gray-50 rounded-xl p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900">${subTotal.toFixed(2)}</span>
        </div>

        {totalDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount (Promo)</span>
            <span className="font-semibold">-${totalDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 mt-4 flex justify-between">
          <span className="text-base font-bold text-gray-900">Total Amount</span>
          <span className="text-xl font-bold text-gray-900">${finalAmount.toFixed(2)}</span>
        </div>
      </div>

      {isAuth ? (
        <PromoSection 
          appliedPromoCode={appliedPromo} 
          onApply={onApplyPromo} 
          onRemove={onRemovePromo} 
        />
      ) : (
        <div className="mt-6 text-sm text-gray-500 bg-white p-3 rounded-md border border-gray-200">
          Log in with your account to apply promo codes.
        </div>
      )}

      <Link href="/checkout" className="w-full block mt-6">
        <Button className="w-full bg-[#1a1a1a] hover:bg-blue-600 text-white font-bold py-6 rounded-lg transition-colors">
          Proceed to Checkout
        </Button>
      </Link>
    </div>
  );
}
