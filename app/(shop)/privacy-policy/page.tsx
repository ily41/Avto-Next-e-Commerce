"use client";

import React from "react";
import Link from "next/link";
import { IconChevronRight, IconShieldCheck, IconLock, IconEye, IconFileText } from "@tabler/icons-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Ümumi müddəalar",
      content: "Bu Məxfilik Siyasəti Avto027.com platformasının istifadəçilərindən toplanan məlumatların necə idarə olunduğunu tənzimləyir. Biz sizin məxfiliyinizə ciddi yanaşırıq və şəxsi məlumatlarınızın qorunmasına təminat veririk."
    },
    {
      title: "2. Hansı məlumatları toplayırıq?",
      content: "Xidmətlərimizdən istifadə edərkən biz aşağıdakı məlumatları toplaya bilərik:\n• Ad və soyad\n• Əlaqə məlumatları (email, telefon nömrəsi)\n• Çatdırılma ünvanı\n• Alış-veriş tarixçəsi\n• IP ünvanı və brauzer məlumatları"
    },
    {
      title: "3. Məlumatların istifadə məqsədi",
      content: "Toplanmış məlumatlar aşağıdakı məqsədlər üçün istifadə olunur:\n• Sifarişlərin emalı və çatdırılması\n• Müştəri xidmətlərinin təmin edilməsi\n• Yeni məhsullar və kampaniyalar haqqında məlumatlandırma\n• Platformanın təhlükəsizliyinin təmini\n• Saytın istifadə keyfiyyətinin artırılması"
    },
    {
      title: "4. Məlumatların qorunması",
      content: "Biz sizin şəxsi məlumatlarınızı icazəsiz girişlərdən, dəyişikliklərdən və ya silinmədən qorumaq üçün ən müasir təhlükəsizlik texnologiyalarından (məsələn, SSL şifrələmə) istifadə edirik."
    },
    {
      title: "5. Üçüncü tərəflərlə məlumat paylaşımı",
      content: "Avto027.com istifadəçilərin şəxsi məlumatlarını satmır və ya icarəyə vermir. Məlumatlar yalnız qanunvericiliklə tələb olunan hallarda və ya xidmətin göstərilməsi üçün zəruri olan partnyorlarla (məsələn, kuryer xidmətləri) paylaşıla bilər."
    },
    {
      title: "6. Kuki (Cookie) faylları",
      content: "Veb saytımız istifadəçi təcrübəsini yaxşılaşdırmaq üçün kuki fayllarından istifadə edir. Brauzerinizin nizamlamalarında kukiləri söndürə bilərsiniz, lakin bu halda saytın bəzi funksiyaları düzgün işləməyə bilər."
    },
    {
      title: "7. Siyasətdə dəyişikliklər",
      content: "Biz bu Məxfilik Siyasətini istənilən vaxt yeniləmək hüququnu özümüzdə saxlayırıq. Hər hansı dəyişiklik bu səhifədə dərc edildiyi andan qüvvəyə minir."
    },
    {
      title: "8. Əlaqə",
      content: "Məxfilik siyasəti ilə bağlı hər hansı sualınız olarsa, info@avto027.com ünvanına müraciət edə bilərsiniz."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="max-w-4xl mx-auto mb-8 flex items-center text-sm text-gray-500 font-medium">
        <Link href="/" className="hover:text-blue-600 transition-colors">Ana Səhifə</Link>
        <IconChevronRight size={16} className="mx-2 text-gray-400" />
        <span className="text-gray-900">Məxfilik Siyasəti</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#007aff] px-8 py-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                <IconShieldCheck size={32} />
              </div>
              <h1 className="text-3xl font-extrabold font-outfit uppercase tracking-tight">Məxfilik Siyasəti</h1>
              <p className="mt-2 text-blue-50/80 font-medium">Son yenilənmə: 3 Aprel 2026</p>
            </div>
            {/* Abstract Background Shapes */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-blue-400/20 rounded-full blur-2xl" />
          </div>

          {/* Content */}
          <div className="p-8 lg:p-12">
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600 leading-relaxed text-lg mb-10">
                Sizin məxfiliyiniz bizim üçün çox vacibdir. Aşağıda şəxsi məlumatlarınızın toplanması, istifadəsi və qorunması haqqında ətraflı məlumat ilə tanış ola bilərsiniz.
              </p>

              <div className="space-y-10">
                {sections.map((section, idx) => (
                  <div key={idx} className="group">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                      {section.title}
                    </h2>
                    <div className="text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 p-6 rounded-xl border border-transparent group-hover:border-blue-100 group-hover:bg-blue-50/10 transition-all duration-300">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Features */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <IconLock size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Təhlükəsiz Ödəniş</h3>
                  <p className="text-sm text-gray-500 font-medium">Bütün tranzaksiyalar SSL şifrələmə ilə qorunur</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <IconEye size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Məxfilik</h3>
                  <p className="text-sm text-gray-500 font-medium">Məlumatlarınız kənar şəxslərlə paylaşılmır</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <IconFileText size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Şəffaflıq</h3>
                  <p className="text-sm text-gray-500 font-medium">Məlumatların istifadəsində tam şəffaflıq</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Suallarınız var?</h3>
            <p className="text-gray-500 font-medium">Dəstək komandamız sizə kömək etməyə hazırdır.</p>
          </div>
          <Link
            href="/contact-us"
            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all hover:shadow-lg active:scale-95"
          >
            Bizimlə Əlaqə
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
