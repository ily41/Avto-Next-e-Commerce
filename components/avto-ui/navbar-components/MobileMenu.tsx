"use client";

import React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { LoginPopup } from "@/components/ownUI/loginPopup";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    // Keep these for physical prop compatibility if needed but they are no longer used
    searchTerm?: string;
    onSearchChange?: (val: string) => void;
    onSearchSubmit?: (e: React.FormEvent<Element>) => void;
    isSearchFocused?: boolean;
    onSearchFocus?: () => void;
    onSearchBlur?: () => void;
    onDropdownClose?: () => void;
    topNavLinks?: any[];
}

export function MobileMenu({
    isOpen,
    onClose,
}: MobileMenuProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
                onClick={onClose} 
            />
            
            {/* Sidebar */}
            <nav className="fixed top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-left duration-300 overflow-y-auto">
                <div className="flex justify-between items-center pb-5 border-b border-gray-100 shrink-0">
                    <img src="/logos/logo3.svg" alt="Avto027 Logo" className="h-[120px] w-auto object-contain mix-blend-multiply" />
                    <button 
                        aria-label="Menyunu bağla" 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-blue-600 p-2 transition-colors rounded-full hover:bg-blue-50"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex flex-col gap-1 text-[15px] font-bold text-gray-800">
                    <Link 
                        href="/" 
                        onClick={onClose} 
                        className="hover:text-blue-600 py-3 px-2 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-between group"
                    >
                        <span>Ana Səhifə</span>
                    </Link>
                    <Link 
                        href="/wishlist" 
                        onClick={onClose} 
                        className="hover:text-blue-600 py-3 px-2 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-between group"
                    >
                        <span>Seçilmişlər</span>
                    </Link>
                    
                    <div className="h-px bg-gray-50 my-2 shrink-0" />
                    
                    <Link 
                        href="/my-account" 
                        onClick={onClose} 
                        className="text-gray-500 font-bold py-3 px-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"
                    >
                        Hesabım
                    </Link>

                    <div className="mt-4">
                        <LoginPopup>
                            <button className="w-full bg-blue-600 hover:bg-black text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                                Daxil ol
                            </button>
                        </LoginPopup>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-2">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest pl-2">Müştəri Xidmətləri</p>
                    <Link href="/my-account" onClick={onClose} className="text-[13px] font-bold text-gray-500 hover:text-blue-600 px-2 py-1">Sifarişlərim</Link>
                </div>
            </nav>
        </div>
    );
}
