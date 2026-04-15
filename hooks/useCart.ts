import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  useGetCartQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useRemoveItemMutation,
  useDeleteCartMutation,
  useApplyPromoMutation,
  useRemovePromoMutation,
  CartItem
} from "../lib/store/cart/cartApiSlice";
import { Product } from "../lib/api/types";
import { useAuth } from "./useAuth";
import { RootState } from "../lib/store/store";
import { setGuestItems, clearGuestCart as clearGuestCartAction } from "../lib/store/cart/cartSlice";
import { toast } from "sonner";

export function useCart() {
  const dispatch = useDispatch();
  const { isAuth } = useAuth();
  const guestCart = useSelector((state: RootState) => state.cart.guestItems);
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

  // Sync logic to run exactly once when transitioning to auth with items in guest cart
  const syncGuestCart = useCallback(async () => {
    if (guestCart.length > 0) {
      setIsSyncing(true);
      try {
        const syncPromises = guestCart.map((item) =>
          addItemApi({
            productId: item.productId,
            quantity: item.quantity,
          }).unwrap()
        );

        const results = await Promise.allSettled(syncPromises);

        const failedItems: CartItem[] = [];
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            console.error("Failed to sync item", guestCart[index].productId, result.reason);
            failedItems.push(guestCart[index]);
          }
        });

        if (failedItems.length > 0) {
          toast.error(`${failedItems.length} məhsul səbətə sinxronizasiya edilə bilmədi.`);
        }
        // Həmişə qonaq səbətini təmizlə ki, sonsuz dövrə (infinite loop) yaranmasın
        dispatch(clearGuestCartAction());
        refetch();
      } catch (e) {
        console.error("Failed to sync guest cart", e);
        toast.error("Səbəti sinxronlaşdırmaq mümkün olmadı.");
      } finally {
        setIsSyncing(false);
      }
    }
  }, [addItemApi, refetch, guestCart, dispatch]);

  useEffect(() => {
    if (isAuth && !isSyncing && guestCart.length > 0) {
      syncGuestCart();
    }
  }, [isAuth, syncGuestCart, isSyncing, guestCart.length]);

  const addItem = async (product: Product, quantity: number = 1) => {
    if (isAuth) {
      try {
        await addItemApi({ productId: product.id, quantity }).unwrap();
      } catch (err: any) {
        let errorMsg = "Məhsul səbətə əlavə edilə bilmədi.";
        if (err?.data) {
          if (typeof err.data === 'string') errorMsg = err.data;
          else if (err.data.message) errorMsg = err.data.message;
          else if (err.data.error) errorMsg = err.data.error;
        }
        toast.error(errorMsg);
        throw err;
      }
    } else {
      const existingIndex = guestCart.findIndex((i) => i.productId === product.id);
      let newCart;

      if (existingIndex > -1) {
        newCart = guestCart.map((item, index) => {
          if (index === existingIndex) {
            const newQuantity = item.quantity + quantity;
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: (item.unitPrice || 0) * newQuantity
            };
          }
          return item;
        });
      } else {
        const newItem: CartItem = {
          id: uuidv4(),
          productId: product.id,
          productName: product.name,
          productSku: product.sku || "",
          productDescription: product.shortDescription || "",
          productImageUrl: product.primaryImageUrl || product.imageUrl,
          quantity: quantity,
          unitPrice: product.discountedPrice || product.price,
          totalPrice: (product.discountedPrice || product.price) * quantity,
          createdAt: new Date().toISOString(),
          product: product,
        };
        newCart = [...guestCart, newItem];
      }
      dispatch(setGuestItems(newCart));
    }
  };

  const updateQuantity = async (cartItemId: string, productId: string, quantity: number) => {
    if (isAuth) {
      try {
        await updateItemApi({ cartItemId, quantity }).unwrap();
      } catch (err: any) {
        let errorMsg = "Miqdar yenilənə bilmədi.";
        if (err?.data) {
          if (typeof err.data === 'string') errorMsg = err.data;
          else if (err.data.message) errorMsg = err.data.message;
          else if (err.data.error) errorMsg = err.data.error;
        }
        toast.error(errorMsg);
        throw err;
      }
    } else {
      const newCart = guestCart.map(item =>
        item.productId === productId
          ? { ...item, quantity, totalPrice: (item.unitPrice || 0) * quantity }
          : item
      );
      dispatch(setGuestItems(newCart));
    }
  };

  const removeItem = async (cartItemId: string, productId: string) => {
    if (isAuth) {
      try {
        await removeItemApi(cartItemId).unwrap();
      } catch (err: any) {
        let errorMsg = "Məhsul silinə bilmədi.";
        if (err?.data) {
          if (typeof err.data === 'string') errorMsg = err.data;
          else if (err.data.message) errorMsg = err.data.message;
          else if (err.data.error) errorMsg = err.data.error;
        }
        toast.error(errorMsg);
        throw err;
      }
    } else {
      const newCart = guestCart.filter((item) => item.productId !== productId);
      dispatch(setGuestItems(newCart));
    }
  };

  const deleteCart = async () => {
    if (isAuth) {
      try {
        await deleteCartApi().unwrap();
      } catch (err: any) {
        let errorMsg = "Səbət silinə bilmədi.";
        if (err?.data) {
          if (typeof err.data === 'string') errorMsg = err.data;
          else if (err.data.message) errorMsg = err.data.message;
          else if (err.data.error) errorMsg = err.data.error;
        }
        toast.error(errorMsg);
        throw err;
      }
    } else {
      dispatch(clearGuestCartAction());
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
