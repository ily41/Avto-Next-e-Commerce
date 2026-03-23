"use client";

import React from "react";
import Link from "next/link";
import { X, Search } from "lucide-react";
import { LoginPopup } from "@/components/ownUI/loginPopup";
import { SearchDropdown } from "../SearchDropdown";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    searchTerm: string;
    onSearchChange: (val: string) => void;
    onSearchSubmit: (e: React.FormEvent<Element>) => void;
    isSearchFocused: boolean;
    onSearchFocus: () => void;
    onSearchBlur: () => void;
    onDropdownClose: () => void;
    topNavLinks: any[];
}

export function MobileMenu({
    isOpen,
    onClose,
    searchTerm,
    onSearchChange,
    onSearchSubmit,
    isSearchFocused,
    onSearchFocus,
    onSearchBlur,
    onDropdownClose,
    topNavLinks
}: MobileMenuProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] lg:hidden">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <nav className="fixed top-0 left-0 bottom-0 w-[280px] bg-white shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-left duration-300 overflow-y-auto overflow-x-visible">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100 shrink-0">
                    <img src="/logos/logo3.svg" alt="Avto027 Logo" className="h-[40px] w-[120px] object-cover mix-blend-multiply" />
                    <button aria-label="Menyunu bağla" onClick={onClose} className="text-gray-500 p-1"><X size={24} /></button>
                </div>
                <div className="flex flex-col gap-4 text-base font-semibold text-gray-800">
                    {/* Mobile Search */}
                    <div className="relative z-[120]">
                        <form 
                            onSubmit={onSearchSubmit} 
                            className="flex items-center border border-gray-200 rounded-md bg-gray-50 mb-2 relative"
                        >
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onFocus={onSearchFocus}
                                onBlur={onSearchBlur}
                                placeholder="Axtar..." 
                                className="w-full px-3 py-2 outline-none text-sm bg-transparent rounded-l-md text-black" 
                            />
                            <button type="submit" className="bg-blue-600 text-white p-2 rounded-r-md">
                                <Search size={18} />
                            </button>
                        </form>
                        
                        {isSearchFocused && searchTerm.length >= 2 && (
                            <SearchDropdown 
                                searchTerm={searchTerm} 
                                onClose={onDropdownClose} 
                                className="relative top-0 mt-2 shadow-none border-0 border-t border-gray-100 rounded-none animate-none z-0"
                            />
                        )}
                    </div>

                    <Link href="/" onClick={onClose} className="hover:text-blue-600 py-1 transition-colors">Ana Səhifə</Link>
                    <Link href="/shop" onClick={onClose} className="hover:text-blue-600 py-1 transition-colors">Mağaza</Link>
                    <Link href="/categories" onClick={onClose} className="hover:text-blue-600 py-1 transition-colors">Kateqoriyalar</Link>
                    <Link href="/deals" onClick={onClose} className="hover:text-blue-600 py-1 transition-colors text-red-600 font-bold">Qaynar Endirimlər</Link>
                    
                    <LoginPopup>
                        <span className="hover:text-blue-600 cursor-pointer py-1 block">Daxil ol</span>
                    </LoginPopup>

                    <div className="h-px bg-gray-100 my-2 shrink-0" />
                    
                    <div className="flex flex-col gap-3">
                        {topNavLinks.map(link => (
                            <Link 
                                key={link.name} 
                                href={link.href} 
                                onClick={onClose}
                                className="text-gray-500 font-medium text-sm flex items-center gap-2 hover:text-blue-600 transition-colors"
                            >
                                {link.icon && <link.icon size={16} />}
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </div>
    );
}
