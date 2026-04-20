export const ALL_INSTALLMENT_MONTHS = [3, 6, 12, 18, 24];

export interface InstallmentResult {
  month: number;
  monthlyPayment: string;
  availableMonths: number[];
}

export function calculateBestInstallment(price: number): InstallmentResult | null {
  if (!price || price < 15) return null;

  // Find all hardcoded months that satisfy the condition: price / m > 15
  const validMonths = ALL_INSTALLMENT_MONTHS.filter(m => (price / m) > 15);
  
  if (validMonths.length === 0) return null;

  // Show the maximum month (which results in the minimum monthly payment over 15)
  const maxMonth = Math.max(...validMonths);
  const monthlyPayment = (price / maxMonth).toFixed(2);

  return {
    month: maxMonth,
    monthlyPayment,
    availableMonths: validMonths
  };
}
