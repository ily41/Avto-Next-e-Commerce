"use client";

import { useCart } from "@/hooks/useCart";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { OrderSummary } from "@/components/cart/OrderSummary";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CartClient() {
  const {
    isAuth,
    guestCart,
    serverCart,
    isFetching,
    updateQuantity,
    removeItem,
    applyPromoApi,
    removePromoApi,
  } = useCart();

  const handleApplyPromo = async (code: string) => {
    if (isAuth) {
      await applyPromoApi({ promoCode: code }).unwrap();
    }
  };

  const handleRemovePromo = async () => {
    if (isAuth) {
      await removePromoApi().unwrap();
    }
  };

  const cartItems = isAuth ? serverCart?.items || [] : guestCart;
  const isEmpty = cartItems.length === 0;

  if (isEmpty) {
    return (
      <div className="text-center max-w-md mx-auto py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Səbətiniz hal-hazırda boşdur.</h2>
        <p className="text-gray-500 mb-8">Sifarişi tamamlamaq üçün səbətinizə məhsul əlavə etməlisiniz.</p>
        <Link href="/shop">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg font-medium">
            Mağazaya qayıt
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Cart Items List */}
      <div className="lg:w-2/3">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
            Səbət ({cartItems.length} məhsul)
          </h2>
          
          <div className="space-y-2">
            {cartItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:w-1/3">
        <OrderSummary
          isAuth={isAuth}
          guestCart={guestCart}
          serverCart={serverCart}
          onApplyPromo={handleApplyPromo}
          onRemovePromo={handleRemovePromo}
        />
      </div>
    </div>
  );
}
