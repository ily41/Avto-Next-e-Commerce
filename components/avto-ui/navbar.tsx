"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetFavoritesCountQuery } from "@/lib/store/favorites/apislice";
import { Menu } from "lucide-react";

// Sub-components
import { TopBar } from "./navbar-components/TopBar";
import { MobileSearchOverlay } from "./navbar-components/MobileSearchOverlay";
import { DesktopSearch } from "./navbar-components/DesktopSearch";
import { NavActions } from "./navbar-components/NavActions";
import { MobileMenu } from "./navbar-components/MobileMenu";
import { Package2 } from "lucide-react";

const topNavLinks = [
    // { name: "Sifarişi İzlə", href: "#", icon: Package2 },    
    { name: "Haqqımızda", href: "#" },
    { name: "Bloq", href: "#" },
    { name: "Bizimlə Əlaqə", href: "#" },
    { name: "Tez-tez Verilən Suallar", href: "#" },
];

import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuth } = useAuth();
    
    // State
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Data
    const { data: favoritesCountData } = useGetFavoritesCountQuery(undefined, {
        skip: !isAuth
    });
    const favoritesCount = favoritesCountData?.count || 0;

    // Effects
    useEffect(() => {
        const term = searchParams.get("searchTerm");
        if (term) setSearchTerm(term);
    }, [searchParams]);

    // Handlers
    const handleSearchSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchTerm.trim();
        if (trimmed) {
            router.push(`/shop?searchTerm=${encodeURIComponent(trimmed)}`);
            setIsMenuOpen(false);
            setIsMobileSearchActive(false);
            setIsSearchFocused(false);
        }
    }, [searchTerm, router]);

    const handleSearchFocus = () => setIsSearchFocused(true);
    const handleSearchBlur = () => setTimeout(() => setIsSearchFocused(false), 300);
    const handleDropdownClose = () => setIsSearchFocused(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white flex flex-col items-center shadow-sm">
            {/* 1. Mobile Search Overlay (Fullscreen when header icon is clicked) */}
            <MobileSearchOverlay 
                isActive={isMobileSearchActive}
                searchTerm={searchTerm}
                onClose={() => setIsMobileSearchActive(false)}
                onSearchChange={setSearchTerm}
                onSearchSubmit={handleSearchSubmit}
            />

            {/* 2. Top Bar (Desktop only) */}
            <TopBar />

            {/* 3. Mobile Header Sub-info */}
            <div className="w-full bg-white py-2 px-4 text-center lg:hidden text-[13px] font-medium text-gray-700 border-b border-gray-100">
                $100-dan yuxarı sifarişlərdə Pulsuz Çatdırılma!
            </div>

            {/* 4. Main Navbar Row */}
            <div className="w-full flex justify-center py-3  border-gray-100">
                <div className="w-full px-4 lg:w-[80.3%] lg:px-4 flex items-center justify-between gap-4">
                    <div className="flex gap-1 items-center">
                        {/* Mobile Side Menu Trigger */}
                        <div className="flex items-center lg:hidden">
                            <button
                                aria-label="Menyu aç"
                                className="text-gray-800 p-1 hover:text-blue-600 transition-colors"
                                onClick={() => setIsMenuOpen(true)}
                            >
                                <Menu size={26} />
                            </button>
                        </div>

                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center select-none active:scale-95 transition-transform">
                                <img 
                                  src="/logos/logo3.svg" 
                                  alt="Avto027 Logo" 
                                  className="h-[40px] lg:h-[50px] w-[100px] lg:w-[150px] object-cover mix-blend-multiply" 
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Integrated Search */}
                    <DesktopSearch 
                       searchTerm={searchTerm}
                       onSearchChange={setSearchTerm}
                       onSearchSubmit={handleSearchSubmit}
                       isFocused={isSearchFocused}
                       onFocus={handleSearchFocus}
                       onBlur={handleSearchBlur}
                       onDropdownClose={handleDropdownClose}
                    />

                    {/* Nav Actions (Search Mob, Account, Favs, Cart) */}
                    <NavActions 
                        favoritesCount={favoritesCount}
                        onMobileSearchOpen={() => setIsMobileSearchActive(true)}
                    />
                </div>
            </div>

            {/* 5. Mobile Side Menu */}
            <MobileMenu 
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearchSubmit={handleSearchSubmit}
                isSearchFocused={isSearchFocused}
                onSearchFocus={handleSearchFocus}
                onSearchBlur={handleSearchBlur}
                onDropdownClose={handleDropdownClose}
                topNavLinks={topNavLinks}
            />
        </header>
    );
}
