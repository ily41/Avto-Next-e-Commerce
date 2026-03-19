import { Product } from "@/lib/store/products/apislice";
import { fullUrl } from "@/lib/utils";
import Link from "next/link";

interface MiniProductCardProps {
    product: Product;
}

const MiniProductCard = ({ product }: MiniProductCardProps) => {
    const fullImageUrl = fullUrl(product.imageUrl || product.primaryImageUrl);

    const discount = (product.discountedPrice && product.price > product.discountedPrice)
        ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
        : 0;

    return (
        <Link 
            href={`/product/${product.slug || product.id}`}
            className="group flex items-center gap-4 p-4 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:bg-gray-50/50 h-full"
        >
            <div className="w-24 h-24 flex-shrink-0 relative bg-white flex items-center justify-center p-2 rounded-lg overflow-hidden border border-gray-50">
                <img
                    src={fullImageUrl}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <h4 className="text-[14px] font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                    {product.name}
                </h4>
                <div className="mt-auto flex items-center gap-2">
                    <span className="text-[16px] font-bold text-gray-900">
                        ${product.discountedPrice || product.price}
                    </span>
                    {discount > 0 && (
                        <span className="text-[13px] text-gray-400 line-through">
                            ${product.price}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default MiniProductCard;
