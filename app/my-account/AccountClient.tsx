"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IconChevronRight, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useLoginMutation, useRegisterMutation } from "@/lib/store/auth/apislice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getRoleFromToken } from "@/lib/utils";

const LOCAL = {
  home: "Ana səhifə",
  account: "Hesabım",
  login: "Giriş",
  register: "Qeydiyyat",
  usernameEmail: "İstifadəçi adı və ya e-poçt ünvanı",
  password: "Şifrə",
  rememberMe: "Məni xatırla",
  logIn: "Daxil ol",
  lostPassword: "Şifrənizi unutmusunuz?",
  username: "İstifadəçi adı",
  email: "E-poçt ünvanı",
  disclosure: "Şəxsi məlumatlarınız bu veb-saytdakı təcrübənizi dəstəkləmək, hesabınıza girişi idarə etmək və Məxfilik siyasətimizdə təsvir olunan digər məqsədlər üçün istifadə ediləcəkdir.",
};

export default function AccountClient() {
  const router = useRouter();
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  // Register State
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regConfirmPass, setRegConfirmPass] = useState("");
  const [register, { isLoading: isRegLoading }] = useRegisterMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await login({ email: loginEmail, password: loginPass }).unwrap();
      Cookies.set("token", token, { expires: 7, path: '/' });
      window.dispatchEvent(new Event("auth-change"));
      const role = getRoleFromToken(token);
      toast.success("Giriş uğurludur!");
      router.refresh();
      if (role === "Admin" || role === "0") router.push("/dashboard");
      else router.push("/");
    } catch (err: any) {
      toast.error(err.data?.message || "Məlumatlar yanlışdır");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        firstName: regFirstName,
        lastName: regLastName,
        email: regEmail,
        phoneNumber: regPhone,
        password: regPass,
        confirmPassword: regConfirmPass || regPass, // API requirement
      }).unwrap();
      toast.success("Hesab yaradıldı! Zəhmət olmasa daxil olun.");
      // Clear reg fields
      setRegEmail(""); setRegPass("");
    } catch (err: any) {
      toast.error(err.data?.message || "Qeydiyyat alınmadı");
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-[#1a1a1a]">
      {/* Breadcrumb Area */}
      <div className="bg-[#f8f8f8] py-8 border-b border-gray-100 flex flex-col items-center">
        <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium uppercase tracking-tight mb-2">
           <Link href="/" className="hover:text-blue-600 transition-colors uppercase">{LOCAL.home}</Link>
           <IconChevronRight size={14} className="opacity-50" />
           <span className="text-gray-900 uppercase">{LOCAL.account}</span>
        </div>
        <h1 className="text-[32px] md:text-[40px] font-bold text-gray-900">{LOCAL.account}</h1>
      </div>

      <div className="max-w-[1240px] mx-auto mt-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          
          {/* LOGIN SECTION */}
          <div className="flex flex-col">
             <h2 className="text-[24px] md:text-[28px] font-bold mb-8">{LOCAL.login}</h2>
             <form onSubmit={handleLogin} className="border border-gray-200 rounded-lg p-6 md:p-10 flex flex-col gap-6 shadow-sm">
                <div className="flex flex-col gap-2">
                   <label className="text-[14px] font-bold text-gray-700">{LOCAL.usernameEmail} <span className="text-red-500">*</span></label>
                   <input 
                     type="text" 
                     required
                     value={loginEmail}
                     onChange={(e) => setLoginEmail(e.target.value)}
                     className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-blue-500 outline-none transition-all"
                   />
                </div>
                <div className="flex flex-col gap-2 relative">
                   <label className="text-[14px] font-bold text-gray-700">{LOCAL.password} <span className="text-red-500">*</span></label>
                   <div className="relative">
                      <input 
                        type={showLoginPass ? "text" : "password"} 
                        required
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-blue-500 outline-none transition-all pr-12"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowLoginPass(!showLoginPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                         {showLoginPass ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                      </button>
                   </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                   <button 
                     type="submit" 
                     disabled={isLoginLoading}
                     className="bg-blue-600 hover:bg-black text-white font-bold py-3 px-10 rounded-md transition-all active:scale-95 disabled:bg-gray-400"
                   >
                     {isLoginLoading ? "Daxil olur..." : LOCAL.logIn}
                   </button>
                   <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                      <span className="text-[14px] text-gray-600">{LOCAL.rememberMe}</span>
                   </label>
                </div>
                <Link href="/forgot-password" className="text-blue-600 hover:text-black transition-colors text-[14px] mt-2 underline decoration-blue-100 underline-offset-4">
                   {LOCAL.lostPassword}
                </Link>
             </form>
          </div>

          {/* REGISTER SECTION */}
          <div className="flex flex-col">
             <h2 className="text-[24px] md:text-[28px] font-bold mb-8">{LOCAL.register}</h2>
             <form onSubmit={handleRegister} className="border border-gray-200 rounded-lg p-6 md:p-10 flex flex-col gap-6 shadow-sm">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-[13px] font-bold text-gray-700">Ad <span className="text-red-500">*</span></label>
                       <input type="text" required value={regFirstName} onChange={e => setRegFirstName(e.target.value)} className="w-full h-11 px-4 border border-gray-200 rounded-sm focus:border-blue-500 outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[13px] font-bold text-gray-700">Soyad <span className="text-red-500">*</span></label>
                       <input type="text" required value={regLastName} onChange={e => setRegLastName(e.target.value)} className="w-full h-11 px-4 border border-gray-200 rounded-sm focus:border-blue-500 outline-none" />
                    </div>
                 </div>
                <div className="flex flex-col gap-2">
                   <label className="text-[13px] font-bold text-gray-700">{LOCAL.email} <span className="text-red-500">*</span></label>
                   <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} className="w-full h-11 px-4 border border-gray-200 rounded-sm focus:border-blue-500 outline-none" />
                </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-gray-700">Telefon <span className="text-red-500">*</span></label>
                    <input type="tel" required value={regPhone} onChange={e => setRegPhone(e.target.value)} className="w-full h-11 px-4 border border-gray-200 rounded-sm focus:border-blue-500 outline-none" />
                 </div>
                <div className="flex flex-col gap-2 relative">
                   <label className="text-[13px] font-bold text-gray-700">{LOCAL.password} <span className="text-red-500">*</span></label>
                   <div className="relative">
                      <input type={showRegPass ? "text" : "password"} required value={regPass} onChange={e => setRegPass(e.target.value)} className="w-full h-11 px-4 border border-gray-200 rounded-sm focus:border-blue-500 outline-none pr-10" />
                      <button type="button" onClick={() => setShowRegPass(!showRegPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                         {showRegPass ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                      </button>
                   </div>
                </div>
                                <p className="text-[12px] md:text-[13px] leading-relaxed text-gray-500 mt-2">
                    {LOCAL.disclosure} <Link href="/privacy-policy" className="text-blue-600 hover:text-black">Məxfilik siyasəti</Link>.
                 </p>

                 <button 
                   type="submit" 
                   disabled={isRegLoading}
                   className="bg-blue-600 hover:bg-black text-white font-bold py-3 px-10 rounded-md transition-all active:scale-95 disabled:bg-gray-400 w-fit"
                 >
                    {isRegLoading ? "Qeydiyyatdan keçir..." : LOCAL.register}
                 </button>
             </form>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          * { font-size: clamp(10px, 14px, 14px) !important; }
        }
      `}</style>
    </div>
  );
}
