"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PromoSection } from "./PromoSection";
import { Cart, CartItem } from "@/lib/store/cart/cartApiSlice";
import { CheckoutModal } from "@/components/checkout/CheckoutClient";
import { InstallmentModal } from "@/components/checkout/InstallmentModal";
import { useGetWalletQuery } from "@/lib/store/wallet/walletApiSlice";
import { useGetCartMinimumAmountQuery } from "@/lib/store/settings/apislice";
import { useGetInstallmentConfigurationQuery } from "@/lib/store/installment/installmentApiSlice";
import { toast } from "sonner";
import { ShoppingCart, Lock, AlertCircle } from "lucide-react";
import { IconCreditCard } from "@tabler/icons-react";

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
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInstallmentOpen, setIsInstallmentOpen] = useState(false);

  // Minimum order amount check
  const { data: minAmountData } = useGetCartMinimumAmountQuery();
  const minAmount = minAmountData?.minimumAmount ?? 0;

  // Installment configuration check
  const { data: instConfig } = useGetInstallmentConfigurationQuery();

  // Pull wallet balance for authenticated users so the modal can offer wallet usage
  const { data: wallet } = useGetWalletQuery(undefined, { skip: !isAuth });

  const subTotal     = isAuth ? serverCart?.subTotal      || 0 : guestCart.reduce((s, i) => s + (i.totalPrice || 0), 0);
  const totalDiscount = isAuth ? serverCart?.totalDiscount || 0 : 0;
  const finalAmount  = isAuth ? serverCart?.finalAmount   || 0 : subTotal;
  const appliedPromo = isAuth ? serverCart?.appliedPromoCode || null : null;

  return (
    <>
      <div className="bg-gray-50 rounded-2xl p-6 lg:sticky lg:top-24 border border-[#f2f2f2]">
        <h2 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.18em] mb-6 flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-blue-500" />
          Sifariş xülasəsi
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-500 font-medium">
            <span>Aralıq cəm</span>
            <span className="font-bold text-gray-900">₼{subTotal.toFixed(2)}</span>
          </div>

          {totalDiscount > 0 && (
            <div className="flex justify-between text-green-600 font-bold">
              <span>Endirim (Promo)</span>
              <span>−₼{totalDiscount.toFixed(2)}</span>
            </div>
          )}

          {isAuth && wallet && wallet.balance > 0 && (
            <div className="flex justify-between text-blue-500 font-medium text-xs">
              <span>Mövcud balans</span>
              <span className="font-bold">₼{wallet.balance.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="pt-4 mt-6 border-t border-gray-200">
          <div className="flex justify-between items-end">
            <span className="text-base font-black text-gray-900">Yekun məbləğ</span>
            <span className="text-2xl font-black text-gray-900 tracking-tight">₼{finalAmount.toFixed(2)}</span>
          </div>
          
          {finalAmount < minAmount && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-[11px] font-bold text-red-600 leading-tight">
                Minimum sifariş məbləği ${minAmount.toFixed(2)} AZN olmalıdır. Çatışmayan: ${(minAmount - finalAmount).toFixed(2)} AZN.
              </p>
            </div>
          )}
        </div>

        {isAuth ? (
          <PromoSection
            appliedPromoCode={appliedPromo}
            onApply={onApplyPromo}
            onRemove={onRemovePromo}
          />
        ) : (
          <div className="mt-5 text-sm text-gray-500 bg-white p-3 rounded-xl border border-[#f2f2f2] text-center">
            Promo kodu tətbiq etmək üçün <span className="font-bold text-blue-600">daxil olun</span>.
          </div>
        )}

        <div className="flex flex-col gap-3 mt-6">
          <Button
            className={`w-full font-black py-6 rounded-xl transition-all flex items-center gap-2 justify-center ${
              finalAmount < minAmount 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200" 
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
            }`}
            onClick={() => {
              if (finalAmount < minAmount) {
                toast.error(`Minimum sifariş məbləği ${minAmount.toFixed(2)} AZN olmalıdır.`);
                return;
              }
              setIsCheckoutOpen(true);
            }}
          >
            <Lock className="h-4 w-4" />
            Sifarişi tamamlayın
          </Button>

          {instConfig?.isEnabled && finalAmount >= instConfig.minimumAmount && (
            <Button
              variant="outline"
              className="w-full font-black py-6 rounded-xl border-2 border-blue-600 text-blue-700 hover:bg-white hover:border-blue-700 bg-white shadow-sm flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              onClick={() => {
                setIsInstallmentOpen(true);
              }}
            >
              <IconCreditCard className="h-5 w-5" />
              <span>Hissəli ödənişlə al</span>
            </Button>
          )}
        </div>

        <p className="text-[10px] text-gray-400 text-center mt-3 font-medium">
          SSL ilə qorunan ödəniş
        </p>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalAmount={finalAmount}
        walletBalance={wallet?.balance ?? 0}
      />

      <InstallmentModal 
        isOpen={isInstallmentOpen}
        onClose={() => setIsInstallmentOpen(false)}
        totalAmount={finalAmount}
      />
    </>
  );
}
