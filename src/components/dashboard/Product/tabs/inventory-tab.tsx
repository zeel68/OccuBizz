import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { BarChart3 } from 'lucide-react'
import { iProductFormData } from "@/models/StoreAdmin/product.model"

interface InventoryTabProps {
    form: UseFormReturn<iProductFormData>
    loading: boolean
    handleNumberChange: (field: string, value: string) => void
}

export default function InventoryTab({ form, loading, handleNumberChange }: InventoryTabProps) {
    return (
        <Card>
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
                            value={form.watch("stock.quantity")}
                            onChange={(e) => handleNumberChange("stock.quantity", e.target.value)}
                            placeholder="0"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="low_stock_threshold">Low Stock Alert</Label>
                        <Input
                            id="low_stock_threshold"
                            type="number"
                            value={form.watch("stock.low_stock_threshold")}
                            onChange={(e) => handleNumberChange("stock.low_stock_threshold", e.target.value)}
                            placeholder="10"
                            disabled={loading}
                        />
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Track Inventory</Label>
                            <p className="text-sm text-muted-foreground">Monitor stock levels for this product</p>
                        </div>
                        <Switch
                            checked={form.watch("stock.track_inventory")}
                            onCheckedChange={(checked) => form.setValue("stock.track_inventory", checked)}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Allow Backorder</Label>
                            <p className="text-sm text-muted-foreground">Accept orders when out of stock</p>
                        </div>
                        <Switch
                            checked={form.watch("stock.allow_backorder")}
                            onCheckedChange={(checked) => form.setValue("stock.allow_backorder", checked)}
                            disabled={loading}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}