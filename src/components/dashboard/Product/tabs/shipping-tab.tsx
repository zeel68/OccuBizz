import { useState } from "react"
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
    // Local states to track raw string input
    const [weightInput, setWeightInput] = useState<string>(form.watch("shipping.weight")?.toString() || "")
    const [lengthInput, setLengthInput] = useState<string>(form.watch("shipping.dimensions.length")?.toString() || "")
    const [widthInput, setWidthInput] = useState<string>(form.watch("shipping.dimensions.width")?.toString() || "")
    const [heightInput, setHeightInput] = useState<string>(form.watch("shipping.dimensions.height")?.toString() || "")

    const handleBlur = (field: string, value: string) => {
        const parsed = value === "" ? undefined : Number(value)
        if (!isNaN(parsed as any)) {
            form.setValue(field as any, parsed)
        }
    }

    const weight = form.watch("shipping.weight")
    const length = form.watch("shipping.dimensions.length")
    const width = form.watch("shipping.dimensions.width")
    const height = form.watch("shipping.dimensions.height")

    const hasAllDimensions = length !== undefined && width !== undefined && height !== undefined
    const volume = hasAllDimensions ? (length! * width! * height!) / 1000 : 0 // Liters

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Weight */}
                <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                        id="weight"
                        type="number"
                        step="0.01"
                        min="0"
                        value={weightInput}
                        onChange={(e) => setWeightInput(e.target.value)}
                        onBlur={() => handleBlur("shipping.weight", weightInput)}
                        placeholder="0.00"
                        disabled={loading}
                    />
                    <p className="text-sm text-muted-foreground">
                        Product weight in kilograms
                    </p>
                </div>

                {/* Dimensions */}
                <div className="space-y-4">
                    <Label>Dimensions (cm)</Label>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Length */}
                        <div className="space-y-2">
                            <Label className="text-sm">Length</Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={lengthInput}
                                onChange={(e) => setLengthInput(e.target.value)}
                                onBlur={() => handleBlur("shipping.dimensions.length", lengthInput)}
                                placeholder="0.00"
                                disabled={loading}
                            />
                        </div>

                        {/* Width */}
                        <div className="space-y-2">
                            <Label className="text-sm">Width</Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={widthInput}
                                onChange={(e) => setWidthInput(e.target.value)}
                                onBlur={() => handleBlur("shipping.dimensions.width", widthInput)}
                                placeholder="0.00"
                                disabled={loading}
                            />
                        </div>

                        {/* Height */}
                        <div className="space-y-2">
                            <Label className="text-sm">Height</Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={heightInput}
                                onChange={(e) => setHeightInput(e.target.value)}
                                onBlur={() => handleBlur("shipping.dimensions.height", heightInput)}
                                placeholder="0.00"
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Product dimensions in centimeters
                    </p>
                </div>

                {/* Display Calculations */}
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
