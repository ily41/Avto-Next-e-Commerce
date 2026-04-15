"use client";

import React from "react";
import Link from "next/link";
import { IconChevronRight, IconRotate2, IconTruckReturn, IconFileCheck, IconTruckDelivery, IconCreditCard, IconReceipt } from "@tabler/icons-react";

const RefundPolicy = () => {
  const sections = [
    {
      title: "1. Geri Qaytarma Şərtləri",
      icon: <IconRotate2 size={24} className="text-[#007aff]" />,
      content: "İstehlakçıların hüquqlarının müdafiəsi haqqında AR-ın qanunvericiliyinə uyğun olaraq, müştəri aldığı məhsulu 14 gün ərzində heç bir səbəb göstərmədən geri qaytarmaq hüququna malikdir. Məhsul tam saz vəziyyətdə, orijinal qablaşdırmasında və istifadə olunmamış olmalıdır."
    },
    {
      title: "2. Qaytarılmayan Məhsullar",
      icon: <IconFileCheck size={24} className="text-[#007aff]" />,
      content: "Aşağıdakı məhsullar geri qaytarılmır və ya dəyişdirilmir:\n• İstifadə olunmuş ehtiyat hissələri\n• Qablaşdırması zədələnmiş və ya açılmış yağlar, mayelər və digər sarf materialları\n• Şəxsə özəl sifariş edilmiş məhsullar\n• Elektrik ehtiyat hissələri (qablaşdırma açıldıqdan sonra)"
    },
    {
      title: "3. Prosedur Necə İdarə Olunur?",
      icon: <IconTruckReturn size={24} className="text-[#007aff]" />,
      content: "Məhsulu geri qaytarmaq üçün bizimlə əlaqə saxlamalı və ya müştəri panelindən müraciət etməlisiniz. Müraciətiniz 24-48 saat ərzində nəzərdən keçiriləcəkdir. Təsdiq edildikdən sonra məhsulu ofisimizə və ya kuryer vasitəsilə bizə çatdırmalısınız."
    },
    {
      title: "4. Ödənişin Geri Qaytarılması",
      icon: <IconCreditCard size={24} className="text-[#007aff]" />,
      content: "Geri ödəmə məhsul qəbul edildikdən və yoxlanıldıqdan sonra 3-5 iş günü ərzində həyata keçirilir. Ödəniş həmin məhsulu aldığınız zaman istifadə etdiyiniz üsulla (kart və ya nağd) geri qaytarılacaqdır."
    },
    {
      title: "5. Zədələnmiş Məhsullar",
      icon: <IconReceipt size={24} className="text-[#007aff]" />,
      content: "Əgər məhsul sizə çatdırılan zaman zədələnmisinizsə, lütfən dərhal kuryerə bildirin və şəkilli sübutlar ilə birlikdə müştəri xidmətlərimizə müraciət edin. Belə hallarda dəyişdirilmə və ya geri qaytarma dərhal icra olunacaqdır."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="max-w-4xl mx-auto mb-8 flex items-center text-sm text-gray-500 font-medium">
        <Link href="/" className="hover:text-blue-600 transition-colors">Ana Səhifə</Link>
        <IconChevronRight size={16} className="mx-2 text-gray-400" />
        <span className="text-gray-900 font-bold">Geri Qaytarılma Siyasəti</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-500 px-8 py-12 text-white relative">
            <div className="relative z-10">
              <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <IconRotate2 size={28} />
              </div>
              <h1 className="text-4xl font-extrabold font-outfit uppercase tracking-tighter">Geri Qaytarılma Siyasəti</h1>
              <p className="mt-3 text-blue-100 text-lg font-medium">Sizin məmnuniyyətiniz bizim prioritetimizdir.</p>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <IconRotate2 size={120} />
            </div>
          </div>

          {/* Content */}
          <div className="p-10 lg:p-14">
            <div className="space-y-12">
              <div className="flex gap-6 items-start ">
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  Avto027.com platforması olaraq, müştərilərimizin alış-veriş təcrübəsinin mümkün qədər rəvan olmasını təmin etməyə çalışırıq. Aldığınız məhsul hər hansı bir səbəbdən sizi qane etmirsə, geri qaytarmaya müraciət edə bilərsiniz.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sections.map((section, idx) => (
                  <div key={idx} className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 hover:border-blue-200 transition-all group">
                    <div className="bg-blue-100/50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {section.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium text-sm whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm rotate-3">
                  <IconTruckDelivery size={48} className="text-blue-600" />
                </div>
                <div className="">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2 font-outfit uppercase tracking-tight">Kuryer vasitəsilə qaytarma</h4>
                  <p className="text-gray-600 font-medium">Bakı şəhəri daxilində geri qaytarma üçün kuryer çağıra bilərsiniz. Biz hər şeyi sizin üçün asanlaşdırırıq.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 border-t border-gray-100 flex justify-between items-center">
            <Link href="/help-center" className="text-blue-600 font-bold hover:underline">Daha çox məlumat üçün kömək mərkəzi</Link>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all">Müraciət et</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
