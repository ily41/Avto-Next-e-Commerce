"use client";

import React from "react";
import Link from "next/link";
import { 
  IconMail, 
  IconBrandFacebook, 
  IconBrandTwitter, 
  IconBrandInstagram, 
  IconBrandTiktok, 
  IconBrandPinterest 
} from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Newsletter Section */}
      {/* <div className="bg-[#007aff] py-8 lg:py-12">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 text-white">
            <div className="bg-[#0066d6] p-4 rounded-xl">
              <IconMail size={32} stroke={1.5} />
            </div>
            <div>
              <h3 className="text-xl lg:text-3xl font-bold font-outfit uppercase tracking-tight leading-none mb-2">
                Join our newsletter and get $20 discount!
              </h3>
              <p className="text-white/80 text-sm lg:text-base font-medium opacity-90">
                Get E-mail updates about our latest shop and special offers.
              </p>
            </div>
          </div>

          <div className="flex w-full lg:w-auto max-w-xl">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow h-12 lg:h-14 px-6 bg-white rounded-l-xl text-gray-900 placeholder:text-gray-400 focus:outline-none font-medium"
            />
            <button className="h-12 lg:h-14 px-8 bg-[#1a1a1a] text-white font-bold rounded-r-xl hover:bg-black transition-colors uppercase tracking-wider text-sm lg:text-base whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div> */}

      {/* Links Section */}
      <div className="bg-white py-16 lg:py-20 border-b border-gray-100">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Contact Info */}
            <div className="lg:pr-8">
              <h4 className="text-lg font-bold text-gray-900 mb-8 uppercase tracking-tight font-outfit">BİZİMLƏ ƏLAQƏ</h4>
              <div className="space-y-6">
                <div>
                  <a href="tel:+994500000000" className="text-xl lg:text-2xl font-bold text-gray-900 hover:text-[#007aff] transition-colors leading-none">
                    (+994) 50 000 00 00
                  </a>
                  <p className="text-gray-500 mt-4 leading-relaxed font-medium">
                    Bakı şəhəri, Azərbaycan. <br />
                    Bütün avto ehtiyat hissələrinin online satışı.
                  </p>
                </div>
                <div>
                  <a href="mailto:info@avto027.az" className="text-gray-900 font-bold border-b-2 border-gray-900 pb-1 hover:text-[#007aff] hover:border-[#007aff] transition-colors">
                    info@avto027.az
                  </a>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <Link href="#" className="p-2 rounded-full border border-gray-100 hover:bg-[#007aff] hover:text-white transition-all text-gray-600">
                    <IconBrandFacebook size={20} stroke={1.5} />
                  </Link>
                  <Link href="#" className="p-2 rounded-full border border-gray-100 hover:bg-[#1a1a1a] hover:text-white transition-all text-gray-600">
                    <IconBrandTwitter size={20} stroke={1.5} />
                  </Link>
                  <Link href="#" className="p-2 rounded-full border border-gray-100 hover:bg-[#e1306c] hover:text-white transition-all text-gray-600">
                    <IconBrandInstagram size={20} stroke={1.5} />
                  </Link>
                  <Link href="#" className="p-2 rounded-full border border-gray-100 hover:bg-black hover:text-white transition-all text-gray-600">
                    <IconBrandTiktok size={20} stroke={1.5} />
                  </Link>
                  <Link href="#" className="p-2 rounded-full border border-gray-100 hover:bg-[#bd081c] hover:text-white transition-all text-gray-600">
                    <IconBrandPinterest size={20} stroke={1.5} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer Column 2 */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-8 uppercase tracking-tight font-outfit">BİZİ TANIYIN</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Haqqımızda</Link></li>
                <li><Link href="/privacy-policy" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Məxfilik Siyasəti</Link></li>
                <li><Link href="/terms-and-conditions" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">İstifadə Şərtləri</Link></li>
                <li><Link href="/refund-policy" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Geri Qaytarılma</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Bizimlə Əlaqə</Link></li>
              </ul>
            </div>

            {/* Footer Column 3 */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-8 uppercase tracking-tight font-outfit">MƏLUMAT</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Kömək Mərkəzi</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Rəylər</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">FAQ</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Ölçü Cədvəli</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Ödəniş Üsulları</Link></li>
              </ul>
            </div>

            {/* Footer Column 4 */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-8 uppercase tracking-tight font-outfit">SİFARİŞLƏR</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Sifarişi İzlə</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Çatdırılma</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Xidmətlər</Link></li>
                <li><Link href="/refund-policy" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Geri Qaytarma</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Dəyişdirilmə</Link></li>
              </ul>
            </div>

            {/* Footer Column 5 */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-8 uppercase tracking-tight font-outfit">MAĞAZAMIZ</h4>
              <ul className="space-y-4">
                <li><Link href="/shop" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Bütün Məhsullar</Link></li>
                <li><Link href="/shop" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Ən Çox Satılanlar</Link></li>
                <li><Link href="/shop" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Yeni Gələnlər</Link></li>
                <li><Link href="/shop" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Endirimlər</Link></li>
                <li><Link href="/shop" className="text-gray-500 hover:text-[#007aff] font-medium transition-colors">Seçilmişlər</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-[#f8f8f8] py-8">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[13px] text-gray-500 font-medium text-center md:text-left">
            © 2026 Avto027.az
          </p>
          
          {/* <div className="flex items-center gap-1">
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
               <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" alt="Visa" className="h-6 w-auto" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 w-auto" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 w-auto" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Pay_logo.svg" alt="Apple Pay" className="h-5 w-auto" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Google_Pay_Logo.svg" alt="Google Pay" className="h-5 w-auto" />
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
