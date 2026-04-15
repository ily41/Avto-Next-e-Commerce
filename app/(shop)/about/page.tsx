"use client";

import React from "react";
import Link from "next/link";
import { 
  IconChevronRight, 
  IconInfoCircle, 
  IconTarget, 
  IconCar, 
  IconCreditCard, 
  IconTruck, 
  IconDeviceMobile
} from "@tabler/icons-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfc] py-12 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="max-w-5xl mx-auto mb-10 flex items-center text-sm text-gray-400 font-medium">
        <Link href="/" className="hover:text-gray-900 transition-colors font-outfit uppercase tracking-wider">Ana Səhifə</Link>
        <IconChevronRight size={14} className="mx-2 text-gray-300" />
        <span className="text-gray-600 font-outfit uppercase tracking-wider">Haqqımızda</span>
      </nav>

      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header Section */}
        <section className="relative bg-[#fafafa] rounded-[2rem] border border-gray-100 overflow-hidden px-8 py-16 lg:px-16 text-center">
            <div className="mx-auto bg-gray-900/5 w-20 h-20 rounded-2xl flex items-center justify-center mb-8">
                <IconInfoCircle size={40} className="text-gray-800" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight font-outfit uppercase mb-6">
                AVTO 027 — HAQQIMIZDA
            </h1>
            <p className="max-w-3xl mx-auto text-lg text-gray-500 leading-relaxed font-medium">
                Azərbaycanın avtomobil aksesuarları sahəsində müasir, etibarlı və innovativ brendi.
            </p>
            
            {/* Subtle background element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" />
        </section>

        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3 font-outfit tracking-tight">
                    <span className="w-1.5 h-8 bg-blue-600/80 rounded-full" />
                    Brendimizin Hekayəsi
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                    <p>
                        AVTO 027 avtomobil aksesuarları sahəsində müasir və etibarlı xidmət göstərmək məqsədilə yaradılmış bir brenddir. 
                        Fəaliyyətə başladığımız ilk gündən etibarən əsas məqsədimiz bazarda fərqli olmaq və müştərilərə daha əlçatan, 
                        daha rahat alış imkanı təqdim etmək olmuşdur.
                    </p>
                    <p>
                        İlk olaraq kiçik miqyaslı satışlarla fəaliyyətə başlayan AVTO 027, qısa müddət ərzində müştəri etimadı qazanaraq fəaliyyətini genişləndirmişdir. 
                        Sosial şəbəkələr üzərindən aktiv satışlar, xüsusilə TikTok platformasında həyata keçirilən paylaşımlar sayəsində geniş auditoriyaya çatmağı bacarmışıq.
                    </p>
                </div>
            </div>
            <div className="bg-[#f5f5f5] rounded-3xl aspect-[4/3] flex items-center justify-center relative shadow-inner border border-gray-100 p-8">
                <div className="text-center space-y-4">
                    <IconCar size={80} className="mx-auto text-gray-300" stroke={1.5} />
                    <p className="text-gray-400 font-medium font-outfit uppercase tracking-widest text-sm">Automotive Excellence</p>
                </div>
                {/* Decorative circle */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-50/50 rounded-full border border-blue-100/50 -z-10" />
            </div>
        </section>

        {/* Services / What we do */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { title: "Aksesuar Satışı", desc: "Keyfiyyətli dinamiklər, maqnitolalar və çexollar", icon: <IconCar size={24} /> },
                { title: "Kredit İmkanı", desc: "İlkin ödənişsiz, əlçatan və sadə kredit sistemi", icon: <IconCreditCard size={24} /> },
                { title: "Sürətli Çatdırılma", desc: "Azərbaycanın bütün bölgələrinə xidmət", icon: <IconTruck size={24} /> },
                { title: "Onlayn & Fiziki", desc: "Həm sayt üzərindən, həm də mağazadan alış", icon: <IconDeviceMobile size={24} /> },
            ].map((item, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-100 transition-all hover:shadow-sm">
                    <div className="w-12 h-12 bg-gray-50 text-gray-800 rounded-xl flex items-center justify-center mb-6">
                        {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 font-outfit">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
            ))}
        </section>

        {/* Goals Section */}
        <section className="bg-gray-900 rounded-[2.5rem] p-10 lg:p-20 text-white overflow-hidden relative">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider mb-8 font-outfit">
                        <IconTarget size={16} /> BİZİM MƏQSƏDİMİZ
                   </div>
                   <h2 className="text-4xl font-bold mb-6 font-outfit uppercase leading-tight">
                        Sadəcə məhsul deyil, zövq və rahatlıq satırıq.
                   </h2>
                   <p className="text-gray-400 text-lg leading-relaxed mb-8">
                        Biz insanların avtomobillərini daha rahat, daha funksional və daha zövqlü hala gətirməsinə kömək edirik.
                   </p>
                </div>
                <div className="space-y-4">
                    {[
                        "Hər büdcəyə uyğun məhsullar təqdim etmək",
                        "Kredit sistemini daha əlçatan və sadə etmək",
                        "Müştərilərlə uzunmüddətli etibarlı əlaqə qurmaq",
                        "Ölkənin ən tanınmış avto aksesuar brendinə çevrilmək"
                    ].map((goal, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                                <span className="text-[10px] font-bold">{i + 1}</span>
                            </div>
                            <span className="font-medium text-gray-100">{goal}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Pattern Overlay */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </section>

        {/* Call to Action */}
        <section className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-outfit uppercase tracking-tight">Hər hansı sualınız var?</h3>
            <div className="flex flex-wrap justify-center gap-4">
                <Link 
                    href="/contact-us" 
                    className="bg-gray-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-black transition-all hover:shadow-lg active:scale-95 font-outfit uppercase tracking-wider text-sm"
                >
                    Bizimlə Əlaqə
                </Link>
                <Link 
                    href="/shop" 
                    className="bg-white text-gray-900 border border-gray-200 px-10 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95 font-outfit uppercase tracking-wider text-sm"
                >
                    Məhsullara Bax
                </Link>
            </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
