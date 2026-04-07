"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/lib/store/auth/apislice";
import { toast } from "sonner";
import { IconEye, IconEyeOff, IconCheck } from "@tabler/icons-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("Invalid or missing reset token");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

    try {
      await resetPassword({ token, newPassword, confirmNewPassword: confirmPassword }).unwrap();
      toast.success("Password reset successful!");
      setTimeout(() => router.push("/my-account"), 3000);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-[450px] p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
        {isSuccess ? (
          <div className="text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
             <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                <IconCheck size={40} className="text-green-500" stroke={3} />
             </div>
             <div>
                <h2 className="text-[24px] font-bold text-gray-900 mb-2">Success!</h2>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                   Your password has been updated. Redirecting to login in a few seconds...
                </p>
             </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">New Password</h1>
              <p className="text-[14px] text-gray-500 mt-2">Enter your new secure password below.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
               <div className="flex flex-col gap-2 relative">
                  <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider">New Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      type={showPass ? "text" : "password"} required value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      className="w-full h-12 border border-gray-200 outline-none focus:border-blue-500 px-4 pr-10 rounded-sm transition-all"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                  </div>
               </div>

               <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider">Confirm Password <span className="text-red-500">*</span></label>
                  <input 
                    type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full h-12 border border-gray-200 outline-none focus:border-blue-500 px-4 rounded-sm transition-all"
                  />
               </div>

               <button 
                 type="submit" disabled={isLoading || !token}
                 className="w-full h-12 bg-blue-600 hover:bg-black text-white font-bold rounded-md transition-all active:scale-95 disabled:bg-gray-300 shadow-lg shadow-blue-100"
               >
                 {isLoading ? "Updating..." : "Update Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Yüklənir...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
