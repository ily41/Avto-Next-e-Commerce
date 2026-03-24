"use client";

import React from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingCart } from "lucide-react";
import { LoginPopup } from "@/components/ownUI/loginPopup";
import { useCart } from "@/hooks/useCart";

interface NavActionsProps {
    favoritesCount: number;
    onMobileSearchOpen: () => void;
}

export function NavActions({ favoritesCount, onMobileSearchOpen }: NavActionsProps) {
    const { guestCart, serverCart, isAuth } = useCart();
    
    const cartItemsCount = isAuth 
        ? (serverCart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0) 
        : guestCart.reduce((sum, item) => sum + item.quantity, 0);
        
    const cartSubTotal = isAuth 
        ? (serverCart?.subTotal || 0) 
        : guestCart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    return (
        <div className="flex items-center gap-1.5 sm:gap-4 lg:gap-2">
            {/* Search Icon (Mobile Only) */}
            <button 
                onClick={onMobileSearchOpen}
                aria-label="Axtar" 
                className="lg:hidden text-gray-700 p-1.5"
            >
                <Search size={22} />
            </button>

            {/* My Account (Responsive) */}
            {isAuth ? (
                <Link href="/profile" className="flex items-center gap-2 group cursor-pointer bg-transparent border-none outline-none">
                    <User size={24} strokeWidth={1.5} className="text-gray-800 group-hover:text-blue-600 transition-colors shrink-0" />
                    <div className="hidden lg:flex flex-col text-left">
                        <span className="text-[10px] text-gray-500 uppercase font-semibold leading-tight">Hesabım</span>
                        <span className="text-[14px] font-bold text-gray-800 leading-tight">Profil</span>
                    </div>
                </Link>
            ) : (
                <LoginPopup>
                    <button
                        type="button"
                        aria-label="Hesabıma daxil ol"
                        className="flex items-center gap-2 group cursor-pointer bg-transparent border-none outline-none"
                    >
                        <User size={24} strokeWidth={1.5} className="text-gray-800 group-hover:text-blue-600 transition-colors shrink-0" />
                        <div className="hidden lg:flex flex-col text-left">
                            <span className="text-[10px] text-gray-500 uppercase font-semibold leading-tight">Hesabım</span>
                            <span className="text-[14px] font-bold text-gray-800 leading-tight">Daxil ol</span>
                        </div>
                    </button>
                </LoginPopup>
            )}

            {/* Wishlist */}
            <Link href="/wishlist" aria-label="İstək siyahısı" className="relative group p-1.5 flex items-center justify-center">
                <Heart size={24} strokeWidth={1.5} className="text-gray-800 group-hover:text-blue-600 transition-colors" />
                {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold border-2 border-white shadow-sm z-10 transition-all scale-100 animate-in zoom-in duration-300">
                        {favoritesCount}
                    </span>
                )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="flex items-center gap-3 group">
                <div className="relative p-1.5 flex items-center justify-center">
                    <ShoppingCart size={24} strokeWidth={1.5} className="text-gray-800 group-hover:text-blue-600 transition-colors" />
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold border-2 border-white shadow-sm z-10">
                        {cartItemsCount}
                    </span>
                </div>
                <div className="hidden lg:flex flex-col text-left">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold leading-tight">Səbətim</span>
                    <span className="text-[14px] font-bold text-gray-800 leading-tight">${cartSubTotal.toFixed(2)}</span>
                </div>
            </Link>
        </div>
    );
}
