// tabs/InventoryTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { BarChart3 } from 'lucide-react'
import { UseFormReturn } from "react-hook-form"
import { ProductFormData, ProductVariant } from "@/types/product.types"

interface InventoryTabProps {
    form: UseFormReturn<ProductFormData>
    loading: boolean
    formErrors: Record<string, string>
    colorVariants: ProductVariant[]
}

export function InventoryTab({ form, loading, colorVariants }: InventoryTabProps) {
    const handleNumberChange = (field: string, value: string) => {
        const num = value === '' ? 0 : Number(value)
        form.setValue(field as any, num)
    }

    const baseStock = form.watch("stock.quantity") || 0
    const trackInventory = form.watch("stock.track_inventory")
    const allowBackorder = form.watch("stock.allow_backorder")

    const variantStock = colorVariants.reduce((total, variant) =>
        total + variant.sizes.reduce((varTotal: any, size: any) => varTotal + (size.stock || 0), 0), 0
    )

    const totalStock = baseStock + variantStock

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Inventory Management
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="quantity">Stock Quantity</Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="0"
                            value={baseStock}
                            onChange={(e) => handleNumberChange("stock.quantity", e.target.value)}
                            placeholder="0"
                            disabled={loading || !trackInventory}
                        />
                        <p className="text-sm text-muted-foreground">
                            Base stock quantity for this product
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="low_stock_threshold">Low Stock Alert</Label>
                        <Input
                            id="low_stock_threshold"
                            type="number"
                            min="0"
                            value={form.watch("stock.low_stock_threshold")}
                            onChange={(e) => handleNumberChange("stock.low_stock_threshold", e.target.value)}
                            placeholder="10"
                            disabled={loading || !trackInventory}
                        />
                        <p className="text-sm text-muted-foreground">
                            Get notified when stock falls below this level
                        </p>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                        <div>
                            <Label>Track Inventory</Label>
                            <p className="text-sm text-muted-foreground">Monitor stock levels for this product</p>
                        </div>
                        <Switch
                            checked={trackInventory}
                            onCheckedChange={(checked) => form.setValue("stock.track_inventory", checked)}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                        <div>
                            <Label>Allow Backorder</Label>
                            <p className="text-sm text-muted-foreground">Accept orders when out of stock</p>
                        </div>
                        <Switch
                            checked={allowBackorder}
                            onCheckedChange={(checked) => form.setValue("stock.allow_backorder", checked)}
                            disabled={loading || !trackInventory}
                        />
                    </div>
                </div>

                <div className="p-4 bg-muted rounded-lg shadow-inner">
                    <Label className="text-sm font-medium">Stock Summary</Label>
                    <div className="mt-2 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Base Stock:</span>
                            <span className="font-medium">{baseStock}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Variant Stock:</span>
                            <span className="font-medium">{variantStock}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Total Available:</span>
                            <span className="font-bold">{totalStock}</span>
                        </div>
                    </div>
                </div>

                {!trackInventory && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                            Inventory tracking is disabled. Stock quantities will not be monitored.
                        </p>
                    </div>
                )}

                {allowBackorder && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-800">
                            Backorders are allowed. Customers can order even when stock is unavailable.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}