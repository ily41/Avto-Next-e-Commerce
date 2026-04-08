"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import FilterSidebar from "./FilterSidebar";
import SortHeader from "./SortHeader";
import ProductGrid from "./ProductGrid";
import { useFilterProductsQuery } from "@/lib/store/products/apislice";
import { useGetCategoriesQuery } from "@/lib/store/categories/apislice";
import { cn } from "@/lib/utils";
import { IconX } from "@tabler/icons-react";

export default function ShopClient({ initialSearchParams }: { initialSearchParams: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // URL synced state
  const categoryParam = searchParams.get("category") || initialSearchParams.category || "";
  const categorySlugs = categoryParam ? categoryParam.split(",") : [];
  const brandSlug = searchParams.get("brand") || initialSearchParams.brand || undefined;
  const searchTerm = searchParams.get("searchTerm") || initialSearchParams.searchTerm || undefined;
  const sortByParam = searchParams.get("sort") || "default"; 
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  
  // Custom filters f_<id>=optionId,optionId
  const customFiltersFromUrl: Record<string, string[]> = {};
  searchParams.forEach((value, key) => {
    if (key.startsWith("f_")) {
      customFiltersFromUrl[key.replace("f_", "")] = value.split(",");
    }
  });

  // Local state for sidebar / display
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // RTK Queries
  const { data: categories } = useGetCategoriesQuery();
  
  // Find category IDs by slugs
  const categoryIds = (() => {
    if (categorySlugs.length === 0 || !categories) return undefined;
    const ids: string[] = [];
    
    // Flatten categories for easier searching
    const flatList: any[] = [];
    const flatten = (cats: any[]) => {
      cats.forEach(c => {
        flatList.push(c);
        if (c.subCategories) flatten(c.subCategories);
      });
    };
    flatten(categories);

    categorySlugs.forEach(slug => {
      const found = flatList.find(c => c.slug === slug);
      if (found) ids.push(found.id);
    });

    return ids.length > 0 ? ids : undefined;
  })();

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

  const filterCriteria = Object.entries(customFiltersFromUrl).map(([filterId, optionIds]) => ({
    filterId,
    filterOptionIds: optionIds
  }));

  const queryArgs = {
    categoryIds: categoryIds,
    brandSlug: brandSlug,
    searchTerm: searchTerm,
    filterCriteria: filterCriteria.length > 0 ? filterCriteria : undefined,
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
        {/* Sidebar */}
        <div className="lg:w-[260px] xl:w-[280px] shrink-0">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <aside className={cn(
                "fixed inset-y-0 left-0 w-[300px] bg-white z-[70] p-6 overflow-y-auto transition-transform duration-300 transform lg:static lg:w-full lg:translate-x-0 lg:p-0 lg:bg-transparent lg:block lg:sticky lg:top-4 lg:h-fit",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Mobile Header */}
                <div className="flex justify-between items-center mb-6 lg:hidden">
                    <h2 className="text-xl font-bold text-gray-900 font-outfit uppercase tracking-tight">Filters</h2>
                    <button 
                        onClick={() => setIsSidebarOpen(false)} 
                        className="text-gray-500 hover:text-red-500 transition-colors p-1"
                        aria-label="Filterləri bağla"
                    >
                        <IconX size={28} />
                    </button>
                </div>

                <FilterSidebar 
                  currentCategories={categorySlugs} 
                  currentBrand={brandSlug}
                  currentFilters={customFiltersFromUrl}
                  onFilterChange={setQueryParam} 
                />
            </aside>
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
