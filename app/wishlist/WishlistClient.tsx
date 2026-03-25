"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconChevronRight, IconShoppingCart, IconX } from "@tabler/icons-react";
import { useGetFavoritesQuery, useToggleFavoriteMutation } from "@/lib/store/favorites/apislice";
import Image from "next/image";
import { fullUrl } from "@/lib/api/url-utils";

const LOCAL = {
  home: "Ana səhifə",
  wishlist: "İstək siyahısı",
  addToCart: "Səbətə at",
  viewProduct: "Məhsula bax",
  empty: "İstək siyahınız boşdur.",
  price: "Qiymət",
  date: "Əlavə edilmə tarixi",
  action: "Fəaliyyət"
};

import { useAuth } from "@/hooks/useAuth";

export default function WishlistClient() {
  const { isAuth } = useAuth();
  const { data: favorites, isLoading, error } = useGetFavoritesQuery(
    { page: 1, pageSize: 50 },
    { skip: !isAuth }
  );
  const [toggleFavorite] = useToggleFavoriteMutation();
  const router = useRouter();
  const [wishlistLink, setWishlistLink] = React.useState("https://wordpresstheme"); // Placeholder for demonstration

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Yüklənir...</div>;

  // Handle Unauthorized
  if (!isAuth) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
         <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-[450px] w-full text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
               <IconX size={32} className="text-blue-600" stroke={2.5} />
            </div>
            <div className="flex flex-col gap-2">
               <h2 className="text-[22px] font-bold text-gray-900 uppercase">Giriş tələb olunur</h2>
               <p className="text-[14px] text-gray-500 leading-relaxed font-medium">İstək siyahısını görmək üçün hesabınıza daxil olmalısınız.</p>
            </div>
            <Link 
              href="/my-account" 
              className="w-full py-4 bg-blue-600 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 text-[14px]"
            >
               Hesabıma get
            </Link>
         </div>
      </div>
    );
  }

  const items = favorites?.favorites || [];

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* Breadcrumb Section */}
      <div className="bg-[#f8f8f8] py-8 md:py-12 border-b border-gray-100 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 text-[12px] md:text-[14px] text-gray-500 uppercase font-bold tracking-tight mb-2">
           <Link href="/" className="hover:text-blue-600 transition-colors">{LOCAL.home}</Link>
           <IconChevronRight size={14} stroke={3} />
           <span className="text-gray-900">{LOCAL.wishlist}</span>
        </div>
        <h1 className="text-[32px] md:text-[42px] font-bold text-gray-900">{LOCAL.wishlist}</h1>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 mt-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
              <IconShoppingCart size={32} stroke={1.5} />
            </div>
            <p className="text-[16px] font-medium">{LOCAL.empty}</p>
            <Link href="/shop" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-black transition-all">Mağazaya get</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Wishlist Box */}
            <div className="w-full border border-gray-100 shadow-sm overflow-hidden">
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`flex flex-col md:flex-row items-center gap-6 p-6 border-b border-gray-100 last:border-b-0 ${index % 2 === 1 ? 'bg-[#f9f9f9]' : 'bg-white'} group relative`}
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-white flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={fullUrl(item.product.primaryImageUrl || item.product.imageUrl)} 
                      alt={item.product.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1 items-center md:items-start text-center md:text-left gap-1">
                    <Link 
                      href={`/product/${item.product.slug || item.product.id}`}
                      className="text-[15px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <span className="text-[15px] font-bold text-gray-800">
                        {item.product.discountedPrice && item.product.price > item.product.discountedPrice ? (
                          <>
                            <span className="line-through text-gray-400 mr-2">${item.product.price}</span>
                            <span>${item.product.discountedPrice}</span>
                          </>
                        ) : (
                          `$${item.product.price}`
                        )}
                      </span>
                      <span className="text-[13px] text-gray-500 font-medium">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "March 22, 2026"}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <button className="w-full md:w-[150px] h-10 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-md transition-all active:scale-95 shadow-sm uppercase tracking-tight">
                      {item.product.stockQuantity > 0 ? "Add To Cart" : "View Products"}
                    </button>
                    <button 
                      onClick={() => toggleFavorite(item.productId)}
                      className="absolute top-2 right-2 md:relative md:top-auto md:right-auto w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <IconX size={16} stroke={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          
          </div>
        )}
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          * { font-size: clamp(10px, 14px, 14px) !important; }
        }
      `}</style>
    </div>
  );
}
