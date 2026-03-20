import { IconLayoutGrid, IconList, IconFilter } from "@tabler/icons-react";

interface SortHeaderProps {
  totalItems: number;
  startItem: number;
  endItem: number;
  currentSort: string;
  onSortChange: (val: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onOpenSidebar: () => void;
}

export default function SortHeader({
  totalItems,
  startItem,
  endItem,
  currentSort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenSidebar
}: SortHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center w-full pb-4 lg:mb-4">
       {/* Left side text */}
       <div className="text-[#555555] text-sm font-medium mb-4 md:mb-0">
          Showing {startItem}–{endItem} of {totalItems} results
       </div>

       {/* Right side controls */}
       <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Mobile Filter Button */}
          <button 
             onClick={onOpenSidebar}
             className="flex lg:hidden items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-700 transition-colors w-full md:w-auto justify-center"
          >
             <IconFilter size={18} /> Filter
          </button>

          {/* Sort Dropdown */}
          <select 
             value={currentSort}
             onChange={(e) => onSortChange(e.target.value)}
             className="appearance-none bg-white border border-[#e5e5e5] text-gray-700 text-sm font-medium focus:ring-1 focus:outline-none focus:ring-blue-500 rounded-md py-2 pl-4 pr-10 hover:border-blue-400 transition-colors cursor-pointer"
             aria-label="Sort products"
          >
             <option value="default">Default sorting</option>
             <option value="name_asc">Alphabetical, A-Z</option>
             <option value="name_desc">Alphabetical, Z-A</option>
             <option value="price_asc">Price, low to high</option>
             <option value="price_desc">Price, high to low</option>
          </select>

          {/* View Toggles (Visible on larger screens typically, but can be everywhere) */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2">
             <button 
                onClick={() => onViewModeChange("grid")}
                aria-label="Grid view"
                className={`w-9 h-9 flex items-center justify-center rounded transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-[#f2f2f2] text-gray-500 hover:bg-gray-200"} cursor-pointer`}
             >
                <IconLayoutGrid size={20} />
             </button>

             <button 
                onClick={() => onViewModeChange("list")}
                aria-label="List view"
                className={`w-9 h-9 flex items-center justify-center rounded transition-colors ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-[#f2f2f2] text-gray-500 hover:bg-gray-200"} cursor-pointer`}
             >
                <IconList size={22} />
             </button>
          </div>
       </div>
    </div>
  );
}
