import { Metadata } from "next";
import ShopClient from "@/components/products/ShopClient";
import { fetchCategories } from "@/lib/api/server-fetchers";

interface PageProps {
  searchParams: {
    category?: string;
    brand?: string;
    searchTerm?: string;
    [key: string]: string | undefined;
  };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const categories = await fetchCategories();
  const categoryName = searchParams.category 
    ? categories.find(c => c.slug === searchParams.category)?.name || "All Products"
    : "All Products";

  return {
    title: `${categoryName} | TechShop`,
    description: `Shop for ${categoryName}`,
  };
}

export default async function ShopPage({ searchParams }: PageProps) {
  const categories = await fetchCategories();
  
  // Breadcrumb structure
  const categoryName = searchParams.category 
    ? categories.find(c => c.slug === searchParams.category)?.name || "All Products"
    : null;

  return (
    <main className="w-full bg-[#f8f8f8] min-h-screen py-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0">
         {/* Breadcrumb */}
         <nav className="flex text-[13px] text-gray-500 mb-6 bg-white py-2 px-4 rounded-md shadow-sm border border-gray-100 w-full justify-center lg:justify-start">
            <ol className="flex flex-col lg:flex-row lg:items-center w-full text-center lg:text-left space-y-1 lg:space-y-0 lg:space-x-2">
              <div className="flex justify-center lg:justify-start items-center space-x-2">
                <li><a href="/" className="hover:text-blue-600 transition-colors font-medium">Home</a></li>
                <li><span>/</span></li>
                <li><a href="/shop" className="hover:text-blue-600 transition-colors font-medium">Shop</a></li>
                {categoryName && (
                  <>
                    <li><span>/</span></li>
                    <li className="text-gray-900 font-bold">{categoryName}</li>
                  </>
                )}
              </div>
            </ol>
         </nav>

         {/* Title area (Desktop design shows centered title below breadcrumbs) */}
         <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1a1a1a]">
              {categoryName || "Shop"}
            </h1>
         </div>
         
         {/* Shop Client manages Sidebar, Sort Header, and Product Grid */}
         <ShopClient initialSearchParams={searchParams} />
      </div>
    </main>
  );
}
