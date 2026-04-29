"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useInitiatePaymentMutation } from "@/lib/store/payment/paymentApiSlice";
import { useCalculateExpargoFeeQuery } from "@/lib/store/payment/expargoApiSlice";
import { useGetCartMinimumAmountQuery } from "@/lib/store/settings/apislice";
import { toast } from "sonner";
import { X, User, Mail, Phone, MapPin, FileText, Package2, Truck, CreditCard, AlertCircle, ChevronDown, Loader2, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Types ──────────────────────────────────────────────────────────────────────
interface CheckoutFormValues {
  shippingMethod: "Azerpost" | "Expargo" | "FreeDelivery";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  notes: string;
  deliveryPostCode: string;
  userPassport: string;
  packageWeight: number;
  fragile: boolean;
  deliveryType: "0" | "1";
  walletAmountToUse: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  packageWeight: number;
  walletBalance?: number;
}

// ── Validators ─────────────────────────────────────────────────────────────────
const AZ_POSTCODE_RE = /^AZ\d{4}$/i;
const PASSPORT_RE = /^[A-Z]{2}\d{7}$/i;

const EXPARGO_LOCATIONS = {
  filiallar: [
    "28 May Filialı", "Gənclik Filialı", "İçərişəhər Filialı", "Həzi Aslanov filialı", "Xətai filialı",
    "Nərimanov Filialı", "Əcəmi filialı", "Əhmədli Filialı", "Elmlər - Statistika Filialı", "Bakıxanov Filialı",
    "İnşaatçılar Filialı", "Sumqayıt Filialı", "Xırdalan Filialı", "20 Yanvar Filialı", "Sədərək Filialı",
    "Azadlıq Filialı", "Neftçilər Filialı", "Gəncə Filialı", "Q.Qarayev Filialı", "Zaqatala Filialı",
    "Naxçıvan Filialı", "Lənkəran Filialı"
  ],
  servicePoints: [
    "Metro 8 Noyabr T/M", "Albalılıq T/M", "Mərdəkan T/M", "Masazır T/M", "Şüvəlan T/M", "Bayıl T/M",
    "Hövsan T/M", "Yeni Günəşli T/M", "Badamdar T/M", "Zabrat T/M", "Əmircan T/M", "Buzovna T/M",
    "H. Zeynalabdin T/M", "Yeni Ramana T/M", "Xirdalan - AAAF Park T/M", "9-cu Mikrorayon T/M",
    "Binə Qəsəbəsi T/M", "Qaraçuxur T/M", "Məmmədli T/M", "Lökbatan T/M", "Mehdiabad T/M", "NZS T/M",
    "Köhnə Günəşli T/M", "Pirallahi T/M", "Biləcəri T/M", "Binəqədi T/M", "Sabunçu T/M",
    "Xalqlar Dostluğu T/M", "Gülüstan T/M (Gəncə)", "Müşfiqabad T/M", "Keşlə T/M", "Yeni Suraxanı T/M",
    "Yeni Yasamal T/M", "Sumqayıt 18 mkr T/M", "Gəncə prospekti T/M", "Maştağa T/M", "Zığ T/M",
    "Qəbələ T/M", "Yeni Gəncə T/M", "Şəki T/M", "Xaçmaz T/M", "Qazax T/M", "Ağstafa T/M", "Quba T/M",
    "Balakən T/M", "Mingəçevir T/M", "Ağdaş T/M", "Astara T/M", "Salyan T/M", "Masallı T/M",
    "İsmayıllı T/M", "Tovuz T/M", "Şəmkir T/M", "Füzuli T/M", "Bərdə T/M", "Şirvan T/M",
    "Cəlilabad T/M", "Goranboy T/M", "Gədəbəy T/M", "Göyçay T/M", "Ağsu T/M", "Qax T/M",
    "Ordubad T/M", "Beyləqan T/M", "Şərur T/M", "Şabran T/M", "Ağdam T/M", "Ağcabədi T/M",
    "Biləsuvar T/M", "Hacıqabul T/M", "Göygöl (Xanlar) T/M", "İmişli T/M", "Kürdəmir T/M",
    "Qobustan T/M", "Qusar T/M", "Naftalan T/M", "Neftçala T/M", "Oğuz T/M", "Saatlı T/M",
    "Samux T/M", "Siyəzən T/M", "Sabirabad T/M", "Tərtər T/M", "Ucar T/M", "Yardımlı T/M",
    "Yevlax T/M", "Şamaxı T/M", "Zərdab T/M", "Qax (Yarmarka) T/M", "Quba-Nügədi T/M",
    "Binə - Atçılıq T/M", "Sahil Qəsəbəsi T/M", "Metro Nizami T/M", "Montin T/M", "Bakıxanov Stansiya T/M",
    "Dəliməmmədli T/M", "Hökməli T/M", "Mingəçevir QRES T/M", "Xudat T/M",
    "Sumqayıt 21-ci məhəllə (Dejurni)", "Xaldan Yevlax T/M", "Gəncə-2 T/M", "Ceyranbatan T/M",
    "Nargilə T/M", "Binəqədi Şosesi T/M", "Qobu Park 2 T/M", "Şüvəlan QRES T/M", "Metro Nəsimi T/M",
    "8km bazarı T/M", "Zığ 2"
  ]
};

// ── Component ──────────────────────────────────────────────────────────────────
export function CheckoutModal({ isOpen, onClose, totalAmount, packageWeight, walletBalance = 0 }: CheckoutModalProps) {
  const [initiatePayment, { isLoading }] = useInitiatePaymentMutation();
  const { data: minAmountData } = useGetCartMinimumAmountQuery();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      shippingMethod: "FreeDelivery",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
      notes: "",
      deliveryPostCode: "",
      userPassport: "",
      packageWeight: packageWeight || 0.5,
      fragile: false,
      deliveryType: "0",
      walletAmountToUse: 0,
    },
  });

  const selectedMethod = watch("shippingMethod");
  const currentWeight = watch("packageWeight");

  // Expargo fee calculation
  const { data: expargoData } = useCalculateExpargoFeeQuery(currentWeight, {
    skip: selectedMethod !== "Expargo" || !currentWeight,
  });

  const deliveryFee = selectedMethod === "Expargo" ? (expargoData?.deliveryFee ?? 0) : 0;
  const displayTotal = totalAmount + deliveryFee;

  // Update packageWeight field when the prop changes
  useEffect(() => {
    setValue("packageWeight", packageWeight || 0.5);
  }, [packageWeight, setValue]);

  const walletToUse = Number(watch("walletAmountToUse") ?? 0);
  const remainingAfterWallet = Math.max(0, displayTotal - walletToUse);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (values: CheckoutFormValues) => {
    // Backend-driven minimum order amount validation
    const minAmount = minAmountData?.minimumAmount ?? 0;
    if (totalAmount < minAmount) {
      const msg = `Minimum sifariş məbləği ${minAmount.toFixed(2)} AZN olmalıdır. Cari: ${totalAmount.toFixed(2)} AZN`;
      setServerError(msg);
      toast.error(msg);
      return;
    }

    setServerError("");
    try {
      const result = await initiatePayment({
        shippingMethod: values.shippingMethod,
        customerName: values.customerName,
        customerEmail: values.customerEmail || undefined,
        customerPhone: values.customerPhone,
        shippingAddress: values.shippingAddress,
        notes: values.notes || null,
        deliveryPostCode: values.shippingMethod === "Azerpost" ? values.deliveryPostCode.toUpperCase() : undefined,
        userPassport: values.shippingMethod === "Azerpost" ? values.userPassport.toUpperCase() : undefined,
        packageWeight: Number(values.packageWeight),
        fragile: values.shippingMethod === "Azerpost" ? values.fragile : undefined,
        deliveryType: values.shippingMethod === "Azerpost" ? (Number(values.deliveryType) as 0 | 1) : undefined,
        walletAmountToUse: Number(values.walletAmountToUse) || 0,
        installmentOptionId: null,
      }).unwrap();

      // Wallet-only path: message contains "Wallet"
      if (result.message?.includes("Wallet")) {
        window.location.href = result.redirect_url;
        return;
      }

      // Standard Epoint card payment
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
        return;
      }

      setServerError("Ödəniş keçidi URL-i alınmadı.");
    } catch (err: any) {
      const msg = err?.data?.message || err?.data?.title || err?.message || "Ödəniş başladıla bilmədi. Xəta baş verdi.";
      setServerError(msg);
      toast.error(msg);
    }
  };

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "92vh" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Sifarişi tamamlayın</h2>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              Çatdırılma və ödəniş məlumatlarını daxil edin
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 px-8 py-6">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8" noValidate>

            {/* Server error */}
            {serverError && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {/* ── Section: Personal Info ── */}
            <section>
              <SectionTitle icon={<User className="h-4 w-4" />} label="Şəxsi məlumatlar" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Field
                  label="Ad Soyad *"
                  error={errors.customerName?.message}
                >
                  <input
                    {...register("customerName", {
                      required: "Ad Soyad mütləqdir",
                      minLength: { value: 3, message: "Ən az 3 simvol" },
                    })}
                    placeholder="Elçin Həsənov"
                    className={inputClass(!!errors.customerName)}
                  />
                </Field>

                <Field
                  label="E-poçt *"
                  error={errors.customerEmail?.message}
                >
                  <input
                    {...register("customerEmail", {
                      required: "E-poçt mütləqdir",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Düzgün e-poçt daxil edin" },
                    })}
                    type="email"
                    placeholder="elcin@example.com"
                    className={inputClass(!!errors.customerEmail)}
                  />
                </Field>

                <Field
                  label="Telefon *"
                  error={errors.customerPhone?.message}
                  className="sm:col-span-2"
                >
                  <input
                    {...register("customerPhone", {
                      required: "Telefon nömrəsi mütləqdir",
                      pattern: { value: /^\d{9,15}$/, message: "Yalnız rəqəmlər (9-15 simvol)" },
                    })}
                    placeholder="994501234567"
                    className={inputClass(!!errors.customerPhone)}
                  />
                </Field>
              </div>
            </section>

            {/* ── Section: Delivery Method Selector ── */}
            <section>
              <SectionTitle icon={<Truck className="h-4 w-4" />} label="Çatdırılma növü" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {[
                  { id: "Azerpost", label: "Azərpoçt", sub: "Mövcud inteqrasiya", disabled: true },
                  { id: "Expargo", label: "Expargo", sub: "Ödənişli, bölgələr üçün" },
                  { id: "FreeDelivery", label: "Pulsuz", sub: "Bakı, Sumqayıt, Abşeron" },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`
                      relative flex flex-col p-4 rounded-2xl border-2 transition-all
                      ${method.disabled ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-100" : "cursor-pointer"}
                      ${!method.disabled && selectedMethod === method.id
                        ? "border-blue-600 bg-blue-50/50 ring-4 ring-blue-50"
                        : !method.disabled ? "border-gray-100 hover:border-gray-200 bg-white" : ""}
                    `}
                  >
                    <input
                      type="radio"
                      {...register("shippingMethod")}
                      value={method.id}
                      disabled={method.disabled}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-black ${selectedMethod === method.id ? "text-blue-700" : "text-gray-900"}`}>
                        {method.label} {method.disabled && <span className="text-[9px] font-bold text-amber-600 ml-1">(Tezliklə)</span>}
                      </span>
                      {selectedMethod === method.id && (
                        <div className="bg-blue-600 rounded-full p-0.5">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold leading-tight uppercase tracking-wider">
                      {method.sub}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* ── Section: Delivery Details ── */}
            <section>
              <SectionTitle icon={<MapPin className="h-4 w-4" />} label="Çatdırılma məlumatları" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                <Field
                  label={selectedMethod === "Expargo" ? "Təhvil məntəqəsi *" : "Çatdırılma ünvanı *"}
                  error={errors.shippingAddress?.message}
                  className="sm:col-span-2"
                >
                  {selectedMethod === "Expargo" ? (
                    <Select
                      onValueChange={(val) => setValue("shippingAddress", val, { shouldValidate: true })}
                      value={watch("shippingAddress")}
                    >
                      <SelectTrigger className="w-full h-11 rounded-xl font-bold bg-white border-gray-300 text-black">
                        <SelectValue placeholder="Məntəqə seçin" className="text-black" />
                      </SelectTrigger>
                      <SelectContent className="z-[600]">
                        <SelectGroup>
                          <SelectLabel>Filiallar</SelectLabel>
                          {EXPARGO_LOCATIONS.filiallar.map(loc => (
                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>T/M (Service Points)</SelectLabel>
                          {EXPARGO_LOCATIONS.servicePoints.map(loc => (
                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <input
                      {...register("shippingAddress", {
                        required: "Ünvan mütləqdir",
                        minLength: { value: 10, message: "Ən az 10 simvol" },
                      })}
                      placeholder="Bakı, Nəsimi r., Rəşid Behbudov küç. 15"
                      className={inputClass(!!errors.shippingAddress)}
                    />
                  )}
                </Field>

                {selectedMethod === "Azerpost" && (
                  <>
                    <Field
                      label="Çatdırılma növü *"
                      error={errors.deliveryType?.message}
                      className="sm:col-span-2"
                    >
                      <Select
                        onValueChange={(val) => setValue("deliveryType", val as "0" | "1", { shouldValidate: true })}
                        defaultValue={watch("deliveryType")}
                      >
                        <SelectTrigger className="w-full h-11 rounded-xl font-bold bg-white border-gray-300 text-black">
                          <SelectValue placeholder="Çatdırılma növü seçin" className="text-black" />
                        </SelectTrigger>
                        <SelectContent className="z-[600]">
                          <SelectItem value="0">Poçt şöbəsinə çatdırılma</SelectItem>
                          <SelectItem value="1">Evə çatdırılma</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field
                      label="Poçt kodu *"
                      error={errors.deliveryPostCode?.message}
                      hint="Format: AZ1000"
                    >
                      <input
                        {...register("deliveryPostCode", {
                          required: selectedMethod === "Azerpost" ? "Poçt kodu mütləqdir" : false,
                          validate: (v) =>
                            selectedMethod !== "Azerpost" || AZ_POSTCODE_RE.test(v) || "Format: AZ + 4 rəqəm (məs. AZ1000)",
                        })}
                        placeholder="AZ1000"
                        className={inputClass(!!errors.deliveryPostCode)}
                        onChange={(e) => {
                          e.target.value = e.target.value.toUpperCase();
                        }}
                      />
                    </Field>

                    <Field
                      label="Pasport seriyası *"
                      error={errors.userPassport?.message}
                      hint="Format: AA1234567"
                    >
                      <input
                        {...register("userPassport", {
                          required: selectedMethod === "Azerpost" ? "Pasport məlumatı mütləqdir" : false,
                          validate: (v) =>
                            selectedMethod !== "Azerpost" || PASSPORT_RE.test(v) || "Format: 2 hərf + 7 rəqəm (məs. AA1234567)",
                        })}
                        placeholder="AA1234567"
                        maxLength={9}
                        className={inputClass(!!errors.userPassport)}
                        onChange={(e) => {
                          e.target.value = e.target.value.toUpperCase();
                        }}
                      />
                    </Field>

                    <Field label="Kövrək paket?">
                      <label className="flex items-center gap-3 cursor-pointer mt-1">
                        <div className="relative">
                          <input
                            {...register("fragile")}
                            type="checkbox"
                            className="peer sr-only"
                          />
                          <div className="w-10 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full transition-colors" />
                          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Bəli, kövrək məhsul</span>
                      </label>
                    </Field>
                  </>
                )}

                {/* Package weight is now handled internally from backend data */}
                <input type="hidden" {...register("packageWeight")} />
              </div>
            </section>

            {/* ── Section: Wallet ── */}
            {walletBalance > 0 && (
              <section>
                <SectionTitle icon={<CreditCard className="h-4 w-4" />} label="Balans istifadəsi" />
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-700">Mövcud balans:</span>
                    <span className="font-black text-blue-600">₼{walletBalance.toFixed(2)}</span>
                  </div>
                  <Field
                    label="İstifadə ediləcək məbləğ"
                    error={errors.walletAmountToUse?.message}
                  >
                    <input
                      {...register("walletAmountToUse", {
                        min: { value: 0, message: "0 və ya müsbət dəyər daxil edin" },
                        max: { value: Math.min(walletBalance, totalAmount), message: `Maksimum ₼${Math.min(walletBalance, totalAmount).toFixed(2)}` },
                      })}
                      type="number"
                      step="0.01"
                      min="0"
                      max={Math.min(walletBalance, totalAmount)}
                      placeholder="0.00"
                      className={inputClass(!!errors.walletAmountToUse)}
                    />
                  </Field>
                  {walletToUse > 0 && (
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      Balansdan istifadəndən sonra ödəniləcək: <span className="font-black text-gray-900">₼{remainingAfterWallet.toFixed(2)}</span>
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* ── Section: Notes ── */}
            <section>
              <SectionTitle icon={<FileText className="h-4 w-4" />} label="Əlavə qeydlər" />
              <div className="mt-4">
                <textarea
                  {...register("notes")}
                  rows={3}
                  placeholder="Sifarişlə bağlı xüsusi qeydləriniz..."
                  className={`${inputClass(false)} resize-none`}
                />
              </div>
            </section>

          </form>
        </div>

        {/* ── Footer ── */}
        <div className="px-5 sm:px-8 py-6 border-t border-gray-100 bg-gray-50/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-4">
            <div className="space-y-1 flex-1">
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>Məhsulların cəmi:</span>
                <span className="font-bold text-gray-900">₼{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>Çatdırılma ({selectedMethod === "Azerpost" ? "Azərpoçt" : selectedMethod}):</span>
                <span className="font-bold text-gray-900">
                  {selectedMethod === "Azerpost" ? "Hesablanır..." : `₼${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {walletToUse > 0 && (
                <div className="flex justify-between text-sm font-medium text-blue-600">
                  <span>Balansdan istifadə:</span>
                  <span className="font-bold">-₼{walletToUse.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Ödəniləcək məbləğ</p>
                <p className="text-2xl font-black text-gray-900 tracking-tighter">
                  ₼{remainingAfterWallet.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl px-6 h-12 sm:h-10 order-2 xs:order-1"
              >
                Ləğv et
              </Button>
              <Button
                type="submit"
                form="checkout-form"
                disabled={isLoading}
                className="rounded-xl px-8 h-12 sm:h-10 bg-blue-600 hover:bg-blue-700 text-white font-black order-1 xs:order-2 flex-1 sm:flex-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Emal edilir...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CreditCard className="h-4 w-4" /> Ödənişə keç
                  </span>
                )}
              </Button>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-medium text-center">
            Davam etməklə <span className="text-gray-600 font-bold">istifadə şərtlərini</span> qəbul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Helper sub-components ──────────────────────────────────────────────────────
function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
      <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
        {icon}
      </div>
      <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.15em]">{label}</p>
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-bold text-gray-700">{label}</label>
      {children}
      {hint && !error && <p className="text-[11px] text-gray-400 font-medium">{hint}</p>}
      {error && (
        <p className="text-[11px] text-red-500 font-bold flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full px-4 py-3 rounded-xl border text-sm font-bold transition-all outline-none",
    "placeholder:text-gray-400 focus:ring-2",
    hasError
      ? "border-red-300 bg-red-50 text-red-900 focus:border-red-400 focus:ring-red-100"
      : "border-gray-300 bg-white text-gray-950 focus:border-blue-400 focus:ring-blue-100",
  ].join(" ");
}

// ── Named export kept for backward-compat ─────────────────────────────────────
export function CheckoutClient() {
  return null; // Replaced by CheckoutModal used in OrderSummary
}
