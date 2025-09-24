import { useState, useCallback } from "react"
import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Trash2, Plus, Copy, ImageIcon } from 'lucide-react'

import ImageUpload from "@/components/shared/image-upload"
import { iProductFormData, iProductVariant } from "@/models/StoreAdmin/product.model"
import { iCategory } from "@/models/StoreAdmin/category.model"
import { CategoryFilter } from "@/models/StoreAdmin/product.model"
import { v4 } from "uuid"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ColorVariantsTabProps {
    form: UseFormReturn<iProductFormData>
    loading: boolean
    colorVariants: iProductVariant[]
    setColorVariants: (variants: iProductVariant[]) => void
    sizeOptions: string[]
    setSizeOptions: (options: string[]) => void
    categoryAttributes: CategoryFilter[]
    selectedCategory?: iCategory
    handleNumberChange: (field: string, value: string) => void
}

export default function ColorVariantsTab({
    form,
    loading,
    colorVariants,
    setColorVariants,
    sizeOptions,
    setSizeOptions,
    categoryAttributes,
    selectedCategory,
    handleNumberChange
}: ColorVariantsTabProps) {
    const [newSizeOption, setNewSizeOption] = useState("")

    // Variant image handling
    const handleImageSelect = useCallback((id: string, files: File[]) => {
        setColorVariants(prev =>
            prev.map(v =>
                v.id === id ? { ...v, images: [...v.images, ...files] } : v
            )
        )
    }, [setColorVariants])

    const handleImageRemove = useCallback((id: string, index: number) => {
        setColorVariants(prev =>
            prev.map(v => {
                if (v.id !== id) return v
                const newImages = v.images.filter((_, i) => i !== index)
                let newPrimary = v.primaryIndex
                if (index === newPrimary) newPrimary = 0
                else if (index < newPrimary) newPrimary -= 1
                return { ...v, images: newImages, primaryIndex: newPrimary }
            })
        )
    }, [setColorVariants])

    const handleSetPrimaryImage = useCallback((id: string, index: number) => {
        setColorVariants(prev =>
            prev.map(v => (v.id === id ? { ...v, primaryIndex: index } : v))
        )
    }, [setColorVariants])

    // Variant management
    const addColorVariant = () => {
        const newVariant: iProductVariant = {
            id: v4(),
            color: "",
            images: [],
            primaryIndex: 0,
            sizes: [],
            option: "",
            price: 0,
            sku: "",
            stock_quantity: 0
        } as any
        setColorVariants([...colorVariants, newVariant])
    }

    const removeColorVariant = (id: string) => {
        setColorVariants(colorVariants.filter(v => v.id !== id))
    }

    const updateColorVariant = (id: string, updates: Partial<iProductVariant>) => {
        setColorVariants(
            colorVariants.map(variant =>
                variant.id === id ? { ...variant, ...updates } : variant
            )
        )
    }

    const toggleSizeSelection = (variantId: string, sizeLabel: string) => {
        setColorVariants(prev =>
            prev.map(variant => {
                if (variant.id !== variantId) return variant
                const exists = variant.sizes.find(s => s.size === sizeLabel)
                if (exists) {
                    return {
                        ...variant,
                        sizes: variant.sizes.filter(s => s.size !== sizeLabel)
                    }
                } else {
                    const newSize: any = {
                        id: v4(),
                        size: sizeLabel,
                        stock: 0,
                        priceModifier: 0,
                        sku: "",
                        attributes: {}
                    }
                    return {
                        ...variant,
                        sizes: [...variant.sizes, newSize]
                    }
                }
            })
        )
    }

    const addNewSizeOption = () => {
        const label = newSizeOption.trim()
        if (!label) return
        if (!sizeOptions.includes(label)) {
            setSizeOptions(prev => [...prev, label])
        }
        setNewSizeOption("")
    }

    const removeSizeFromVariant = (variantId: string, sizeId: string) => {
        setColorVariants(
            colorVariants.map(variant =>
                variant.id === variantId
                    ? {
                        ...variant,
                        sizes: variant.sizes.filter(s => s.id !== sizeId)
                    }
                    : variant
            )
        )
    }

    const updateSizeInVariant = (
        variantId: string,
        sizeId: string,
        updates: Partial<any>
    ) => {
        setColorVariants(
            colorVariants.map(variant => {
                if (variant.id === variantId) {
                    return {
                        ...variant,
                        sizes: variant.sizes.map(size =>
                            size.id === sizeId ? { ...size, ...updates } : size
                        )
                    }
                }
                return variant
            })
        )
    }

    const copyAttributeToAll = (attributeName: string, value: any) => {
        setColorVariants(
            colorVariants.map(v => ({
                ...v,
                attributes: {
                    ...v.attributes,
                    [attributeName]: value
                }
            }))
        )
        toast.success(`Copied ${attributeName} to all variants`)
    }

    const updateSizeAttribute = (
        variantId: string,
        sizeId: string,
        attributeName: string,
        value: any
    ) => {
        setColorVariants(
            colorVariants.map(variant => {
                if (variant.id === variantId) {
                    return {
                        ...variant,
                        sizes: variant.sizes.map(size => {
                            if (size.id === sizeId) {
                                return {
                                    ...size,
                                    attributes: {
                                        ...size.attributes,
                                        [attributeName]: value
                                    }
                                }
                            }
                            return size
                        })
                    }
                }
                return variant
            })
        )
    }

    const renderAttributeInput = (variantId: string, sizeId: string, attribute: CategoryFilter) => {
        const variant = colorVariants.find(v => v.id === variantId)
        if (!variant) return null
        const size = variant.sizes.find(s => s.id === sizeId)
        if (!size) return null
        const value = size.attributes[attribute.name]

        switch (attribute.type) {
            case "text":
                return (
                    <Input
                        className="h-8 text-sm"
                        value={value || ""}
                        onChange={(e) => updateSizeAttribute(variantId, sizeId, attribute.name, e.target.value)}
                        placeholder={`Enter ${attribute.name}`}
                    />
                )
            case "number":
                return (
                    <Input
                        className="h-8 text-sm"
                        type="number"
                        value={value || ""}
                        onChange={(e) => updateSizeAttribute(variantId, sizeId, attribute.name, Number(e.target.value))}
                        placeholder={`Enter ${attribute.name}`}
                    />
                )
            case "select":
                return (
                    <Select
                        value={value || ""}
                        onValueChange={(val) => updateSizeAttribute(variantId, sizeId, attribute.name, val)}
                    >
                        <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder={`Select ${attribute.name}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {attribute.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            case "multiselect":
                const currentValues = Array.isArray(value) ? value : []
                return (
                    <div className="space-y-1">
                        {attribute.options.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${variantId}-${sizeId}-${attribute.name}-${option}`}
                                    checked={currentValues.includes(option)}
                                    onCheckedChange={(checked) => {
                                        const newValues = checked
                                            ? [...currentValues, option]
                                            : currentValues.filter((v) => v !== option)
                                        updateSizeAttribute(variantId, sizeId, attribute.name, newValues)
                                    }}
                                />
                                <label
                                    className="text-sm truncate"
                                    htmlFor={`${variantId}-${sizeId}-${attribute.name}-${option}`}
                                >
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Color & Size Variants
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <Button
                            type="button"
                            onClick={addColorVariant}
                            className="w-full md:w-auto"
                            disabled={loading}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Color Variant
                        </Button>

                        <div className="flex flex-col gap-2 w-full md:w-auto">
                            <Label className="text-sm">Global Sizes</Label>
                            <div className="flex items-center gap-2">
                                <div className="flex flex-wrap gap-1">
                                    {sizeOptions.map(opt => (
                                        <Badge key={opt} variant="outline" className="px-2 py-1">
                                            {opt}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                                    <Input
                                        placeholder="Add custom size"
                                        value={newSizeOption}
                                        onChange={(e) => setNewSizeOption(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addNewSizeOption())}
                                        className="flex-1"
                                        disabled={loading}
                                    />
                                    <Button
                                        type="button"
                                        onClick={addNewSizeOption}
                                        variant="outline"
                                        size="icon"
                                        disabled={loading}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {colorVariants.length === 0 ? (
                            <div className="text-center py-8 border rounded-lg bg-muted/20">
                                <p className="text-muted-foreground mb-4">No color variants added yet</p>
                                <Button
                                    type="button"
                                    onClick={addColorVariant}
                                    variant="secondary"
                                    disabled={loading}
                                >
                                    Add Your First Color Variant
                                </Button>
                            </div>
                        ) : (
                            <>
                                {colorVariants.map((variant, index) => (
                                    <Card key={variant.id} className="border rounded-lg overflow-hidden">
                                        <CardHeader className="bg-muted/40 p-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-medium">{index + 1}. <b>{variant.color}</b> Color Variant </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeColorVariant(variant.id)}
                                                        className="text-destructive-foreground"
                                                        disabled={loading}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 space-y-6">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Color Name *</Label>
                                                        <Input
                                                            value={variant.color}
                                                            onChange={(e) => updateColorVariant(variant.id, { color: e.target.value })}
                                                            placeholder="e.g., Red, Blue, Black"
                                                            disabled={loading}
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label>Variant Images</Label>
                                                        <ImageUpload
                                                            onSelectFiles={(files) => handleImageSelect(variant.id, files)}
                                                            onRemove={(index) => handleImageRemove(variant.id, index)}
                                                            onSetPrimary={(index) => handleSetPrimaryImage(variant.id, index)}
                                                            value={variant.images}
                                                            primaryIndex={variant.primaryIndex}
                                                            multiple={true}
                                                            showPreview={true}
                                                            showLocalPreview={true}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <Label>Choose Sizes</Label>
                                                        <p className="text-sm text-muted-foreground">Select sizes to show</p>
                                                    </div>

                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                        {sizeOptions.map(opt => {
                                                            const checked = !!variant.sizes.find(s => s.size === opt)
                                                            return (
                                                                <label
                                                                    key={opt}
                                                                    className={`flex items-center gap-2 p-2 border rounded transition-colors ${checked ? 'border-primary bg-primary/10' : 'hover:bg-muted/50'
                                                                        }`}
                                                                >
                                                                    <Checkbox
                                                                        id={`${variant.id}-size-${opt}`}
                                                                        checked={checked}
                                                                        onCheckedChange={() => toggleSizeSelection(variant.id, opt)}
                                                                        disabled={loading}
                                                                    />
                                                                    <span className="text-sm">{opt}</span>
                                                                </label>
                                                            )
                                                        })}
                                                    </div>

                                                    <div className="mt-2">
                                                        <Label className="text-sm">Custom size for this variant</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                placeholder="Enter size and press Enter"
                                                                onKeyPress={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        e.preventDefault()
                                                                        const txt = (e.target as HTMLInputElement).value.trim()
                                                                        if (txt) {
                                                                            if (!sizeOptions.includes(txt)) {
                                                                                setSizeOptions(prev => [...prev, txt])
                                                                            }
                                                                            toggleSizeSelection(variant.id, txt)
                                                                                ; (e.target as HTMLInputElement).value = ""
                                                                        }
                                                                    }
                                                                }}
                                                                disabled={loading}
                                                            />
                                                            <Button
                                                                type="button"
                                                                onClick={() => toast("Press Enter in the input to add the custom size.")}
                                                                variant="outline"
                                                                size="icon"
                                                                disabled={loading}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[800px] border border-gray-500 rounded">
                                        <thead>
                                            <tr className="border-b border-b-gray-500">
                                                <th className="text-left p-2 w-[100px]">
                                                    Color
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" size="icon" onClick={() => copyAttributeToAll("color", colorVariants[0]?.color)}>
                                                                    <Copy className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Copy from first variant to all</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </th>
                                                <th className="text-left p-2 w-[100px]">Size</th>
                                                <th className="text-left p-2 w-[150px]">SKU</th>
                                                <th className="text-left p-2 w-[120px]">Price Modifier</th>
                                                <th className="text-left p-2 w-[120px]">Final Price</th>
                                                <th className="text-left p-2 w-[100px]">Stock Qty</th>
                                                {categoryAttributes.map((attr) => (
                                                    <th
                                                        key={attr.name}
                                                        className="text-left p-2 min-w-[150px]"
                                                    >
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger className="text-left truncate max-w-[120px] block">
                                                                    {attr.name}
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {attr.name}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </th>
                                                ))}
                                                <th className="text-left p-2 w-[80px]">Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {colorVariants.map((variant) =>
                                                variant.sizes.map((size) => {
                                                    const key = `${variant.id}_${size.id}`
                                                    return (
                                                        <tr key={key} className="border-b hover:bg-muted/50">
                                                            <td className="p-2 font-medium">{variant.color}</td>
                                                            <td className="p-2 font-medium">{size.size}</td>
                                                            <td className="p-2">
                                                                <Input
                                                                    className="h-8 text-sm"
                                                                    value={size.sku}
                                                                    onChange={(e) =>
                                                                        updateSizeInVariant(variant.id, size.id, {
                                                                            sku: e.target.value,
                                                                        })
                                                                    }
                                                                    placeholder="SKU"
                                                                    disabled={loading}
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <Input
                                                                    className="h-8 text-sm"
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={size.priceModifier}
                                                                    onChange={(e) =>
                                                                        updateSizeInVariant(variant.id, size.id, {
                                                                            priceModifier: Number(e.target.value),
                                                                        })
                                                                    }
                                                                    placeholder="0.00"
                                                                    disabled={loading}
                                                                />
                                                            </td>
                                                            <td className="p-2 font-medium">
                                                                $
                                                                {(
                                                                    Number(form.watch("price") || 0) +
                                                                    Number(size.priceModifier || 0)
                                                                ).toFixed(2)}
                                                            </td>
                                                            <td className="p-2">
                                                                <Input
                                                                    className="h-8 text-sm"
                                                                    type="number"
                                                                    value={size.stock}
                                                                    onChange={(e) =>
                                                                        updateSizeInVariant(variant.id, size.id, {
                                                                            stock: Number(e.target.value),
                                                                        })
                                                                    }
                                                                    placeholder="0"
                                                                    disabled={loading}
                                                                />
                                                            </td>

                                                            {categoryAttributes.map((attr: any) => (
                                                                <td key={attr.name} className="p-2 min-w-[50px] max-w-[200px]">
                                                                    {renderAttributeInput(variant.id, size.id, attr)}
                                                                </td>
                                                            ))}

                                                            <td className="p-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        removeSizeFromVariant(variant.id, size.id)
                                                                    }
                                                                    className="h-8 w-8"
                                                                    disabled={loading}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}