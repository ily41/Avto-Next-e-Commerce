const CategoryCardSkeleton = () => {
    return (
        <div className="flex flex-col items-center" aria-hidden="true">
            {/* Image area */}
            <div className="w-full aspect-square bg-blue-50 rounded-2xl animate-pulse" />
            {/* Text lines */}
            <div className="mt-3 flex flex-col items-center gap-2 w-full px-2">
                <div className="h-3.5 w-3/4 bg-blue-100 rounded-md animate-pulse" />
                <div className="h-3 w-1/2 bg-blue-50 rounded-md animate-pulse" />
            </div>
        </div>
    );
};

export default CategoryCardSkeleton;
