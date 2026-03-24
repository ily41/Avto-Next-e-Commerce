"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useInitiatePaymentMutation } from "@/lib/store/payment/paymentApiSlice";
import { useCart } from "@/hooks/useCart";

export function CheckoutClient() {
  const { isAuth } = useCart();
  const [initiatePayment, { isLoading }] = useInitiatePaymentMutation();
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuth) {
      alert("Unauthorized: Please log in to checkout.");
      return;
    }
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      customerName: formData.get("name") as string || "Guest",
      customerEmail: formData.get("email") as string || "guest@example.com",
      customerPhone: formData.get("phone") as string || "1234567890",
      shippingAddress: formData.get("address") as string || "123 Main St",
      notes: "Mock Checkout",
      installmentOptionId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      walletAmountToUse: 0
    };

    try {
      const result = await initiatePayment(payload).unwrap();
      if (result.redirectUrl) {
         window.location.href = result.redirectUrl;
      } else {
         setErrorMsg("No redirect URL provided by payment gateway.");
      }
    } catch (err: any) {
      setErrorMsg(err.data?.message || err.message || "Payment initiation failed");
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Checkout Placeholder</h1>
      {errorMsg && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{errorMsg}</div>}
      
      <form onSubmit={handleCheckout} className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input name="name" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input name="email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="john@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input name="phone" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="555-0100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input name="address" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="123 Example St" />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#1a1a1a] hover:bg-blue-600 text-white py-6 mt-4"
        >
          {isLoading ? "Initiating..." : "Pay Now"}
        </Button>
      </form>
    </>
  );
}
