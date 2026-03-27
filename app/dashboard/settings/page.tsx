"use client"

import * as React from "react"
import { 
  useGetCartMinimumAmountQuery, 
  useUpdateCartMinimumAmountMutation,
  useGetLoyaltySettingsQuery,
  useUpdateLoyaltySettingsMutation,
  useGetInstallmentConfigurationQuery,
  useUpdateInstallmentConfigurationMutation
} from "@/lib/store/settings/apislice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { 
  IconLoader2, 
  IconShoppingCart, 
  IconGift, 
  IconCreditCard,
  IconArrowLeft
} from "@tabler/icons-react"
import Link from "next/link"

export default function SettingsPage() {
    // Cart Minimum Amount
    const { data: cartMinData, isLoading: isCartLoading } = useGetCartMinimumAmountQuery()
    const [updateCartMin, { isLoading: isUpdatingCart }] = useUpdateCartMinimumAmountMutation()
    const [cartMin, setCartMin] = React.useState(0)

    // Loyalty
    const { data: loyaltyData, isLoading: isLoyaltyLoading } = useGetLoyaltySettingsQuery()
    const [updateLoyalty, { isLoading: isUpdatingLoyalty }] = useUpdateLoyaltySettingsMutation()
    const [loyaltyPercent, setLoyaltyPercent] = React.useState(0)

    // Installment
    const { data: installmentData, isLoading: isInstallmentLoading } = useGetInstallmentConfigurationQuery()
    const [updateInstallment, { isLoading: isUpdatingInstallment }] = useUpdateInstallmentConfigurationMutation()
    const [installmentEnabled, setInstallmentEnabled] = React.useState(false)
    const [installmentMin, setInstallmentMin] = React.useState(0)

    React.useEffect(() => {
        if (cartMinData) setCartMin(cartMinData.minimumAmount)
        if (loyaltyData) setLoyaltyPercent(loyaltyData.bonusPercentage)
        if (installmentData) {
            setInstallmentEnabled(installmentData.isEnabled)
            setInstallmentMin(installmentData.minimumAmount)
        }
    }, [cartMinData, loyaltyData, installmentData])

    const handleSaveCartMin = async () => {
        try {
            await updateCartMin({ minimumAmount: cartMin }).unwrap()
            toast.success("Cart minimum amount updated successfully")
        } catch (e) {
            toast.error("Failed to update cart minimum amount")
        }
    }

    const handleSaveLoyalty = async () => {
        try {
            await updateLoyalty({ bonusPercentage: loyaltyPercent }).unwrap()
            toast.success("Loyalty settings updated successfully")
        } catch (e) {
            toast.error("Failed to update loyalty settings")
        }
    }

    const handleSaveInstallment = async () => {
        try {
            await updateInstallment({ isEnabled: installmentEnabled, minimumAmount: installmentMin }).unwrap()
            toast.success("Installment configuration updated successfully")
        } catch (e) {
            toast.error("Failed to update installment configuration")
        }
    }

    if (isCartLoading || isLoyaltyLoading || isInstallmentLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8 lg:p-12 max-w-5xl mx-auto">
            <div className="flex flex-col gap-4">
                <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    <IconArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight">Store Settings</h1>
                    <p className="text-muted-foreground text-lg">Configure global business rules and customer incentives.</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Cart Settings */}
                <Card className="flex flex-col shadow-md border-primary/10">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <IconShoppingCart className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Checkout Threshold</CardTitle>
                                <CardDescription>Minimum order amounts</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1">
                        <div className="space-y-3">
                            <Label htmlFor="cart-min" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Minimum Order Amount ($)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                                <Input 
                                    id="cart-min" 
                                    type="number" 
                                    className="pl-8 h-12 text-lg focus-visible:ring-primary/20 transition-all font-semibold"
                                    value={cartMin} 
                                    onChange={(e) => setCartMin(Number(e.target.value))} 
                                />
                            </div>
                            <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md italic">
                                Prevent checkout for orders less than this value to ensure profitability.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-6 border-t bg-muted/20">
                        <Button 
                            className="w-full h-11 text-base font-bold shadow-lg shadow-primary/10" 
                            onClick={handleSaveCartMin} 
                            disabled={isUpdatingCart}
                        >
                            {isUpdatingCart && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Apply Threshold
                        </Button>
                    </CardFooter>
                </Card>

                {/* Loyalty Settings */}
                <Card className="flex flex-col shadow-md border-primary/10">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <IconGift className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Bonus Rewards</CardTitle>
                                <CardDescription>Customer loyalty program</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1">
                        <div className="space-y-3">
                            <Label htmlFor="bonus-percent" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cashback Percentage (%)</Label>
                            <div className="relative">
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">%</span>
                                <Input 
                                    id="bonus-percent" 
                                    type="number" 
                                    className="pr-8 h-12 text-lg focus-visible:ring-primary/20 transition-all font-semibold"
                                    value={loyaltyPercent} 
                                    onChange={(e) => setLoyaltyPercent(Number(e.target.value))} 
                                />
                            </div>
                            <p className="text-sm text-muted-foreground bg-green-50/50 dark:bg-green-500/5 p-3 rounded-md italic border border-green-500/10">
                                Reward your loyal customers with a percentage of their total spend as bonus points.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-6 border-t bg-muted/20">
                        <Button 
                            variant="default"
                            className="w-full h-11 text-base font-bold shadow-lg shadow-primary/10" 
                            onClick={handleSaveLoyalty} 
                            disabled={isUpdatingLoyalty}
                        >
                            {isUpdatingLoyalty && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Program
                        </Button>
                    </CardFooter>
                </Card>

                {/* Installment Settings */}
                <Card className="flex flex-col lg:col-span-2 shadow-md border-primary/10 overflow-hidden">
                    <CardHeader className="pb-1">
                        <div className="flex items-center justify-between gap-3">
                           <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <IconCreditCard className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">Flexible Repayments</CardTitle>
                                    <CardDescription>Installment configuration</CardDescription>
                                </div>
                           </div>
                           <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-full px-4 border">
                                <Label htmlFor="installment-enabled" className="text-sm font-bold cursor-pointer">Status:</Label>
                                <Switch 
                                    id="installment-enabled" 
                                    checked={installmentEnabled} 
                                    onCheckedChange={setInstallmentEnabled} 
                                />
                                <span className={`text-xs font-black uppercase ${installmentEnabled ? 'text-blue-600' : 'text-muted-foreground'}`}>
                                    {installmentEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                           </div>
                        </div>
                    </CardHeader>
                    <div className={installmentEnabled ? "" : "opacity-40 grayscale pointer-events-none transition-all duration-300"}>
                        <CardContent className="pt-6 grid md:grid-cols-2 gap-8 items-center h-full">
                            <div className="space-y-4">
                                <Label htmlFor="installment-min" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Minimum Eligibility ($)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                                    <Input 
                                        id="installment-min" 
                                        type="number" 
                                        className="pl-8 h-12 text-lg focus-visible:ring-primary/20 transition-all font-semibold"
                                        value={installmentMin} 
                                        onChange={(e) => setInstallmentMin(Number(e.target.value))} 
                                    />
                                </div>
                                <p className="text-sm text-balance text-muted-foreground leading-relaxed">
                                    Customers will only see the installment option if their cart total is above this threshold. This is usually set for high-ticket items.
                                </p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-500/10 rounded-xl p-6 relative overflow-hidden h-full flex flex-col justify-center">
                                <div className="z-10 relative">
                                    <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2">Usage Example</h4>
                                    <p className="text-sm text-muted-foreground">
                                        If set to <span className="font-bold text-foreground">${installmentMin}</span>, a customer buying a phone for $800 can pay in monthly cycles, while a $50 purchase must be paid in full.
                                    </p>
                                </div>
                                <IconCreditCard className="absolute -right-8 -bottom-8 h-32 w-32 text-blue-500/10 -rotate-12" />
                            </div>
                        </CardContent>
                    </div>
                    <CardFooter className="pt-6 border-t bg-muted/20">
                        <Button 
                            className="w-full h-11 text-base font-bold shadow-lg shadow-primary/10" 
                            onClick={handleSaveInstallment} 
                            disabled={isUpdatingInstallment}
                        >
                            {isUpdatingInstallment && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Configuration
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
