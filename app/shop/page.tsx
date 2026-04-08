import { Metadata } from "next";
import ShopClient from "@/components/products/ShopClient";
import { fetchCategories } from "@/lib/api/server-fetchers";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    searchTerm?: string;
    [key: string]: string | undefined;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const categories = await fetchCategories();
  const resolvedParams = await searchParams;

  const findCategory = (cats: any[], targetSlug: string): any | null => {
    for (const cat of cats) {
      if (cat.slug === targetSlug) return cat;
      if (cat.subCategories && cat.subCategories.length > 0) {
        const found = findCategory(cat.subCategories, targetSlug);
        if (found) return found;
      }
    }
    return null;
  };

  const category = resolvedParams.category
    ? findCategory(categories, resolvedParams.category)
    : null;

  const categoryName = category?.name || "Mağaza";

  return {
    title: `${categoryName} | Avto027`,
    description: `Shop for ${categoryName}`,
  };
}

export default async function ShopPage({ searchParams }: PageProps) {
  const categories = await fetchCategories();
  const resolvedParams = await searchParams;

  // Function to find category and its parent recursively
  const findCategoryWithPath = (
    cats: any[],
    targetSlug: string,
    parent: any = null
  ): { current: any; parent: any } | null => {
    for (const cat of cats) {
      if (cat.slug === targetSlug) {
        return { current: cat, parent };
      }
      if (cat.subCategories && cat.subCategories.length > 0) {
        const found = findCategoryWithPath(cat.subCategories, targetSlug, cat);
        if (found) return found;
      }
    }
    return null;
  };

  const categoryPath = resolvedParams.category
    ? findCategoryWithPath(categories, resolvedParams.category)
    : null;

  const currentCategory = categoryPath?.current;
  const parentCategory = categoryPath?.parent;

  return (
    <main className="w-full bg-[#f8f8f8] min-h-screen py-8">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-0  w-[calc(100%-2.5rem)]">
        {/* Breadcrumb */}
        <nav className="flex text-[13px] text-gray-500 mb-6 bg-white py-2 px-4 rounded-md shadow-sm border border-gray-100 w-full justify-center lg:justify-start">
          <ol className="flex flex-col lg:flex-row lg:items-center w-full text-center lg:text-left space-y-1 lg:space-y-0 lg:space-x-2">
            <div className="flex justify-center lg:justify-start items-center space-x-2">
              <li><a href="/" className="hover:text-blue-600 transition-colors font-medium">Ana Səhifə</a></li>
              <li><span>/</span></li>
              <li><a href="/shop" className="hover:text-blue-600 transition-colors font-medium">Mağaza</a></li>

              {parentCategory && (
                <>
                  <li><span>/</span></li>
                  <li><a href={`/shop?category=${parentCategory.slug}`} className="hover:text-blue-600 transition-colors font-medium">{parentCategory.name}</a></li>
                </>
              )}

              {currentCategory && (
                <>
                  <li><span>/</span></li>
                  <li className="text-gray-900 font-bold">{currentCategory.name}</li>
                </>
              )}
            </div>
          </ol>
        </nav>

        {/* Title area */}
        {/* Title area */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1a1a1a]">
            {currentCategory?.name || "Mağaza"}
          </h1>
          {resolvedParams.searchTerm && (
            <p className="text-gray-500 mt-2 text-[15px] font-medium italic">
              "{resolvedParams.searchTerm}" üçün axtarış nəticələri
            </p>
          )}
        </div>

        {/* Shop Client manages Sidebar, Sort Header, and Product Grid */}
        <ShopClient initialSearchParams={resolvedParams} />
      </div>
    </main>
  );
}
