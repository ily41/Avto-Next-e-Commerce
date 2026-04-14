import { CheckoutModal } from "@/components/checkout/CheckoutClient";

/**
 * /checkout is now handled as a modal inside the Cart page.
 * This page acts as a deep-link fallback or SEO route.
 */
export default function CheckoutPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-2">
        <p className="text-gray-500 text-sm">Yönləndirilir...</p>
        <a href="/cart" className="text-blue-600 font-bold text-sm underline">
          Səbətə qayıt
        </a>
      </div>
    </div>
  );
}
