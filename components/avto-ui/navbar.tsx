"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Search,
    User,
    Heart,
    ShoppingCart,
    Menu,
    X,
    ChevronDown,
    Package2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginPopup } from "@/components/ownUI/loginPopup";

const topNavLinks = [
    { name: "Track Order", href: "#", icon: Package2 },
    { name: "About Us", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "FAQs", href: "#" },
];

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full bg-white flex flex-col     items-center">
            {/* --- TOP BAR (Desktop Only) --- */}
            <div className="hidden lg:flex w-full border-b border-gray-100 py-1.5 justify-center bg-white">
                <div className="w-[80.3%] flex justify-between items-center text-[12px] text-gray-500 px-4">
                    <div className="flex items-center gap-5">
                        {topNavLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center gap-1.5 text-black hover:text-blue-600 transition-colors"
                            >
                                {link.icon && <link.icon size={14} className="text-gray-400" />}
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="font-medium text-gray-700">
                        Free Shipping on orders over $100!
                    </div>
                </div>
            </div>

            {/* --- MOBILE SUB-INFO (Mobile Only) --- */}
            <div className="w-full bg-white py-2 px-4 text-center lg:hidden text-[13px] font-medium text-gray-700 border-b border-gray-100">
                Free Shipping on orders over $100!
            </div>

            {/* --- MAIN NAVBAR --- */}
            <div className="w-full flex justify-center py-4 lg:py-6  border-gray-100">
                <div className="w-full px-4 lg:w-[80.3%] lg:px-4 flex items-center justify-between gap-4">
                    <div className="flex gap-1 items-center">
                        {/* Mobile Burger Group */}
                        <div className="flex items-center lg:hidden">
                            <button
                                className="text-gray-800 p-1"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <Menu size={26} />
                            </button>
                        </div>

                        {/* Logo Group */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center select-none">
                                <span className="text-2xl lg:text-[32px] font-black tracking-tight text-[#1a1a1a]">
                                    Avto<span className="text-blue-600">027</span>
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Search Bar Group (Desktop Only) */}
                    <div className="hidden lg:flex flex-1 max-w-[650px] items-center border border-gray-200 rounded-md overflow-hidden bg-[#f3f4f6]/30">
                        <div className="relative">
                            <button className="flex items-center gap-2 pl-4 pr-3 py-2 text-[14px] font-medium text-gray-700 border-r border-gray-200 hover:bg-gray-50 whitespace-nowrap">
                                All Categories
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="flex-1 px-4 py-2.5 outline-none text-[14px] bg-transparent placeholder:text-gray-400"
                        />
                        <button className="bg-blue-600 text-white px-8 py-2 text-[15px] font-bold hover:bg-blue-700 transition-colors">
                            Search
                        </button>
                    </div>

                    {/* Actions Group */}
                    <div className="flex items-center gap-1.5 sm:gap-4 lg:gap-2">

                        {/* Search Icon (Mobile Only) */}
                        <button className="lg:hidden text-gray-700 p-1.5">
                            <Search size={22} />
                        </button>

                        {/* My Account (Responsive) */}
                        <LoginPopup>
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <User size={24} strokeWidth={1.5} className="text-gray-800 group-hover:text-blue-600 transition-colors shrink-0" />
                                <div className="hidden lg:flex flex-col">
                                    <span className="text-[10px] text-gray-400 uppercase font-semibold leading-tight">My Account</span>
                                    <span className="text-[14px] font-bold text-gray-800 leading-tight">Login</span>
                                </div>
                            </div>
                        </LoginPopup>

                        {/* Wishlist */}
                        <Link href="#" className="relative group p-1.5">
                            <Heart size={24} strokeWidth={1.5} className="text-gray-800 group-hover:text-blue-600 transition-colors" />
                            <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold border-2 border-white">
                                3
                            </span>
                        </Link>

                        {/* Cart */}
                        <Link href="#" className="flex items-center gap-3 group">
                            <div className="relative p-1.5">
                                <ShoppingCart size={24} strokeWidth={1.5} className="text-gray-800 group-hover:text-blue-600 transition-colors" />
                                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold border-2 border-white">
                                    0
                                </span>
                            </div>
                            <div className="hidden lg:flex flex-col">
                                <span className="text-[10px] text-gray-400 uppercase font-semibold leading-tight">My Cart</span>
                                <span className="text-[14px] font-bold text-gray-800 leading-tight">$0.00</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>



            {/* --- MOBILE MENU OVERLAY --- */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
                    <nav className="fixed top-0 left-0 bottom-0 w-[280px] bg-white shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-left duration-300">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                            <span className="text-xl font-black text-gray-900">Avto<span className="text-blue-600">027</span></span>
                            <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 p-1"><X size={24} /></button>
                        </div>
                        <div className="flex flex-col gap-4 text-base font-semibold text-gray-800">
                            <Link href="#" className="hover:text-blue-600">Home</Link>
                            <Link href="#" className="hover:text-blue-600">Shop</Link>
                            <Link href="#" className="hover:text-blue-600">Categories</Link>
                            <Link href="#" className="hover:text-blue-600">Flash Sales</Link>
                            <LoginPopup>
                                <span className="hover:text-blue-600 cursor-pointer">Login</span>
                            </LoginPopup>
                            <div className="h-px bg-gray-100 my-2" />
                            {topNavLinks.map(link => (
                                <Link key={link.name} href="#" className="text-gray-500 font-medium text-sm flex items-center gap-2">
                                    {link.icon && <link.icon size={16} />}
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
