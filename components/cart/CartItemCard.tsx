"use client";

import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/lib/store/cart/cartApiSlice";
import { fullUrl } from "@/lib/api/url-utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (cartItemId: string, productId: string, quantity: number) => void;
  onRemove: (cartItemId: string, productId: string) => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const imageUrl = item.product?.primaryImageUrl || item.product?.imageUrl || item.productImageUrl;
  const fullImageUrl = imageUrl ? fullUrl(imageUrl) : "/logos/logo3.svg";
  const unitPrice = item.unitPrice || item.product?.discountedPrice || item.product?.price || 0;

  const [isRemoving, setIsRemoving] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const [isQuantityUpdating, setIsQuantityUpdating] = useState(false);

  // Sync local quantity with item.quantity if it changes from the server
  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  // Debounce API update
  useEffect(() => {
    if (localQuantity === item.quantity) return;

    const handler = setTimeout(async () => {
      try {
        setIsQuantityUpdating(true);
        await onUpdateQuantity(item.id, item.productId, localQuantity);
      } catch (error: any) {
        setLocalQuantity(item.quantity);
        toast.error(error?.data || error?.message || "Kəmiyyəti yeniləmək mümkün olmadı");
      } finally {
        setIsQuantityUpdating(false);
      }
    }, 450);

    return () => clearTimeout(handler);
  }, [localQuantity, item.quantity, item.id, item.productId, onUpdateQuantity]);

  const handleDecrease = () => {
    if (localQuantity > 1) {
      setLocalQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    setLocalQuantity((prev) => prev + 1);
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(item.id, item.productId);
    setIsRemoving(false);
  };

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b border-gray-100 ${isRemoving ? "opacity-50 pointer-events-none" : "opacity-100"} transition-opacity`}>
      <Link href={`/product/${item.productSlug || item.product?.slug || item.productId}`} className="shrink-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 flex items-center justify-center rounded-md border border-gray-100 relative">
          <Image
            src={fullImageUrl}
            alt={item.productName || "Məhsul"}
            fill
            className="object-contain p-2"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/product/${item.productSlug || item.product?.slug || item.productId}`}>
          <h4 className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
            {item.productName}
          </h4>
        </Link>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.productDescription}</p>
        {item.productSku && <p className="text-xs text-gray-400 mt-0.5">SKU: {item.productSku}</p>}

        <div className="mt-2 text-sm font-bold text-gray-900">
          ₼{unitPrice.toFixed(2)}
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0 gap-4">
        {/* Quantity Controls */}
        <div className="flex items-center border border-gray-200 rounded-md bg-white overflow-hidden">
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            onClick={handleDecrease}
            disabled={localQuantity <= 1 || isQuantityUpdating}
          >
            <Minus size={14} />
          </button>
          <span className="w-8 h-8 flex items-center justify-center text-sm font-medium border-l border-r border-gray-200 text-black">
            {isQuantityUpdating ? (
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-black animate-spin" />
            ) : (
              localQuantity
            )}
          </span>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            onClick={handleIncrease}
            disabled={isQuantityUpdating}
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={handleRemove}
          className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors self-end sm:self-auto"
          aria-label="Sil"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
