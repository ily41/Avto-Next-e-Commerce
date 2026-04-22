"use client";

import React from "react";
import Link from "next/link";
import { Package2 } from "lucide-react";

const topNavLinks = [
    { name: "Sifarişi İzlə", href: "/profile/orders", icon: Package2 },
    { name: "Haqqımızda", href: "/about" },
    { name: "Bizimlə Əlaqə", href: "/contact-us" },
];

export function TopBar() {
    return (
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
                    200 manatdan yuxarı alış-verişə çatdırılma pulsuz
                </div>
            </div>
        </div>
    );
}
