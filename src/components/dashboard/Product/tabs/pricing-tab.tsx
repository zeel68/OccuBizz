// tabs/PricingTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from 'lucide-react'
import { UseFormReturn } from "react-hook-form"
import { ProductFormData } from "@/types/product.types"

interface PricingTabProps {
    form: UseFormReturn<ProductFormData>
    loading: boolean
    formErrors: Record<string, string>
}

export function PricingTab({ form, loading, formErrors }: PricingTabProps) {
    const handleNumberChange = (field: string, value: string) => {
        const num = value === '' ? 0 : Number(value)
        form.setValue(field as any, num)
    }

    const price = form.watch("price") || 0
    const compare_price = form.watch("compare_price") || 0
    const costPrice = form.watch("cost_price") || 0

    const profitMargin = price > 0 ? ((price - costPrice) / price) * 100 : 0
    const profitAmount = price - costPrice

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">

                    ₹ Pricing Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="price" className="flex items-center gap-1">
                            Selling Price
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={price}
                            onChange={(e) => handleNumberChange("price", e.target.value)}
                            placeholder="0.00"
                            disabled={loading}
                            className={formErrors.price ? "border-red-500" : ""}
                        />
                        {formErrors.price && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {formErrors.price}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="compare_price">Compare At Price</Label>
                        <Input
                            id="compare_price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.watch("compare_price") || ""}
                            onChange={(e) => handleNumberChange("compare_price", e.target.value)}
                            placeholder="0.00"
                            disabled={loading}
                            className={formErrors.compare_price ? "border-red-500" : ""}
                        />
                        {formErrors.compare_price && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {formErrors.compare_price}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cost_price">Cost Price</Label>
                        <Input
                            id="cost_price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.watch("cost_price") || ""}
                            onChange={(e) => handleNumberChange("cost_price", e.target.value)}
                            placeholder="0.00"
                            disabled={loading}
                        />
                    </div>
                </div>

                {price > 0 && costPrice > 0 && (
                    <div className="p-4 bg-muted rounded-lg shadow-inner">
                        <Label className="text-sm font-medium">Profit Analysis</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Profit Margin</p>
                                <p className={`text-lg font-semibold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {profitMargin.toFixed(1)}%
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Profit Amount</p>
                                <p className={`text-lg font-semibold ${profitAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ₹{profitAmount.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}