"use client";

import React from "react";
import { X, Search } from "lucide-react";

interface MobileSearchOverlayProps {
    isActive: boolean;
    searchTerm: string;
    onClose: () => void;
    onSearchChange: (val: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
}

export function MobileSearchOverlay({ 
    isActive, 
    searchTerm, 
    onClose, 
    onSearchChange, 
    onSearchSubmit 
}: MobileSearchOverlayProps) {
    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white lg:hidden animate-in fade-in duration-200">
            <div className="flex items-center gap-4 p-4 border-b border-gray-100">
                <button onClick={onClose} className="text-gray-500">
                    <X size={24} />
                </button>
                <form onSubmit={onSearchSubmit} className="flex-1 flex items-center border border-gray-200 rounded-lg bg-gray-50 px-3 py-1.5 focus-within:border-blue-500 transition-colors">
                    <input
                        autoFocus
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Axtar..."
                        className="flex-1 outline-none text-black text-[15px] bg-transparent"
                    />
                    <button type="submit" className="text-blue-600">
                        <Search size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
