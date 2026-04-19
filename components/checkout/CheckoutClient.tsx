"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useInitiatePaymentMutation } from "@/lib/store/payment/paymentApiSlice";
import { useGetCartMinimumAmountQuery } from "@/lib/store/settings/apislice";
import { toast } from "sonner";
import { X, User, Mail, Phone, MapPin, FileText, Package2, Truck, CreditCard, AlertCircle, ChevronDown, Loader2 } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface CheckoutFormValues {
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

  // Update packageWeight field when the prop changes
  useEffect(() => {
    setValue("packageWeight", packageWeight || 0.5);
  }, [packageWeight, setValue]);

  const walletToUse = Number(watch("walletAmountToUse") ?? 0);
  const remainingAfterWallet = Math.max(0, totalAmount - walletToUse);

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
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        shippingAddress: values.shippingAddress,
        notes: values.notes,
        deliveryPostCode: values.deliveryPostCode.toUpperCase(),
        userPassport: values.userPassport.toUpperCase(),
        packageWeight: Number(values.packageWeight),
        fragile: values.fragile,
        deliveryType: Number(values.deliveryType) as 0 | 1,
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
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>

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

            {/* ── Section: Delivery ── */}
            <section>
              <SectionTitle icon={<Truck className="h-4 w-4" />} label="Çatdırılma məlumatları" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                <Field
                  label="Çatdırılma növü *"
                  error={errors.deliveryType?.message}
                  className="sm:col-span-2"
                >
                  <div className="relative">
                    <select
                      {...register("deliveryType", { required: "Çatdırılma növü seçin" })}
                      className={`${inputClass(!!errors.deliveryType)} appearance-none pr-10 cursor-pointer`}
                    >
                      <option value="0">Poçt şöbəsinə çatdırılma </option>
                      <option value="1">Evə çatdırılma</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </Field>

                <Field
                  label="Çatdırılma ünvanı *"
                  error={errors.shippingAddress?.message}
                  className="sm:col-span-2"
                >
                  <input
                    {...register("shippingAddress", {
                      required: "Ünvan mütləqdir",
                      minLength: { value: 10, message: "Ən az 10 simvol" },
                    })}
                    placeholder="Bakı, Nəsimi r., Rəşid Behbudov küç. 15"
                    className={inputClass(!!errors.shippingAddress)}
                  />
                </Field>

                <Field
                  label="Poçt kodu *"
                  error={errors.deliveryPostCode?.message}
                  hint="Format: AZ1000"
                >
                  <input
                    {...register("deliveryPostCode", {
                      required: "Poçt kodu mütləqdir",
                      validate: (v) =>
                        AZ_POSTCODE_RE.test(v) || "Format: AZ + 4 rəqəm (məs. AZ1000)",
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
                      required: "Pasport məlumatı mütləqdir",
                      validate: (v) =>
                        PASSPORT_RE.test(v) || "Format: 2 hərf + 7 rəqəm (məs. AA1234567)",
                    })}
                    placeholder="AA1234567"
                    maxLength={9}
                    className={inputClass(!!errors.userPassport)}
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                    }}
                  />
                </Field>

                {/* Package weight is now handled internally from backend data */}
                <input type="hidden" {...register("packageWeight")} />

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
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Ödəniləcək məbləğ</p>
              <p className="text-2xl font-black text-gray-900 tracking-tighter">
                ₼{walletToUse > 0 ? remainingAfterWallet.toFixed(2) : totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl px-6"
              >
                Ləğv et
              </Button>
              <Button
                type="submit"
                form="checkout-form"
                disabled={isLoading}
                className="rounded-xl px-8 bg-blue-600 hover:bg-blue-700 text-white font-black"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Emal edilir...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
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
