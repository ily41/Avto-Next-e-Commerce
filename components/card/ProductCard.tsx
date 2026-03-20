"use client";

import { Product } from "@/lib/api/types";
import { IconHeart, IconChartBar, IconEye } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { fullUrl } from "@/lib/api/url-utils";

interface ProductCardProps {
    product: Product;
    noBorder?: boolean;
}

const ProductCard = ({ product, noBorder }: ProductCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const PLACEHOLDER_IMAGE = "/logos/logo3.svg";
    const fullPrimaryUrl = fullUrl(product.primaryImageUrl || product.imageUrl);
    const secondaryImgPath = product.detailImageUrl || (product.images && product.images.length > 1 ? product.images[1].imageUrl : null);
    const fullSecondaryUrl = secondaryImgPath ? fullUrl(secondaryImgPath) : null;

    const discount = (product.discountedPrice && product.price > product.discountedPrice)
        ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
        : 0;

    return (
        <div
            className={`group relative bg-white ${noBorder ? " rounded-lg" : "border border-[#f2f2f2] "} p-4 pb-3  flex flex-col h-full transition-all duration-300 overflow-hidden cursor-pointer`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Discount Badge */}
            {discount > 0 && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] b-badge font-bold px-1.5 py-0.5 rounded-sm z-10 transition-transform duration-300 group-hover:scale-110">
                    -{discount}%
                </div>
            )}

            {/* Action Icons - Left top side, slide from Left */}
            <div className={`absolute top-4 left-4 flex flex-col gap-2 z-20 transition-all duration-500 ease-out ${isHovered ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
                <button className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-gray-100 cursor-pointer">
                    <IconHeart size={18} stroke={1.5} />
                </button>
                <button className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-gray-100 cursor-pointer">
                    <IconChartBar size={18} stroke={1.5} />
                </button>
                <button className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-gray-100 cursor-pointer">
                    <IconEye size={18} stroke={1.5} />
                </button>
            </div>

            {/* Product Image Area */}
            <div className={`relative ${noBorder ? "flex-1 min-h-0" : "aspect-square"} mb-2 flex items-center justify-center px-4 overflow-hidden`}>
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
                            className={`text-[12px] md:text-[13px] font-medium ${noBorder ? "text-center" : "text-left"} text-gray-800 leading-snug mb-2 line-clamp-2 hover:text-blue-600 transition-colors`}
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
                            <span className={`text-[17px] font-bold text-[#1a1a1a] ${noBorder ? "text-center" : "text-left"}`}>
                                ${product.discountedPrice || product.price}
                            </span>
                        </div>
                    </div>

                    {/* Add to Cart Button - Revealed on hover on desktop, fixed position on mobile */}
                    <div className="relative mt-4 md:absolute md:top-full md:left-0 md:right-0">
                        <button className="w-full bg-[#1a1a1a] hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-sm tracking-tight transition-all duration-300 shadow-md active:scale-95 cursor-pointer">
                            Səbətə at
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
