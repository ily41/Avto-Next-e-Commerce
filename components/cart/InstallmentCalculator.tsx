import { IdInstallmentCalculator } from "./IdInstallmentCalculator";
import { NormalInstallmentCalculator } from "./NormalInstallmentCalculator";
 
interface InstallmentCalculatorProps {
  totalAmount: number;
}
 
export function InstallmentCalculator({ totalAmount }: InstallmentCalculatorProps) {
  if (totalAmount >= 100) {
    return <IdInstallmentCalculator totalAmount={totalAmount} />;
  }
 
  return <NormalInstallmentCalculator totalAmount={totalAmount} />;
}


