import ProductCard from "@/components/card/ProductCard";
import type { Product } from "@/lib/api/types";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  viewMode: "grid" | "list";
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function ProductGrid({
  products,
  isLoading,
  viewMode,
  hasMore,
  onLoadMore
}: ProductGridProps) {

  if (isLoading && products.length === 0) {
     return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
           {Array.from({ length: 8 }).map((_, i) => (
             <div key={i} className="bg-gray-100 animate-pulse rounded-lg aspect-[10/14]"></div>
           ))}
        </div>
     );
  }

  if (!isLoading && products.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
           <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
           <p className="text-sm">We couldn't find anything matching your filters. Try adjusting them.</p>
        </div>
     );
  }

  return (
    <div className="flex flex-col items-center">
      <div 
         className={
           viewMode === "grid"
             ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
             : "flex flex-col space-y-4 w-full" // standard vertical card stacking for list mode based on standard requirements
         }
      >
        {products.map(p => (
           <div key={p.id} className={viewMode === "grid" ? "aspect-[10/14]" : "w-full lg:w-3/4 max-w-2xl mx-auto"}>
              <ProductCard product={p} />
           </div>
        ))}
      </div>

      {hasMore && (
         <button 
           onClick={onLoadMore}
           disabled={isLoading}
           className="mt-12 mb-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-md transition-colors text-sm shadow-sm cursor-pointer disabled:bg-blue-400"
         >
           {isLoading ? "Loading..." : "Load More"}
         </button>
      )}
    </div>
  );
}
