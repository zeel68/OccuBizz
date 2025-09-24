import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign } from 'lucide-react'
import { iProductFormData } from "@/models/StoreAdmin/product.model"

interface PricingTabProps {
    form: UseFormReturn<iProductFormData>
    loading: boolean
    handleNumberChange: (field: string, value: string) => void
}

export default function PricingTab({ form, loading, handleNumberChange }: PricingTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Pricing Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="price">Selling Price *</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={form.watch("price")}
                            onChange={(e) => handleNumberChange("price", e.target.value)}
                            placeholder="0.00"
                            disabled={loading}
                        />
                        {form.formState.errors.price && (
                            <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="compare_price">Compare At Price</Label>
                        <Input
                            id="compare_price"
                            type="number"
                            step="0.01"
                            value={form.watch("compare_price") || ""}
                            onChange={(e) => handleNumberChange("compare_price", e.target.value)}
                            placeholder="0.00"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cost_price">Cost Price</Label>
                        <Input
                            id="cost_price"
                            type="number"
                            step="0.01"
                            value={form.watch("cost_price") || ""}
                            onChange={(e) => handleNumberChange("cost_price", e.target.value)}
                            placeholder="0.00"
                            disabled={loading}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}