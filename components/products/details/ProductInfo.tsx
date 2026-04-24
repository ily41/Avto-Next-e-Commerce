"use client";

import * as React from "react";
import { useState } from "react";
import { useToggleFavoriteMutation } from "@/lib/store/favorites/apislice";
import {
  IconHeart,
  IconShare,
  IconShoppingCart,
  IconMinus,
  IconPlus,
  IconHeartFilled,
  IconCreditCard,
  IconCheck,
} from "@tabler/icons-react";
import { Product } from "@/lib/api/types";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { calculateBestInstallment } from "@/lib/installmentUtils";
import { useAuth } from "@/hooks/useAuth";
import { LoginPopup } from "@/components/ownUI/loginPopup";


interface ProductInfoProps {
  product: Product;
  discount: number;
}

export default function ProductInfo({ product, discount }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [toggleFavorite] = useToggleFavoriteMutation();
  const { isAuth } = useAuth();
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);



  const handleFavoriteClick = async () => {
    if (!isAuth) return;
    try {
      await toggleFavorite(product.id).unwrap();
    } catch (err) {
      console.error("Wishlist sync failed:", err);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addItem(product, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (err: any) {
      // Error is handled by the useCart hook
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.shortDescription || product.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link kopyalandı!");
      }
    } catch (err) {
      console.error("Paylaşım zamanı xəta:", err);
    }
  };

  const unitPrice = product.discountedPrice || product.price;
  const totalPrice = unitPrice * quantity;
  
  const installment = calculateBestInstallment(unitPrice);
  const maxPeriod = installment?.month || 0;
  const monthlyPayment = installment?.monthlyPayment ? (parseFloat(installment.monthlyPayment) * quantity).toFixed(2) : null;

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex flex-col gap-2">
        <span className="text-[12px] md:text-[14px] text-blue-600 font-bold uppercase tracking-widest">{product.categoryName || product.brandName}</span>
        <h1 className="text-[24px] md:text-[32px] font-bold text-gray-900 leading-tight">{product.name}</h1>
      </div>

      <div className="flex items-center gap-4">
        {discount > 0 && <span className="text-[18px] md:text-[22px] text-gray-400 line-through decoration-gray-300 font-medium">₼{product.price.toFixed(2)}</span>}
        <span className="text-[28px] md:text-[36px] font-bold text-[#1a1a1a]">₼{(product.discountedPrice || product.price).toFixed(2)}</span>
        {discount > 0 && <span className="bg-red-50 text-red-600 text-[12px] font-bold px-2 py-1 rounded-md">-{discount}% ENDİRİM</span>}
      </div>

      <div className="text-[14px] leading-relaxed text-gray-600 border-b border-gray-100 pb-6 line-clamp-4">
        {product.description || product.shortDescription || "Məhsul haqqında ətraflı məlumat yoxdur."}
      </div>

      <div className="flex flex-col gap-6 mt-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center border border-gray-200 rounded-lg h-12 shadow-sm bg-white">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"><IconMinus size={16} /></button>
            <span className="w-10 text-center font-bold text-gray-900 text-[15px]">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-full flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"><IconPlus size={16} /></button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex-1 h-12 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg cursor-pointer ${isAdded ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-black text-white'
              }`}
          >
            {isAdded ? (
              <>
                <IconCheck size={20} className="animate-in zoom-in duration-300" />
                <span>Əlavə edildi</span>
              </>
            ) : (
              <>
                <IconShoppingCart size={20} className="transition-transform group-hover:scale-110" />
                <span>Səbətə at</span>
              </>
            )}
          </button>
        </div>
{/* 
        <button className="w-full h-12 bg-black hover:bg-blue-600 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_12px_24px_rgba(0,0,0,0.12)] group cursor-pointer">
          <IconCreditCard size={20} className="transition-transform group-hover:scale-110" />
          <span>İndi al</span>
        </button> */}

        {maxPeriod > 0 && (
          <button 
            className="w-full h-12 bg-white border-2 border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            onClick={async () => {
              await handleAddToCart();
              window.location.href = "/cart";
            }}
          >
            <IconCreditCard size={20} className="transition-transform group-hover:scale-110" />
            <span>Hissəli ödəniş ({monthlyPayment} ₼ x {maxPeriod} ay)</span>
          </button>
        )}

        <div className="flex items-center gap-8 justify-center mt-2 border-t border-gray-50 pt-4">
          {isAuth ? (
            <button
              onClick={handleFavoriteClick}
              className={`flex items-center gap-2 text-[13px] font-bold transition-all duration-300 uppercase tracking-tight cursor-pointer ${product.isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-blue-600"}`}
            >
              {product.isFavorite ? <IconHeartFilled size={18} /> : <IconHeart size={18} />} İstək siyahısı
            </button>
          ) : (
            <LoginPopup>
              <button
                className="flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-blue-600 transition-all duration-300 uppercase tracking-tight cursor-pointer"
              >
                <IconHeart size={18} /> İstək siyahısı
              </button>
            </LoginPopup>
          )}
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-tight cursor-pointer"
          >
            <IconShare size={18} /> Paylaş
          </button>
        </div>
      </div>
    </div>
  );
}
