"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PromoSectionProps {
  appliedPromoCode: string | null;
  onApply: (code: string) => Promise<void>;
  onRemove: () => Promise<void>;
  disabled?: boolean;
}

export function PromoSection({ appliedPromoCode, onApply, onRemove, disabled }: PromoSectionProps) {
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!promoCode.trim()) return;
    setLoading(true);
    try {
      await onApply(promoCode.trim());
    } catch (error: any) {
      toast.error(error?.data?.error || error?.message || "Failed to apply promo code");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await onRemove();
      setPromoCode("");
    } catch (error: any) {
      toast.error(error?.data?.error || error?.data || error?.message || "Failed to remove promo code");
    } finally {
      setLoading(false);
    }
  };

  if (appliedPromoCode) {
    return (
      <div className="mt-6 flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="text-sm">
          <span className="text-green-700 font-medium">Applied Promo:</span>
          <span className="ml-2 font-bold text-gray-800 block sm:inline">{appliedPromoCode}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleRemove}
          disabled={loading || disabled}
        >
          Remove
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Promo Code</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter discount code"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
          disabled={loading || disabled}
        />
        <Button
          onClick={handleApply}
          disabled={loading || disabled || !promoCode.trim()}
          className="bg-gray-900 hover:bg-blue-600 text-white transition-colors"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
