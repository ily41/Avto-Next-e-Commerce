"use client";

import { useGetBrandsQuery } from "@/lib/store/brands/apislice";
import Link from "next/link";
import { fullUrl } from "@/lib/api/url-utils";

interface BrandsMegaMenuProps {
    isOpen: boolean;
    setHoveredLink: (link: string | null) => void;
}

const BrandsMegaMenu = ({ isOpen, setHoveredLink }: BrandsMegaMenuProps) => {
    const { data: brandsData, isLoading } = useGetBrandsQuery({ page: 1, pageSize: 24 });
    const brands = brandsData?.items || [];

    return (
        <div
            className={`absolute top-[52px] left-0 max-w-[calc(100vw-48px)] w-full bg-white border border-gray-100 shadow-2xl z-40 transition-all duration-300 ease-in-out origin-top ${isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-8 pointer-events-none"
                }`}
            onMouseEnter={() => setHoveredLink("Brendlər")}
            onMouseLeave={() => setHoveredLink(null)}
        >
            <div className="p-10">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                    <h3 className="text-xl font-bold text-gray-900 font-outfit uppercase tracking-wider">Məşhur Brendlər</h3>
                    <Link href="/brands" className="text-sm font-semibold text-blue-600 hover:underline">Hamısını göstər</Link>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {brands.map((brand) => (
                            <Link
                                key={brand.id}
                                href={`/shop?brand=${brand.slug}`}
                                className="group flex flex-col items-center gap-3 p-4 bg-gray-50/50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
                            >
                                <div className="h-16 w-full flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                                    <img 
                                        src={fullUrl(brand.logoUrl)} 
                                        alt={brand.name} 
                                        className="max-h-full max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity" 
                                    />
                                </div>
                                <span className="text-[13px] font-bold text-gray-700 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                    {brand.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Bottom Footer Area */}
            <div className="bg-gray-50/50 px-10 py-6 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[14px] text-gray-500 font-medium">Bütün brendlərimiz orijinaldır və rəsmi zəmanətlidir.</p>
                <div className="flex gap-4">
                    <span className="text-[13px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded">20+ Brend</span>
                    <span className="text-[13px] font-black text-green-600 bg-green-50 px-3 py-1 rounded">100% Orijinal</span>
                </div>
            </div>
        </div>
    );
};

export default BrandsMegaMenu;
