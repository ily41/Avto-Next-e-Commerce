"use client";

import React from "react";
import Link from "next/link";
import {
  IconChevronRight,
  IconPhone,
  IconMail,
  IconBrandInstagram,
  IconBrandTiktok,
  IconMapPin,
  IconSend
} from "@tabler/icons-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfc] py-12 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto mb-10 flex items-center text-sm text-gray-400 font-medium">
        <Link href="/" className="hover:text-gray-900 transition-colors font-outfit uppercase tracking-wider">Ana Səhifə</Link>
        <IconChevronRight size={14} className="mx-2 text-gray-300" />
        <span className="text-gray-600 font-outfit uppercase tracking-wider">Bizimlə Əlaqə</span>
      </nav>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight font-outfit uppercase mb-6">
                BİZİMLƏ ƏLAQƏ SAXLAYIN
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed font-medium">
                Suallarınız və ya təklifləriniz var? Bizə yazın və ya zəng edin. Komandamız sizə kömək etməkdən məmnun olacaq.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <IconPhone size={28} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 font-outfit">Telefon</h3>
                  <a href="tel:+994103165103" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors leading-none">
                    +994 10 316 51 03
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-[#f1f1f1] text-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <IconMail size={28} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 font-outfit">E-poçt</h3>
                  <a href="mailto:info@avto027.com" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors leading-none">
                    info@avto027.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-[#f1f1f1] text-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <IconMapPin size={28} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 font-outfit">Ünvan</h3>
                  <p className="text-xl font-bold text-gray-900 leading-tight">
                    Bakı şəhəri, Azərbaycan
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest font-outfit">Sosial Şəbəkələr</h3>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.tiktok.com/@avto.027?_r=1&_t=ZS-95ZGieLyRHD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all"
                >
                  <IconBrandTiktok size={24} />
                </a>
                <a
                  href="https://www.instagram.com/avto__027?igsh=dzdpbGl0d2FnNncz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#e1306c] hover:text-white hover:border-[#e1306c] transition-all"
                >
                  <IconBrandInstagram size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 font-outfit tracking-tight">BİZƏ MESAJ GÖNDƏRİN</h2>

            <form className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Ad və Soyad</label>
                  <input
                    type="text"
                    placeholder="Məsələn: Əli Əliyev"
                    className="w-full bg-[#f9f9f9] border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">E-poçt</label>
                  <input
                    type="email"
                    placeholder="Məsələn: ali@mail.com"
                    className="w-full bg-[#f9f9f9] border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mövzu</label>
                <input
                  type="text"
                  placeholder="Mesajınızın mövzusu"
                  className="w-full bg-[#f9f9f9] border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mesajınız</label>
                <textarea
                  rows={4}
                  placeholder="Bura yazın..."
                  className="w-full bg-[#f9f9f9] border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-300 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 group font-outfit uppercase tracking-widest text-sm"
              >
                GÖNDƏR
                <IconSend size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>

            {/* Subtle background element */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gray-50 rounded-full blur-3xl opacity-50 -z-0" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
