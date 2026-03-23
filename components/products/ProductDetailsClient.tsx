"use client";

import React from "react";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { useGetProductBySlugQuery } from "@/lib/store/productDetails/apislice";
import { useGetRecommendationsQuery } from "@/lib/store/products/apislice";
import { useGetProductSpecificationsQuery } from "@/lib/store/products/specifications/apislice";
import ProductGallery from "./details/ProductGallery";
import ProductInfo from "./details/ProductInfo";
import ProductTabs from "./details/ProductTabs";
import RelatedProductsSection from "./details/RelatedProductsSection";

const LOCAL = {
  home: "Ana Səhifə",
  shop: "Mağaza",
};

export default function ProductDetailsClient({ slug }: { slug: string }) {
  const { data: product, isLoading, isError } = useGetProductBySlugQuery(slug);
  const { data: specs } = useGetProductSpecificationsQuery(product?.id || "", { skip: !product?.id });
  const { data: recs } = useGetRecommendationsQuery({ categoryId: product?.categoryId, limit: 12 }, { skip: !product?.categoryId });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Yüklənir...</div>;
  if (isError || !product) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Məhsul tapılmadı.</div>;

  const images = [
    { id: 'primary', url: product.primaryImageUrl || product.imageUrl },
    ...(product.images || []).map(img => ({ id: img.id, url: img.imageUrl }))
  ].filter(img => img.url);

  const discount = (product.discountedPrice && product.price > product.discountedPrice)
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) : 0;

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="bg-[#f8f8f8] py-4 border-b border-gray-100 flex items-center">
        <div className="max-w-[1240px] mx-auto w-full px-4 text-[12px] text-gray-500 font-bold uppercase flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition-colors uppercase">{LOCAL.home}</Link>
          <IconChevronRight size={14} stroke={3} />
          <Link href="/shop" className="hover:text-blue-600 transition-colors uppercase">{LOCAL.shop}</Link>
          <IconChevronRight size={14} stroke={3} />
          <span className="text-gray-900 truncate max-w-[200px] md:max-w-none">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto mt-12 px-4 lg:px-0">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/2">
            <ProductGallery images={images} primaryUrl={product.primaryImageUrl || product.imageUrl || ""} />
          </div>
          <div className="w-full lg:w-1/2">
            <ProductInfo product={product} discount={discount} />
          </div>
        </div>

        <ProductTabs specifications={specs} />
        <RelatedProductsSection products={recs?.basedOnCategory || []} />
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 768px) {
          * { font-size: clamp(10px, 14px, 14px) !important; }
        }
      `}</style>
    </div>
  );
}
