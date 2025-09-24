import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Truck } from 'lucide-react'
import { iProductFormData } from "@/models/StoreAdmin/product.model"

interface ShippingTabProps {
    form: UseFormReturn<iProductFormData>
    loading: boolean
    handleNumberChange: (field: string, value: string) => void
}

export default function ShippingTab({ form, loading, handleNumberChange }: ShippingTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                        id="weight"
                        type="number"
                        step="0.01"
                        value={form.watch("shipping.weight") || ""}
                        onChange={(e) => handleNumberChange("shipping.weight", e.target.value)}
                        placeholder="0.00"
                        disabled={loading}
                    />
                </div>
                <div className="space-y-4">
                    <Label>Dimensions (cm)</Label>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm">Length</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={form.watch("shipping.dimensions.length") || ""}
                                onChange={(e) => handleNumberChange("shipping.dimensions.length", e.target.value)}
                                placeholder="0.00"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Width</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={form.watch("shipping.dimensions.width") || ""}
                                onChange={(e) => handleNumberChange("shipping.dimensions.width", e.target.value)}
                                placeholder="0.00"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Height</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={form.watch("shipping.dimensions.height") || ""}
                                onChange={(e) => handleNumberChange("shipping.dimensions.height", e.target.value)}
                                placeholder="0.00"
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}