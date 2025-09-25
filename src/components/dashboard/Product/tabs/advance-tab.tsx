// tabs/AdvancedTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Settings, Eye, EyeOff } from 'lucide-react'
import { UseFormReturn } from "react-hook-form"
import { ProductFormData, ProductVariant } from "@/types/product.types"

interface AdvancedTabProps {
    form: UseFormReturn<ProductFormData>
    loading: boolean
    formErrors: Record<string, string>
    allCategories: any[]
    colorVariants: ProductVariant[]
    mainImages: (File | string)[]
}

export function AdvancedTab({ form, loading, allCategories, colorVariants, mainImages }: AdvancedTabProps) {
    const selectedCategory = allCategories.find(cat => cat._id === form.watch("category"))

    return (
        <div className="space-y-6">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Product Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="visibility">Product Visibility</Label>
                        <Select
                            value={form.watch("visibility")}
                            onValueChange={(value) => form.setValue("visibility", value as any)}
                            disabled={loading}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="public">
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        Public - Visible to everyone
                                    </div>
                                </SelectItem>
                                <SelectItem value="private">
                                    <div className="flex items-center gap-2">
                                        <EyeOff className="h-4 w-4" />
                                        Private - Only visible to admins
                                    </div>
                                </SelectItem>
                                <SelectItem value="hidden">
                                    <div className="flex items-center gap-2">
                                        <EyeOff className="h-4 w-4" />
                                        Hidden - Not visible anywhere
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                            <div>
                                <Label>Active Status</Label>
                                <p className="text-sm text-muted-foreground">Make this product available for purchase</p>
                            </div>
                            <Switch
                                checked={form.watch("is_active")}
                                onCheckedChange={(checked) => form.setValue("is_active", checked)}
                                disabled={loading}
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                            <div>
                                <Label>Featured Product</Label>
                                <p className="text-sm text-muted-foreground">Show this product in featured sections</p>
                            </div>
                            <Switch
                                checked={form.watch("is_featured")}
                                onCheckedChange={(checked) => form.setValue("is_featured", checked)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Product Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Product Name</Label>
                            <p className="font-medium truncate">{form.watch("name") || "Not set"}</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Category</Label>
                            <p className="font-medium truncate">
                                {selectedCategory?.display_name || "Not selected"}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Price</Label>
                            <p className="font-medium">${(form.watch("price") || 0).toFixed(2)}</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Stock Quantity</Label>
                            <p className="font-medium">{form.watch("stock.quantity") || 0}</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Variants</Label>
                            <p className="font-medium">{colorVariants.length} color variants</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Images</Label>
                            <p className="font-medium">{mainImages.length}</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Status</Label>
                            <p className="font-medium capitalize">{form.watch("is_active") ? "Active" : "Inactive"}</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Visibility</Label>
                            <p className="font-medium capitalize">{form.watch("visibility")}</p>
                        </div>
                    </div>

                    {colorVariants.length > 0 && (
                        <div className="mt-4 p-3 bg-muted/20 rounded-md">
                            <Label className="text-sm font-medium">Variant Summary</Label>
                            <div className="mt-2 space-y-1">
                                {colorVariants.map((variant, index) => (
                                    <div key={variant.id} className="flex justify-between text-sm">
                                        <span>{index + 1}. {variant.color || "Unnamed"}</span>
                                        <span>{variant.sizes.length} sizes</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Technical Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <Label className="text-muted-foreground">Product ID</Label>
                            <p className="font-mono">{form.watch("sku") || "Not set"}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">HSN Code</Label>
                            <p>{form.watch("HSNCode") || "Not set"}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">GST Rate</Label>
                            <p>{form.watch("GST") ? `${form.watch("GST")}%` : "Not set"}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Brand</Label>
                            <p>{form.watch("brand") || "Not set"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}