"use client";

import * as React from "react";
import { Product } from "@/lib/api/types";
import { useToggleFavoriteMutation } from "@/lib/store/favorites/apislice";
import { IconHeart, IconHeartFilled, IconShoppingCart } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fullUrl } from "@/lib/api/url-utils";
import { useCart } from "@/hooks/useCart";
import { calculateBestInstallment } from "@/lib/installmentUtils";
import { useAuth } from "@/hooks/useAuth";
import { LoginPopup } from "@/components/ownUI/loginPopup";


interface ProductCardProps {
    product: Product;
    noBorder?: boolean;
}


const ProductCard = ({ product, noBorder }: ProductCardProps) => {
    const { isAuth } = useAuth();
    const router = useRouter();

    const [toggleFavorite] = useToggleFavoriteMutation();
    const { addItem } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    // Local favorite state for instant UI update
    const [localIsFavorite, setLocalIsFavorite] = useState(product.isFavorite);

    // Synchronize local state with prop if it changes from outside (e.g. page refresh)
    useEffect(() => {
        setLocalIsFavorite(product.isFavorite);
    }, [product.isFavorite]);

    const productPrice = product.discountedPrice || product.price;
    const installment = calculateBestInstallment(productPrice);

    const maxPeriod = installment?.month || 0;
    const availableMonths = installment?.availableMonths || [];
    const monthlyPayment = installment?.monthlyPayment || null;


    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuth) return; // LoginPopup will trigger
        try {
            // Optimistic update
            setLocalIsFavorite(!localIsFavorite);
            await toggleFavorite(product.id).unwrap();
        } catch (err) {
            // Revert if failed
            setLocalIsFavorite(product.isFavorite);
            console.error("Favorite toggle failed:", err);
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
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
            // Error handled by useCart hook
        }
    };

    const PLACEHOLDER_IMAGE = "/logos/logo3.svg";
    const fullPrimaryUrl = fullUrl(product.primaryImageUrl || product.imageUrl);
    const secondaryImgPath =
        product.detailImageUrl ||
        (product.images && product.images.length > 1 ? product.images[1].imageUrl : null);
    const fullSecondaryUrl = secondaryImgPath ? fullUrl(secondaryImgPath) : null;

    const discount =
        product.discountedPrice && product.price > product.discountedPrice
            ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
            : 0;

    const isNew = product.createdAt
        ? (Date.now() - new Date(product.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000
        : false;

    return (
        <div
            className={`relative bg-white h-full ${noBorder ? "rounded-xl" : "border border-[#f0f0f0] rounded-xl"
                } flex flex-col cursor-pointer select-none shadow-sm hover:shadow-md transition-shadow duration-300`}
            onClick={handleCardClick}
            style={{ overflow: "hidden" }}
        >
            {/* ── IMAGE AREA ─────────────────────────────────────── */}
            <div className="relative  rounded-t-xl" style={{ aspectRatio: "1 / 1" }}>
                {/* "Yenilik" badge — top left */}
                {isNew && (
                    <span className="absolute top-3 left-3 z-10 text-white text-[11px] font-bold px-2.5 py-0.5 rounded bg-blue-600">
                        Yenilik
                    </span>
                )}

                {/* Heart — top right, always visible */}
                {isAuth ? (
                    <button
                        onClick={handleFavoriteClick}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 transition-all duration-200 hover:scale-110 cursor-pointer"
                    >
                        {localIsFavorite ? (
                            <IconHeartFilled size={18} className="text-red-500" />
                        ) : (
                            <IconHeart size={18} stroke={1.5} className="text-gray-400" />
                        )}
                    </button>
                ) : (
                    <LoginPopup>
                        <button
                            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 transition-all duration-200 hover:scale-110 cursor-pointer"
                        >
                            <IconHeart size={18} stroke={1.5} className="text-gray-400" />
                        </button>
                    </LoginPopup>
                )}

                {/* Product image */}
                <div className="absolute inset-0 flex items-center justify-center p-5">
                    <img
                        src={fullPrimaryUrl}
                        alt={product.name}
                        onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
                        className="max-h-full max-w-full object-contain"
                        style={{ maxHeight: "160px" }}
                    />
                </div>

                {/* Discount badge — bottom left of image area */}
                {discount > 0 && (
                    <span className="absolute bottom-3 left-3 z-10 text-red-600 bg-red-50 text-[11px] font-bold px-2 py-0.5 rounded">
                        -{discount} %
                    </span>
                )}
            </div>

            {/* ── CONTENT AREA ────────────────────────────────────── */}
            <div className="flex flex-col flex-1 px-3 pt-3 pb-3 gap-1.5">
                {/* Price row */}
                <div className="flex items-baseline gap-2">
                    {/* Discounted / main price */}
                    <span className="text-[17px] font-bold leading-none text-[#1a1a1a]">
                        {(product.discountedPrice ?? product.price).toFixed(2)}
                        {" "}
                        <span className="text-[13px] font-semibold">₼</span>
                    </span>

                    {/* Original price — gray strikethrough */}
                    {discount > 0 && (
                        <span className="text-[12px] text-gray-400 line-through font-normal">
                            {product.price.toFixed(2)} ₼
                        </span>
                    )}
                </div>

                {/* Installment Info - preserved space to maintain uniform card height */}
                <div className="min-h-[52px] flex flex-col justify-center">
                    {monthlyPayment && productPrice >= 15 ? (
                        <div className="flex flex-col gap-1.5">
                            {/* Primary installment pill */}
                            <div className="inline-flex items-center self-start">
                                <span
                                    className="text-[12px] font-bold px-2.5 py-1 rounded"
                                    style={{ background: "#f5d000", color: "#1a1a1a" }}
                                >
                                    {monthlyPayment} ₼ x {maxPeriod} ay
                                </span>
                            </div>

                            {/* List of all available months */}
                            <div className="flex flex-wrap gap-1">
                                {availableMonths.map((m) => (
                                    <span
                                        key={m}
                                        className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-100 uppercase"
                                    >
                                        {m} ay
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Product name */}
                <Link
                    href={`/product/${product.slug || product.id}`}
                    className="text-[14px] text-[#1a1a1a] leading-snug line-clamp-2 hover:text-blue-600 transition-colors duration-200 mt-0.5"
                    style={{ minHeight: "2.8em" }}
                >
                    {product.name}
                </Link>

                {/* Spacer pushes button to bottom */}
                <div className="flex-1" />

                {/* "Səbətə at" button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer mt-1 active:scale-95 ${isAdded
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 hover:bg-black text-white"
                        }`}
                >
                    <IconShoppingCart size={17} stroke={1.8} />
                    {isAdded ? "Əlavə edildi" : "Səbətə at"}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
