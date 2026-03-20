"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import FilterSidebar from "./FilterSidebar";
import SortHeader from "./SortHeader";
import ProductGrid from "./ProductGrid";
import { useFilterProductsQuery } from "@/lib/store/products/apislice";
import { useGetCategoriesQuery } from "@/lib/store/categories/apislice";

export default function ShopClient({ initialSearchParams }: { initialSearchParams: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // URL synced state
  const categorySlug = searchParams.get("category") || initialSearchParams.category || undefined;
  const brandSlug = searchParams.get("brand") || initialSearchParams.brand || undefined;
  const sortByParam = searchParams.get("sort") || "default"; 
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  
  // Local state for sidebar / display
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // RTK Queries
  const { data: categories } = useGetCategoriesQuery();
  const categoryId = categories?.find(c => c.slug === categorySlug)?.id;

  // Sorting parser
  let sortBy, sortOrder;
  switch (sortByParam) {
    case "price_asc":
      sortBy = "Price";
      sortOrder = "asc";
      break;
    case "price_desc":
      sortBy = "Price";
      sortOrder = "desc";
      break;
    case "name_asc":
      sortBy = "Name";
      sortOrder = "asc";
      break;
    case "name_desc":
       sortBy = "Name";
       sortOrder = "desc";
       break;
    default:
      sortBy = undefined;
      sortOrder = undefined;
      break;
  }

  const queryArgs = {
    categoryId: categoryId,
    brandSlug: brandSlug,
    sortBy: sortBy,
    sortOrder: sortOrder,
    page: pageParam,
    pageSize: 16
  };

  const { data, isLoading, isFetching } = useFilterProductsQuery(queryArgs);

  const setQueryParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // reset page automatically when a filter changes natively
    if (key !== "page") {
        params.delete("page");
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start relative w-full mb-16">
        {/* Sidebar */}
        <div className={`lg:w-[260px] xl:w-[280px] shrink-0 transition-transform ${isSidebarOpen ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : "hidden lg:block"} bg-white rounded-lg lg:bg-transparent lg:p-0`}>
            {isSidebarOpen && (
               <div className="flex justify-between items-center mb-6 lg:hidden">
                   <h2 className="text-xl font-bold">Filters</h2>
                   <button onClick={() => setIsSidebarOpen(false)} className="text-3xl">&times;</button>
               </div>
            )}
            <FilterSidebar 
              currentCategory={categorySlug} 
              currentBrand={brandSlug}
              onFilterChange={setQueryParam} 
            />
        </div>

        <div className="flex-1 min-w-0 flex flex-col space-y-6 w-full">
           {/* Top Controls */}
           <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 lg:bg-transparent lg:shadow-none lg:border-none lg:p-0">
               <SortHeader 
                  totalItems={data?.totalCount || 0}
                  startItem={data?.totalCount === 0 ? 0 : (pageParam - 1) * 16 + 1}
                  endItem={Math.min((pageParam * 16), data?.totalCount || 0)}
                  currentSort={sortByParam}
                  onSortChange={(val: string) => setQueryParam("sort", val)}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  onOpenSidebar={() => setIsSidebarOpen(true)}
               />
           </div>

           {/* Grid Container */}
           <ProductGrid 
              products={data?.products || []} 
              isLoading={isLoading || isFetching} 
              viewMode={viewMode} 
              currentPage={pageParam}
              totalPages={data?.totalPages || 1}
              onPageChange={(page: number) => setQueryParam("page", page.toString())}
           />
        </div>
    </div>
  )
}
