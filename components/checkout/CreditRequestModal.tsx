"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateCreditRequestMutation } from "@/lib/store/creditRequest/creditRequestApiSlice";
import { X, User, Phone, Loader2, AlertCircle, Info, CheckCircle2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreditRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

const creditRequestSchema = z.object({
  fullName: z.string().min(3, "Ad Soyad ən azı 3 simvol olmalıdır"),
  phoneNumber: z.string().min(10, "Telefon nömrəsi düzgün deyil (məs: 994501234567)"),
  shippingMethod: z.string().min(1, "Çatdırılma növü seçilməlidir"),
  shippingAddress: z.string().min(5, "Ünvan mütləqdir"),
  deliveryPostCode: z.string().optional(),
  userPassport: z.string().optional(),
  fragile: z.boolean(),
});

type CreditRequestFormValues = z.infer<typeof creditRequestSchema>;

export function CreditRequestModal({ isOpen, onClose, totalAmount }: CreditRequestModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const [createCreditRequest, { isLoading: isSubmitting }] = useCreateCreditRequestMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreditRequestFormValues>({
    resolver: zodResolver(creditRequestSchema),
    defaultValues: {
      shippingMethod: "FreeDelivery",
      fragile: false,
    }
  });

  const selectedMethod = watch("shippingMethod");

  useEffect(() => {
    if (!isOpen) {
      setIsSuccess(false);
      setServerError("");
      reset();
    }
  }, [isOpen, reset]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (values: CreditRequestFormValues) => {
    setServerError("");
    try {
      await createCreditRequest({
        ...values,
        deliveryPostCode: values.deliveryPostCode || "",
        userPassport: values.userPassport || "",
      }).unwrap();
      setIsSuccess(true);
      toast.success("Müraciətiniz uğurla göndərildi!");
      setTimeout(() => {
        onClose();
        router.push("/profile/orders"); // Redirect to orders or similar
      }, 3000);
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center justify-between w-full px-8 py-6 border-b border-gray-50">
          <div>
            <h2 className="text-xl font-black text-gray-950 tracking-tight">
              Tək şəxsiyyət vəsiqəsi ilə
            </h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">
              Sürətli müraciət formu
            </p>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="w-full p-8 overflow-y-auto max-h-[80vh]">
          {isSuccess ? (
            <div className="py-8 animate-in zoom-in-95 duration-300 text-center">
              <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Təşəkkür edirik!</h3>
              <p className="text-sm font-bold text-gray-500 max-w-[280px] mx-auto leading-relaxed">
                Müraciətiniz qeydə alındı. Tezliklə sizinlə əlaqə saxlanılacaq.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 mb-8 text-left">
                <Info className="text-blue-600 shrink-0" size={18} />
                <p className="text-[12px] font-bold text-blue-900">
                  Sifariş məbləği: <span className="font-black">₼{totalAmount.toFixed(2)}</span>
                </p>
              </div>

              {serverError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold mb-6 text-left">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputGroup label="Ad Soyad *" error={errors.fullName?.message}>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        {...register("fullName")}
                        placeholder="Məs: Əli Əliyev"
                        className={inputClass(!!errors.fullName)}
                      />
                    </div>
                  </InputGroup>

                  <InputGroup label="Telefon Nömrəsi *" error={errors.phoneNumber?.message}>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        {...register("phoneNumber")}
                        placeholder="Məs: 994501234567"
                        className={inputClass(!!errors.phoneNumber)}
                      />
                    </div>
                  </InputGroup>
                </div>

                <InputGroup label="Çatdırılma növü *" error={errors.shippingMethod?.message}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "FreeDelivery", label: "Pulsuz Çatdırılma" },
                      { id: "Expargo", label: "Expargo" },
                      { id: "Azerpost", label: "Azərpoçt" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`
                          flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer
                          ${selectedMethod === method.id ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:border-gray-200"}
                        `}
                      >
                        <input
                          type="radio"
                          {...register("shippingMethod")}
                          value={method.id}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? "border-blue-600" : "border-gray-300"}`}>
                          {selectedMethod === method.id && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                        </div>
                        <span className="text-xs font-black text-gray-900">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </InputGroup>

                <InputGroup label="Çatdırılma ünvanı *" error={errors.shippingAddress?.message}>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      {...register("shippingAddress")}
                      placeholder="Bakı, Nəsimi r., Rəşid Behbudov küç. 15"
                      className={inputClass(!!errors.shippingAddress)}
                    />
                  </div>
                </InputGroup>

                {selectedMethod === "Azerpost" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                    <InputGroup label="Poçt kodu *" error={errors.deliveryPostCode?.message}>
                      <input
                        {...register("deliveryPostCode")}
                        placeholder="AZ1000"
                        className={inputClass(!!errors.deliveryPostCode)}
                        onChange={(e) => setValue("deliveryPostCode", e.target.value.toUpperCase())}
                      />
                    </InputGroup>

                    <InputGroup label="Pasport seriyası *" error={errors.userPassport?.message}>
                      <input
                        {...register("userPassport")}
                        placeholder="AA1234567"
                        className={inputClass(!!errors.userPassport)}
                        onChange={(e) => setValue("userPassport", e.target.value.toUpperCase())}
                      />
                    </InputGroup>

                    <div className="sm:col-span-2">
                       <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                          <input
                            {...register("fragile")}
                            type="checkbox"
                            className="peer sr-only"
                          />
                          <div className="w-10 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full transition-colors" />
                          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-700">Kövrək məhsul?</span>
                      </label>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black hover:bg-blue-600 text-white font-black py-7 rounded-2xl shadow-xl transition-all mt-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  ) : null}
                  Müraciəti Tamamla
                </Button>
              </form>

              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6 text-center">
                Şəxsi məlumatlarınız qorunur
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
function InputGroup({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">{label}</label>
      {children}
      {error && <p className="text-[10px] font-black text-red-500 mt-0.5 ml-1">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full pl-12 pr-4 py-4 rounded-2xl border text-sm font-black transition-all outline-none",
    "placeholder:text-gray-300 focus:ring-4",
    hasError
      ? "border-red-400 bg-red-50 text-red-900 focus:ring-red-100"
      : "border-gray-100 bg-white text-gray-950 focus:border-blue-500 focus:ring-blue-50",
  ].join(" ");
}
