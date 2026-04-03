"use client";

import React from "react";
import Link from "next/link";
import { IconChevronRight, IconScale, IconGavel, IconCreditCard, IconTruck, IconRotate2, IconClipboardCheck } from "@tabler/icons-react";

const TermsAndConditions = () => {
  const sections = [
    {
      title: "1. Ümumi müddəalar",
      icon: <IconScale size={24} className="text-blue-600" />,
      content: "Bu sənəd Avto027.az veb saytından istifadə edərkən müştərilərin və platformanın qarşılıqlı öhdəliklərini müəyyən edir. Saytdan istifadə etməklə siz bütün şərtləri qəbul etmiş sayılırsınız."
    },
    {
      title: "2. Qeydiyyat və Hesab Təhlükəsizliyi",
      icon: <IconClipboardCheck size={24} className="text-blue-600" />,
      content: "İstifadəçilər qeydiyyat zamanı təqdim etdikləri məlumatların doğruluğuna görə məsuliyyət daşıyırlar. Hesab məlumatlarının (parol və s.) məxfi saxlanılması istifadəçinin öz üzərinə düşən öhdəlikdir."
    },
    {
      title: "3. Sifariş və Ödəniş",
      icon: <IconCreditCard size={24} className="text-blue-600" />,
      content: "Sayt vasitəsilə verilən sifarişlər yalnız ödəniş təsdiq edildikdən sonra emal olunur. Biz istənilən sifarişi (məsələn, səhv qiymət göstərildikdə) ləğv etmək hüququnu özümüzdə saxlayırıq."
    },
    {
      title: "4. Çatdırılma Şərtləri",
      icon: <IconTruck size={24} className="text-blue-600" />,
      content: "Çatdırılma müddəti və qiyməti sifarişin növündən və çatdırılma ünvanından asılı olaraq dəyişə bilər. Avto027.az for-major hallarda çatdırılma müddətində yarana biləcək gecikmələrə görə məsuliyyət daşımır."
    },
    {
      title: "5. Məhsulun Geri Qaytarılması",
      icon: <IconRotate2 size={24} className="text-blue-600" />,
      content: "Müştəri qanunvericiliklə müəyyən edilmiş müddət ərzində (adətən 14 gün) məhsulu qablaşdırması zədələnmədən və istifadə olunmadan geri qaytara bilər. Detallar 'Geri Qaytarılma Siyasəti' bölməsində göstərilmişdir."
    },
    {
      title: "6. Əqli Mülkiyyət",
      icon: <IconGavel size={24} className="text-blue-600" />,
      content: "Saytda yerləşdirilən bütün mətnlər, şəkillər, loqolar və proqram təminatı Avto027.az-ın mülkiyyətidir. Onların icazəsiz kopyalanması və ya istifadəsi qadağandır."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="max-w-4xl mx-auto mb-8 flex items-center text-sm text-gray-500 font-medium">
        <Link href="/" className="hover:text-blue-600 transition-colors">Ana Səhifə</Link>
        <IconChevronRight size={16} className="mx-2 text-gray-400" />
        <span className="text-gray-900">İstifadə Şərtləri</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#1a1a1a] px-8 py-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                <IconGavel size={32} />
              </div>
              <h1 className="text-3xl font-extrabold font-outfit uppercase tracking-tight">İstifadə Şərtləri</h1>
              <p className="mt-2 text-white/60 font-medium font-outfit">Hüquqi tənzimləmələr və xidmət şərtlərimiz</p>
            </div>
            {/* Dark Mode Style Background */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="p-8 lg:p-12">
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600 leading-relaxed text-lg mb-12">
                Hörmətli müştəri, platformamızdan istifadə etməzdən əvvəl aşağıdakı şərtlər ilə ətraflı tanış olmağınızı xahiş edirik.
              </p>

              <div className="grid grid-cols-1 gap-12">
                {sections.map((section, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <div className="shrink-0 bg-blue-50 p-4 rounded-2xl">
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
                      <div className="text-gray-600 leading-relaxed bg-gray-50/30 p-4 rounded-xl border border-gray-100">
                        {section.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 p-8 bg-blue-600 rounded-3xl text-white flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="max-w-md">
                  <h3 className="text-2xl font-bold mb-2 font-outfit uppercase tracking-tight">Qaydaları qəbul edirsiniz?</h3>
                  <p className="text-blue-100/90 font-medium">Platformadan istifadəyə davam etməklə siz bu şərtləri avtomatik olaraq qəbul edirsiniz.</p>
                </div>
                <Link 
                  href="/shop" 
                  className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all hover:shadow-xl active:scale-95 whitespace-nowrap"
                >
                  Alış-verişə davam et
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
