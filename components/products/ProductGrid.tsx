import ProductCard from "@/components/card/ProductCard";
import type { Product } from "@/lib/api/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  viewMode: "grid" | "list";
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProductGrid({
  products,
  isLoading,
  viewMode,
  currentPage,
  totalPages,
  onPageChange
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

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }
    
    const elements = [];

    // Previous Button
    elements.push(
        <button
            key="prev"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            aria-label="Previous Page"
            className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none transition-colors mx-1 bg-white cursor-pointer"
        >
            <ChevronLeft size={18} />
        </button>
    );

    // Sequence Buttons Loop
    for (let i = start; i <= end; i++) {
        elements.push(
            <button
                key={i}
                onClick={() => onPageChange(i)}
                disabled={isLoading && currentPage !== i}
                aria-label={`Page ${i}`}
                className={`w-10 h-10 flex items-center justify-center rounded text-sm font-medium transition-colors mx-1 focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
                    currentPage === i
                        ? "bg-blue-600 text-white border border-blue-600 shadow-sm opacity-100"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 disabled:opacity-50"
                }`}
            >
                {i}
            </button>
        );
    }

    // Next Button
    elements.push(
        <button
            key="next"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            aria-label="Next Page"
            className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none transition-colors mx-1 bg-white cursor-pointer"
        >
            <ChevronRight size={18} />
        </button>
    );

    return <div className="flex items-center justify-center mt-12 mb-8 flex-wrap gap-1 w-full">{elements}</div>;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div 
         className={
           viewMode === "grid"
             ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
             : "flex flex-col space-y-4 w-full"
         }
      >
        {products.map(p => (
           <div key={p.id} className={viewMode === "grid" ? "aspect-[10/14]" : "w-full lg:w-3/4 max-w-2xl mx-auto"}>
              <ProductCard product={p} />
           </div>
        ))}
      </div>

      {renderPagination()}
    </div>
  );
}
