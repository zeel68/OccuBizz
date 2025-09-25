// tabs/ShippingTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Truck } from 'lucide-react'
import { UseFormReturn } from "react-hook-form"
import { ProductFormData } from "@/types/product.types"

interface ShippingTabProps {
    form: UseFormReturn<ProductFormData>
    loading: boolean
    formErrors: Record<string, string>
}

export function ShippingTab({ form, loading }: ShippingTabProps) {
    const handleNumberChange = (field: string, value: string) => {
        const num = value === '' ? undefined : Number(value)
        form.setValue(field as any, num)
    }

    const weight = form.watch("shipping.weight")
    const length = form.watch("shipping.dimensions.length")
    const width = form.watch("shipping.dimensions.width")
    const height = form.watch("shipping.dimensions.height")

    const hasAllDimensions = length && width && height
    const volume = hasAllDimensions ? (length * width * height) / 1000 : 0 // Convert to liters

    return (
        <Card className="shadow-sm">
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
                        min="0"
                        value={weight || ""}
                        onChange={(e) => handleNumberChange("shipping.weight", e.target.value)}
                        placeholder="0.00"
                        disabled={loading}
                    />
                    <p className="text-sm text-muted-foreground">
                        Product weight in kilograms
                    </p>
                </div>

                <div className="space-y-4">
                    <Label>Dimensions (cm)</Label>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm">Length</Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={length || ""}
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
                                min="0"
                                value={width || ""}
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
                                min="0"
                                value={height || ""}
                                onChange={(e) => handleNumberChange("shipping.dimensions.height", e.target.value)}
                                placeholder="0.00"
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Product dimensions in centimeters
                    </p>
                </div>

                {(weight || hasAllDimensions) && (
                    <div className="p-4 bg-muted rounded-lg shadow-inner">
                        <Label className="text-sm font-medium">Package Info</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            {weight && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Weight</p>
                                    <p className="font-medium">{weight} kg</p>
                                </div>
                            )}
                            {hasAllDimensions && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Dimensions</p>
                                    <p className="font-medium">
                                        {length} × {width} × {height} cm
                                    </p>
                                </div>
                            )}
                            {hasAllDimensions && (
                                <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground">Volume</p>
                                    <p className="font-medium">{volume.toFixed(2)} liters</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!weight && !hasAllDimensions && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                            Shipping information is optional but recommended for accurate shipping calculations.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}