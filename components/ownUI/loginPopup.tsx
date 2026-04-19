"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { useLoginMutation } from "@/lib/store/auth/apislice";
import { getRoleFromToken } from "@/lib/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { IconEye, IconEyeOff, IconX } from "@tabler/icons-react";

export function LoginPopup({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await login({ email, password }).unwrap();
      Cookies.set("token", token, { expires: 7, path: '/' });
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("auth-change"));
      const role = getRoleFromToken(token);
      toast.success("Login successful!");
      setOpen(false);
      router.refresh();
      if (role === "Admin" || role === "0") router.push("/dashboard");
      else router.push("/");
    } catch (err: any) {
      toast.error(err.data?.message || "Invalid credentials");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-xl">
        <DialogTitle className="sr-only">Login</DialogTitle>
        <div className="bg-white p-8 md:p-12 flex flex-col items-center relative">
          <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors">
            <IconX size={20} />
          </button>
          
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-gray-700">Username or email <span className="text-red-500">*</span></label>
              <input 
                type="text" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full h-11 border border-gray-200 outline-none focus:border-blue-500 text-black px-4 transition-all"
              />
            </div>
            
            <div className="flex flex-col gap-2 relative">
              <label className="text-[13px] font-bold text-gray-700">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full h-11 border border-gray-200 outline-none text-black focus:border-blue-500 px-4 pr-10 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer w-fit select-none">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-[13px] text-gray-600">Remember me</span>
            </label>

            <button 
              type="submit" disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-black text-white font-bold rounded-md transition-all active:scale-95 disabled:bg-gray-400"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <Link href="/forgot-password" onClick={() => setOpen(false)} className="text-[12px] text-gray-400 hover:text-blue-600 text-center transition-colors">
              Lost your password?
            </Link>

            <div className="mt-4 pt-6 border-t border-gray-50 text-[13px] text-gray-500 text-center">
              Don't have an account yet? <Link href="/my-account" onClick={() => setOpen(false)} className="text-blue-600 font-bold hover:underline">Sign up</Link>
            </div>
          </form>
        </div>
      </DialogContent>
      <style jsx global>{`
        @media (max-width: 768px) {
          .DialogContent * { font-size: clamp(10px, 14px, 14px) !important; }
        }
      `}</style>
    </Dialog>
  );
}
