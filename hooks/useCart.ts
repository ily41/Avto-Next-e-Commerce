import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import {
  useGetCartQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useRemoveItemMutation,
  useDeleteCartMutation,
  useApplyPromoMutation,
  useRemovePromoMutation,
  Cart,
  CartItem
} from "../lib/store/cart/cartApiSlice";
import { Product } from "../lib/api/types";
import { v4 as uuidv4 } from "uuid";

const GUEST_CART_KEY = "avto_guest_cart";

export function useCart() {
  const [isAuth, setIsAuth] = useState(false);
  const [guestCart, setGuestCart] = useState<CartItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // RTK Query hooks
  const { data: serverCart, refetch, isFetching: isServerCartFetching } = useGetCartQuery(
    undefined,
    { skip: !isAuth }
  );

  const [addItemApi] = useAddItemMutation();
  const [updateItemApi] = useUpdateItemMutation();
  const [removeItemApi] = useRemoveItemMutation();
  const [applyPromoApi] = useApplyPromoMutation();
  const [removePromoApi] = useRemovePromoMutation();
  const [deleteCartApi] = useDeleteCartMutation();

  // Evaluate authentication status
  useEffect(() => {
    const token = Cookies.get("token");
    setIsAuth(!!token);
  }, []);

  // Hydrate guest cart from localStorage
  useEffect(() => {
    if (!isAuth) {
      const storedMap = localStorage.getItem(GUEST_CART_KEY);
      if (storedMap) {
        try {
          const parsed = JSON.parse(storedMap);
          setGuestCart(parsed);
        } catch (e) {
          console.error("Failed to parse guest cart", e);
        }
      }
    }
  }, [isAuth]);

  // Sync logic to run exactly once when transitioning to auth with items in guest cart
  const syncGuestCart = useCallback(async () => {
    const storedMap = localStorage.getItem(GUEST_CART_KEY);
    if (storedMap) {
      try {
        const parsed: CartItem[] = JSON.parse(storedMap);
        if (parsed.length > 0) {
          setIsSyncing(true);
          // Use Promise.allSettled to ensure we know exactly which ones succeeded
          const syncPromises = parsed.map((item) =>
            addItemApi({
              productId: item.productId,
              quantity: item.quantity,
            }).unwrap()
          );

          const results = await Promise.allSettled(syncPromises);

          const failedItems: CartItem[] = [];
          results.forEach((result, index) => {
            if (result.status === "rejected") {
              console.error("Failed to sync item", parsed[index].productId, result.reason);
              failedItems.push(parsed[index]);
            }
          });

          if (failedItems.length > 0) {
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(failedItems));
            setGuestCart(failedItems);
          } else {
            localStorage.removeItem(GUEST_CART_KEY);
            setGuestCart([]);
          }
          refetch(); // Ensure Cart is up to date after sync
        }
      } catch (e) {
        console.error("Failed to sync guest cart", e);
      } finally {
        setIsSyncing(false);
      }
    }
  }, [addItemApi, refetch]);

  useEffect(() => {
    if (isAuth && !isSyncing) {
      syncGuestCart();
    }
  }, [isAuth, syncGuestCart, isSyncing]);

  const saveGuestCart = (newCart: CartItem[]) => {
    setGuestCart(newCart);
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
  };

  const addItem = async (product: Product, quantity: number = 1) => {
    if (isAuth) {
      await addItemApi({ productId: product.id, quantity }).unwrap();
    } else {
      const existing = guestCart.find((i) => i.productId === product.id);
      let newCart = [...guestCart];
      if (existing) {
        existing.quantity += quantity;
      } else {
        const newItem: CartItem = {
          id: uuidv4(),
          productId: product.id,
          productName: product.name,
          productSku: "", // Fill if available
          productDescription: product.shortDescription || "",
          productImageUrl: product.primaryImageUrl || product.imageUrl,
          quantity: quantity,
          unitPrice: product.discountedPrice || product.price,
          totalPrice: (product.discountedPrice || product.price) * quantity,
          createdAt: new Date().toISOString(),
          product: product, // Store full product for UI convenience
        };
        newCart.push(newItem);
      }
      saveGuestCart(newCart);
    }
  };

  const updateQuantity = async (cartItemId: string, productId: string, quantity: number) => {
    if (isAuth) {
      await updateItemApi({ cartItemId, quantity }).unwrap();
    } else {
      const newCart = guestCart.map(item =>
        item.productId === productId
          ? { ...item, quantity, totalPrice: (item.unitPrice || 0) * quantity }
          : item
      );
      saveGuestCart(newCart);
    }
  };

  const removeItem = async (cartItemId: string, productId: string) => {
    if (isAuth) {
      await removeItemApi(cartItemId).unwrap();
    } else {
      const newCart = guestCart.filter((item) => item.productId !== productId);
      saveGuestCart(newCart);
    }
  };

  const deleteCart = async () => {
    if (isAuth) {
      await deleteCartApi().unwrap();
    } else {
      setGuestCart([]);
      localStorage.removeItem(GUEST_CART_KEY);
    }
  };

  return {
    isAuth,
    isSyncing,
    guestCart,
    serverCart,
    isFetching: isServerCartFetching,
    addItem,
    updateQuantity,
    removeItem,
    deleteCart,
    applyPromoApi,
    removePromoApi,
  };
}
