"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IconChevronRight, IconArrowLeft } from "@tabler/icons-react";
import { useForgotPasswordMutation } from "@/lib/store/auth/apislice";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      toast.success("Reset link sent!");
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-[#1a1a1a]">
      {/* Breadcrumb Area */}
      <div className="bg-[#f8f8f8] py-8 border-b border-gray-100 flex flex-col items-center">
        <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium uppercase mb-2">
           <Link href="/" className="hover:text-blue-600">Home</Link>
           <IconChevronRight size={14} className="opacity-50" />
           <Link href="/my-account" className="hover:text-blue-600">My Account</Link>
           <IconChevronRight size={14} className="opacity-50" />
           <span className="text-gray-900">Forgot Password</span>
        </div>
        <h1 className="text-[32px] font-bold text-gray-900">Lost Password</h1>
      </div>

      <div className="max-w-[500px] mx-auto mt-20 px-4">
        {isSuccess ? (
          <div className="bg-green-50 p-10 rounded-xl border border-green-100 text-center flex flex-col items-center gap-6">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                <IconChevronRight size={32} className="text-green-500" />
             </div>
             <p className="text-[15px] text-green-800 leading-relaxed font-medium">
               A password reset link has been sent to your email address. Please check your inbox and follow the instructions.
             </p>
             <Link href="/my-account" className="text-blue-600 font-bold hover:underline flex items-center gap-2">
                <IconArrowLeft size={18} /> Back to Login
             </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <p className="text-[14px] text-gray-500 text-center leading-relaxed">
              Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.
            </p>
            <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-8 flex flex-col gap-6 shadow-sm">
               <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-gray-700">Username or email <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-11 border border-gray-200 outline-none focus:border-blue-500 px-4"
                  />
               </div>
               <button 
                 type="submit"
                 disabled={isLoading}
                 className="w-full h-12 bg-blue-600 hover:bg-black text-white font-bold rounded-md transition-all disabled:bg-gray-300"
               >
                 {isLoading ? "Sending..." : "Reset password"}
               </button>
            </form>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          * { font-size: clamp(10px, 14px, 14px) !important; }
        }
      `}</style>
    </div>
  );
}
