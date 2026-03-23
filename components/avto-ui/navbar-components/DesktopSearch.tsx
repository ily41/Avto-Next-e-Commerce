"use client";

import React from "react";
import { SearchDropdown } from "../SearchDropdown";

interface DesktopSearchProps {
    searchTerm: string;
    onSearchChange: (val: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    isFocused: boolean;
    onFocus: () => void;
    onBlur: () => void;
    onDropdownClose: () => void;
}

export function DesktopSearch({ 
    searchTerm, 
    onSearchChange, 
    onSearchSubmit, 
    isFocused, 
    onFocus, 
    onBlur,
    onDropdownClose
}: DesktopSearchProps) {
    return (
        <form 
            onSubmit={onSearchSubmit}
            className="hidden lg:flex flex-1 max-w-[650px] items-center border border-gray-200 rounded-md bg-[#f3f4f6]/30 relative"
        >
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder="Məhsulları axtar..."
                className="flex-1 px-4 py-2.5 outline-none text-black text-[14px] bg-transparent placeholder:text-gray-400 rounded-l-md"
            />
            <button 
                type="submit"
                className="bg-blue-600 text-white px-8 py-2 text-[15px] font-bold hover:bg-blue-700 transition-colors rounded-r-md"
            >
                Axtar
            </button>
            
            {isFocused && searchTerm.length >= 2 && (
                <SearchDropdown 
                    searchTerm={searchTerm} 
                    onClose={onDropdownClose} 
                />
            )}
        </form>
    );
}
