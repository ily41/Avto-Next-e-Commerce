"use client";

import { API_BASE_URL } from "@/lib/store/api";
import { Product } from "@/lib/store/products/apislice";
import { IconHeart, IconChartBar, IconEye, IconStarFilled } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const imageUrl = product.imageUrl || product.primaryImageUrl;
    const fullImageUrl = imageUrl ? `${API_BASE_URL}${imageUrl}` : "/placeholder.png";

    const discount = (product.discountedPrice && product.price > product.discountedPrice)
        ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
        : 0;

    return (
        <div
            className="group relative bg-white border border-[#f2f2f2] p-4 pb-3 flex flex-col h-full transition-all duration-300 hover:shadow-xl overflow-hidden cursor-pointer"
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
            <div className="relative aspect-square mb-2 flex items-center justify-center px-4">
                <img
                    src={fullImageUrl}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
            </div>

            {/* Content Slider Container - Shifts up on hover */}
            <div className="flex flex-col flex-1 mt-1 relative">
                <div 
                    className={`flex flex-col flex-1 transition-transform duration-500 ease-in-out ${isHovered ? "-translate-y-12" : "translate-y-0"}`}
                >
                    {/* Product Metadata */}
                    <div className="flex flex-col flex-1">
                        <Link
                            href={`/product/${product.slug || product.id}`}
                            className="text-[15px] font-medium text-gray-800 leading-snug mb-2 line-clamp-2 hover:text-blue-600 transition-colors"
                        >
                            {product.name}
                        </Link>

                        {/* Price Information */}
                        <div className="flex items-center gap-2.5 mt-auto">
                            {discount > 0 && (
                                <span className="text-[14px] text-gray-400 line-through decoration-1 font-normal">
                                    ${product.price}
                                </span>
                            )}
                            <span className="text-[17px] font-bold text-[#1a1a1a]">
                                ${product.discountedPrice || product.price}
                            </span>
                        </div>
                    </div>

                    {/* Add to Cart Button - Hidden by default, slides up with content */}
                    <div className="absolute top-full left-0 right-0 pt-4">
                        <button className="w-full bg-[#1a1a1a] hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-sm tracking-tight transition-all duration-300 shadow-md active:scale-95 cursor-pointer">
                            Add To Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
