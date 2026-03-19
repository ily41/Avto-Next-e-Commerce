"use client";

const SkeletonBox = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse rounded-md bg-blue-100 ${className}`} />
);

// Varying widths for realism (in Tailwind w-* steps)
const widths = ["w-28", "w-24", "w-32", "w-20", "w-28", "w-24", "w-20", "w-32", "w-24", "w-28"];

const CategoryMenuSkeleton = () => {
    return (
        <div className="w-full bg-white border border-blue-100 rounded-lg mt-2 overflow-hidden">
            {/* Header — mirrors real blue-600 header bar */}
            <div className="bg-blue-600/10 px-5 py-[13.5px] flex items-center rounded-t-lg">
                <SkeletonBox className="h-[18px] w-[18px] mr-3 bg-blue-200" />
                <SkeletonBox className="h-4 w-32 bg-blue-200" />
            </div>

            <ul className="flex flex-col">
                {/* "Our Store" bold row */}
                <li className="px-5 py-3.5 flex justify-between items-center border-b border-blue-50">
                    <SkeletonBox className="h-4 w-20 bg-blue-200" />
                    <SkeletonBox className="h-4 w-4 bg-blue-200" />
                </li>

                {/* Regular category rows */}
                {widths.map((w, i) => (
                    <li key={i} className="px-5 py-3.5 flex justify-between items-center border-b border-blue-50 last:border-0">
                        <SkeletonBox className={`h-3.5 ${w}`} />
                        <SkeletonBox className="h-3.5 w-3.5" />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryMenuSkeleton;
