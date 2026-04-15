"use client";

import * as React from "react";
import { Product } from "@/lib/api/types";
import { useToggleFavoriteMutation } from "@/lib/store/favorites/apislice";
import { IconHeart, IconChartBar, IconEye, IconShoppingCart, IconHeartFilled } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fullUrl } from "@/lib/api/url-utils";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useGetInstallmentConfigurationQuery, useGetInstallmentOptionsQuery } from "@/lib/store/installment/installmentApiSlice";

interface ProductCardProps {
    product: Product;
    noBorder?: boolean;
}

const ProductCard = ({ product, noBorder }: ProductCardProps) => {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    const [toggleFavorite] = useToggleFavoriteMutation();
    const { addItem } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    // Installment logic
    const { data: instConfig } = useGetInstallmentConfigurationQuery();
    const productPrice = product.discountedPrice || product.price;
    const { data: instOptions } = useGetInstallmentOptionsQuery(
        { amount: productPrice },
        { skip: !instConfig?.isEnabled || productPrice < instConfig?.minimumAmount }
    );

    const maxPeriod = instOptions 
        ? Math.max(...instOptions.filter(o => o.isActive).map(o => o.installmentPeriod), 0) 
        : 0;
    
    const monthlyPayment = maxPeriod > 0 ? (productPrice / maxPeriod).toFixed(2) : null;

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await toggleFavorite(product.id).unwrap();
        } catch (err) {
            console.error("Favorite toggle failed:", err);
        }
    };
    const handleCardClick = (e: React.MouseEvent) => {
        // Only navigate if the click was on the card itself or its text, not on a button
        const target = e.target as HTMLElement;
        if (!target.closest("button") && !target.closest("a")) {
            router.push(`/product/${product.slug || product.id}`);
        }
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await addItem(product, 1);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        } catch (err: any) {
            // Error is handled by the useCart hook
        }
    };

    const PLACEHOLDER_IMAGE = "/logos/logo3.svg";
    const fullPrimaryUrl = fullUrl(product.primaryImageUrl || product.imageUrl);
    const secondaryImgPath = product.detailImageUrl || (product.images && product.images.length > 1 ? product.images[1].imageUrl : null);
    const fullSecondaryUrl = secondaryImgPath ? fullUrl(secondaryImgPath) : null;

    const discount = (product.discountedPrice && product.price > product.discountedPrice)
        ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
        : 0;

    return (
        <div
            className={`group relative bg-white ${noBorder ? " rounded-lg" : "border border-[#f2f2f2] "} p-4 pb-3 flex flex-col h-full transition-all duration-300 overflow-hidden cursor-pointer`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
        >
            {/* Discount Badge */}
            {discount > 0 && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] b-badge font-bold px-1.5 py-0.5 rounded-sm z-10 transition-transform duration-300 group-hover:scale-110">
                    -{discount}%
                </div>
            )}

            {/* Installment Badge */}
            {maxPeriod > 0 && (
                <div className="absolute top-2 left-2 bg-black/90 text-[9px] font-black text-white px-2 py-0.5 rounded-sm z-10 uppercase tracking-tight flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    {maxPeriod} ay x ${monthlyPayment}
                </div>
            )}

            {/* Action Icons - Left top side, slide from Left */}
            <div className={`absolute top-4 left-4 flex flex-col gap-2 z-20 transition-all duration-500 ease-out ${isHovered ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
                <button
                    onClick={handleFavoriteClick}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border border-gray-100 cursor-pointer ${product.isFavorite ? "bg-red-50 text-red-500 border-red-100" : "bg-gray-50 text-gray-700 hover:bg-blue-600 hover:text-white"}`}
                >
                    {product.isFavorite ? <IconHeartFilled size={18} /> : <IconHeart size={18} stroke={1.5} />}
                </button>
                <button className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-gray-100 cursor-pointer">
                    <IconChartBar size={18} stroke={1.5} />
                </button>
                <button className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-gray-100 cursor-pointer">
                    <IconEye size={18} stroke={1.5} />
                </button>
            </div>

            {/* Product Image Area */}
            <div className={`relative ${noBorder ? "flex-1 min-h-0" : "aspect-square"} mb-2 min-h- flex items-center justify-center px-1 md:px-4 overflow-hidden`}>
                <img
                    src={fullPrimaryUrl}
                    alt={product.name}
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
                    className={`max-h-full max-w-full object-contain min-h-[190px] transition-all duration-700 ease-in-out ${isHovered && fullSecondaryUrl ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                />
                {fullSecondaryUrl && (
                    <img
                        src={fullSecondaryUrl}
                        alt={`${product.name} detail`}
                        onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
                        className={`absolute inset-0 m-auto max-h-full max-w-full object-contain transition-all duration-700 ease-in-out ${isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"}`}
                    />
                )}

                {/* Hot Deal Countdown */}
                {product.isHotDeal && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-center gap-1.5 z-10 scale-90 sm:scale-100">
                    </div>
                )}
            </div>

            {/* Content Slider Container - Shifts up on hover */}
            <div className="flex flex-col flex-1 mt-1 relative">
                <div
                    className={`flex flex-col flex-1 transition-transform duration-500 ease-in-out md:translate-y-0 md:group-hover:-translate-y-12`}
                >
                    {/* Product Metadata */}
                    <div className="flex flex-col flex-1">
                        <Link
                            href={`/product/${product.slug || product.id}`}
                            className={`text-[11px] md:text-[13px] font-medium ${noBorder ? "text-center" : "text-left"} text-gray-800 leading-snug mb-2 line-clamp-2 hover:text-blue-600 transition-colors`}
                        >
                            {product.name}
                        </Link>

                        {/* Price Information */}
                        <div className={`flex ${noBorder ? "justify-center" : "justify-start"} items-center gap-2.5 mt-auto`}>
                            {discount > 0 && (
                                <span className={`text-[14px] text-gray-400 line-through decoration-1 font-normal ${noBorder ? "text-center" : "text-left"}`}>
                                    ${product.price}
                                </span>
                            )}
                            <span className={`text-[14px] md:text-[14px] lg:text-[17px] font-bold text-[#1a1a1a] ${noBorder ? "text-center" : "text-left"}`}>
                                ${product.discountedPrice || product.price}
                            </span>
                        </div>
                    </div>

                    {/* Add to Cart Button - Revealed on hover on desktop, fixed position on mobile */}
                    <div className="relative mt-4 md:absolute md:top-full md:left-0 md:right-0">
                        <button 
                            className={`w-full font-bold py-2 rounded-lg text-sm tracking-tight transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                                isAdded 
                                    ? "bg-green-600 hover:bg-green-700 text-white" 
                                    : "bg-[#1a1a1a] hover:bg-blue-600 text-white active:scale-95"
                            }`}
                            onClick={handleAddToCart}
                            disabled={isAdded}
                        >
                            {isAdded ? "Əlavə edildi" : "Səbətə at"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
