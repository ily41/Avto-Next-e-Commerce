"use client";

import React, { useState } from "react";

interface ProductTabsProps {
  specifications: any;
}

export default function ProductTabs({ specifications }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("specifications");

  const tabs = [
    { id: 'specifications', label: 'Xüsusiyyətlər' },
    { id: 'shipping', label: 'Çatdırılma və Qaytarılma' },
  ];

  return (
    <div className="mt-20">
      <div className="flex gap-10 border-b border-gray-100 mb-10 overflow-x-auto no-scrollbar pb-1">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-[15px] md:text-[18px] font-bold pb-4 transition-all relative whitespace-nowrap ${activeTab === tab.id ? "text-gray-900 border-b-2 border-blue-600" : "text-gray-400 hover:text-gray-600 border-b-2 border-transparent"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="text-[14px] leading-relaxed text-gray-600 max-w-4xl">
        {activeTab === 'specifications' && (
          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
             {specifications?.specificationGroups?.map((group: any, gIdx: number) => (
                <div key={gIdx} className="border-b last:border-none border-gray-100">
                   <div className="bg-gray-50/50 px-6 py-3 text-[14px] font-bold text-gray-800 uppercase tracking-wide">{group.groupName}</div>
                   <div className="flex flex-col">
                      {group.items.map((item: any, iIdx: number) => (
                         <div key={iIdx} className="grid grid-cols-2 md:grid-cols-3 px-6 py-4 border-b last:border-none border-gray-50 hover:bg-gray-50/20">
                            <span className="text-gray-500 font-medium">{item.name}</span>
                            <span className="text-gray-900 font-bold col-span-1 md:col-span-2">{item.value} {item.unit}</span>
                         </div>
                      ))}
                   </div>
                </div>
             ))}
             {(!specifications || specifications.specificationGroups?.length === 0) && (
               <div className="p-10 text-center text-gray-400">Heç bir xüsusiyyət tapılmadı.</div>
             )}
          </div>
        )}
        {activeTab === 'shipping' && (
           <div className="p-6 bg-gray-50/30 rounded-2xl border border-gray-100/50">
             <p className="mb-4">Bütün sifarişlər 3-5 iş günü ərzində operativ çatdırılır. 200 AZN-dən yuxarı bütün alış-verişlər üçün pulsuz çatdırılma xidməti mövcuddur.</p>
             <p>İstehlakçıların hüquqlarının müdafiəsi haqqında qanuna uyğun olaraq, məhsulu aldığı gündən 14 gün ərzində qaytarmaq və ya dəyişdirmək mümkündür.</p>
           </div>
        )}
      </div>
    </div>
  );
}
