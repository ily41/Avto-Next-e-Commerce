"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { 
  useGetInstallmentOptionsQuery, 
  useCalculateInstallmentQuery 
} from "@/lib/store/installment/installmentApiSlice";
import { useInitiatePaymentMutation } from "@/lib/store/payment/paymentApiSlice";
import { X, CreditCard, ChevronRight, Loader2, AlertCircle, Info, Landmark } from "lucide-react";
import { toast } from "sonner";
import { InstallmentOption } from "@/lib/api/types";

interface InstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

interface InstallmentFormValues {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  deliveryPostCode: string;
  userPassport: string;
}

export function InstallmentModal({ isOpen, onClose, totalAmount }: InstallmentModalProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [serverError, setServerError] = useState("");

  const { data: options, isLoading: isOptionsLoading } = useGetInstallmentOptionsQuery(
    { amount: totalAmount },
    { skip: !isOpen }
  );

  const { data: calculation, isFetching: isCalculating } = useCalculateInstallmentQuery(
    { amount: totalAmount, optionId: selectedOptionId! },
    { skip: !selectedOptionId }
  );

  const [initiatePayment, { isLoading: isSubmitting }] = useInitiatePaymentMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InstallmentFormValues>();

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedOptionId(null);
      setServerError("");
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (values: InstallmentFormValues) => {
    if (!selectedOptionId) return;
    setServerError("");
    try {
      const result = await initiatePayment({
        ...values,
        installmentOptionId: selectedOptionId,
        deliveryType: 0, // Default to post office
        packageWeight: 0.5,
        fragile: false,
        walletAmountToUse: 0,
        notes: "Installment Payment",
        deliveryPostCode: values.deliveryPostCode.toUpperCase(),
        userPassport: values.userPassport.toUpperCase(),
      }).unwrap();

      if (result.redirect_url) {
        window.location.href = result.redirect_url;
      } else {
        setServerError("Ödəniş keçidi URL-i alınmadı.");
      }
    } catch (err: any) {
      setServerError(
        err?.data?.message || 
        err?.message || 
        "Xəta baş verdi. Yenidən cəhd edin."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-950 tracking-tight">
              {step === 1 ? "Taksit seçimi" : "Məlumatları tamamlayın"}
            </h2>
            <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mt-0.5">
              Hissə-hissə ödəniş planı təklifləri
            </p>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <Info className="text-blue-600 shrink-0" size={20} />
                <p className="text-[13px] font-bold text-blue-900">
                  Toplam məbləğ: <span className="font-black">${totalAmount.toFixed(2)}</span>
                </p>
              </div>

              <div className="grid gap-4">
                {isOptionsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-2xl" />
                  ))
                ) : options && options.length > 0 ? (
                  options.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
                        selectedOptionId === opt.id
                          ? "border-blue-600 bg-blue-50/20"
                          : "border-gray-100 hover:border-blue-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${selectedOptionId === opt.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                            <Landmark size={24} />
                          </div>
                          <div>
                            <h4 className="font-black text-gray-900">{opt.bankName}</h4>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                              {opt.installmentPeriod} ay taksit
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-bold text-gray-400 uppercase">Aylıq ödəniş</p>
                          <p className={`text-lg font-black ${selectedOptionId === opt.id ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'}`}>
                             ${(totalAmount / opt.installmentPeriod).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {selectedOptionId === opt.id && (
                        <div className="mt-4 pt-4 border-t border-blue-100 flex justify-between gap-4 animate-in slide-in-from-top-2 duration-300">
                           <div className="flex-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Komissiya</p>
                              <p className="text-sm font-black text-gray-900">{opt.interestPercentage}%</p>
                           </div>
                           <Button 
                              onClick={() => setStep(2)}
                              className="bg-blue-600 hover:bg-blue-700 font-bold px-6 h-10 rounded-xl shadow-lg shadow-blue-600/20"
                           >
                              Davam et <ChevronRight size={16} className="ml-1" />
                           </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-[32px]">
                    <AlertCircle size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold">Uyğun taksit planı tapılmadı.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form id="inst-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {serverError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm font-bold">
                  <AlertCircle size={20} className="shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <InputGroup label="Ad Soyad *" error={errors.customerName?.message}>
                  <input
                    {...register("customerName", { required: "Ad Soyad mütləqdir" })}
                    placeholder="Elçin Həsənov"
                    className={inputClass(!!errors.customerName)}
                  />
                </InputGroup>

                <InputGroup label="E-poçt *" error={errors.customerEmail?.message}>
                  <input
                    {...register("customerEmail", { required: "E-poçt mütləqdir" })}
                    type="email"
                    placeholder="example@mail.com"
                    className={inputClass(!!errors.customerEmail)}
                  />
                </InputGroup>

                <InputGroup label="Telefon *" error={errors.customerPhone?.message}>
                  <input
                    {...register("customerPhone", { required: "Telefon mütləqdir" })}
                    placeholder="994501234567"
                    className={inputClass(!!errors.customerPhone)}
                  />
                </InputGroup>

                <InputGroup label="Poçt Kodu *" error={errors.deliveryPostCode?.message}>
                  <input
                    {...register("deliveryPostCode", { required: "Poçt kodu mütləqdir" })}
                    placeholder="AZ1000"
                    className={inputClass(!!errors.deliveryPostCode)}
                  />
                </InputGroup>

                <InputGroup label="Ünvan *" error={errors.shippingAddress?.message} className="md:col-span-2">
                  <input
                    {...register("shippingAddress", { required: "Ünvan mütləqdir" })}
                    placeholder="Bakı şəhəri, Azadlıq prospekti..."
                    className={inputClass(!!errors.shippingAddress)}
                  />
                </InputGroup>

                <InputGroup label="Pasport Seriyası *" error={errors.userPassport?.message} className="md:col-span-2">
                  <input
                    {...register("userPassport", { required: "Pasport seriyası mütləqdir" })}
                    placeholder="AA1234567"
                    className={inputClass(!!errors.userPassport)}
                  />
                </InputGroup>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center">
            {step === 2 ? (
              <>
                <Button variant="ghost" onClick={() => setStep(1)} className="font-bold text-gray-500">
                  Geri qayıt
                </Button>
                <Button 
                  form="inst-form" 
                  disabled={isSubmitting}
                  className="bg-black hover:bg-blue-600 text-white font-black px-12 py-6 rounded-2xl shadow-xl transition-all"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  ) : (
                    <CreditCard className="mr-2 h-5 w-5" />
                  )}
                  Təsdiqlə və Ödə
                </Button>
              </>
            ) : (
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center w-full">
                Sürətli və təhlükəsiz hissəli ödəniş emalı
              </p>
            )}
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, error, children, className = "" }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">{label}</label>
      {children}
      {error && <p className="text-[11px] font-black text-red-500 mt-0.5 ml-1">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full px-4 py-3 rounded-2xl border text-sm font-black transition-all outline-none",
    "placeholder:text-gray-300 focus:ring-4",
    hasError
      ? "border-red-400 bg-red-50 text-red-900 focus:ring-red-100"
      : "border-gray-100 bg-white text-gray-950 focus:border-blue-500 focus:ring-blue-50",
  ].join(" ");
}
