// tabs/ColorVariantsTab.tsx
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import {
    ImageIcon,
    Plus,
    Trash2,
    Copy,
    AlertTriangle,
    Palette,
    Package,
    DollarSign,
    Hash,
    ChevronDown,
    ChevronUp,
    Settings2,
    Sparkles,
    CheckSquare
} from 'lucide-react'
import { UseFormReturn } from "react-hook-form"
import { ProductFormData, ProductVariant, CategoryFilter, Size } from "@/types/product.types"
import ImageUpload from "@/components/shared/image-upload"
import { toast } from "sonner"

interface ColorVariantsTabProps {
    form: UseFormReturn<ProductFormData>
    loading: boolean
    formErrors: Record<string, string>
    colorVariants: ProductVariant[]
    setColorVariants: (variants: ProductVariant[]) => void
    sizeOptions: string[]
    setSizeOptions: (sizes: string[]) => void
    categoryAttributes: CategoryFilter[]
}

export function ColorVariantsTab({
    form,
    loading,
    formErrors,
    colorVariants,
    setColorVariants,
    sizeOptions,
    setSizeOptions,
    categoryAttributes
}: ColorVariantsTabProps) {
    const [newSizeOption, setNewSizeOption] = useState("")
    const [expandedVariants, setExpandedVariants] = useState<Record<string, boolean>>({})
    const [showSizeMatrix, setShowSizeMatrix] = useState(false)

    const generateUUID = () => crypto.randomUUID()
    const basePrice = form.watch("price") || 0

    // Extract all unique sizes from variants to ensure they appear in global options when editing
    useEffect(() => {
        if (colorVariants.length > 0) {
            const variantSizes = new Set<string>()
            colorVariants.forEach(variant => {
                variant.sizes.forEach((size: any) => {
                    if (size.size) {
                        variantSizes.add(size.size)
                    }
                })
            })

            // Merge existing sizeOptions with sizes found in variants
            const allSizes = new Set([...sizeOptions, ...Array.from(variantSizes)])
            if (allSizes.size > sizeOptions.length) {
                setSizeOptions(Array.from(allSizes))
            }
        }
    }, [colorVariants]) // Only run when colorVariants change

    const toggleVariantExpansion = (variantId: string) => {
        setExpandedVariants(prev => ({
            ...prev,
            [variantId]: !prev[variantId]
        }))
    }

    const addColorVariant = () => {
        const newVariant: ProductVariant = {
            id: generateUUID(),
            color: "",
            images: [],
            primaryIndex: 0,
            sizes: [],
        }
        setColorVariants([...colorVariants, newVariant])
        // Auto-expand new variant
        setExpandedVariants(prev => ({ ...prev, [newVariant.id]: true }))
    }

    const removeColorVariant = (id: string) => {
        if (!confirm("Are you sure you want to remove this color variant? This action cannot be undone.")) return
        setColorVariants(colorVariants.filter(v => v.id !== id))
        // Clean up expanded state
        setExpandedVariants(prev => {
            const { [id]: removed, ...rest } = prev
            return rest
        })
    }

    const updateColorVariant = (id: string, updates: Partial<ProductVariant>) => {
        setColorVariants(colorVariants.map(variant =>
            variant.id === id ? { ...variant, ...updates } : variant
        ))
    }

    const selectAllSizes = (variantId: string) => {
        setColorVariants(colorVariants.map(variant => {
            if (variant.id !== variantId) return variant

            // Get all available size options (global + any custom sizes already in this variant)
            const availableSizes = Array.from(new Set([
                ...sizeOptions,
                ...variant.sizes.map((s: any) => s.size)
            ]))

            // Create new sizes array with all available sizes
            const newSizes = availableSizes.map(sizeLabel => {
                const existingSize = variant.sizes.find((s: any) => s.size === sizeLabel)
                if (existingSize) {
                    return existingSize
                } else {
                    return {
                        id: generateUUID(),
                        size: sizeLabel,
                        stock: 0,
                        priceModifier: 0,
                        sku: "",
                        attributes: {}
                    }
                }
            })

            return {
                ...variant,
                sizes: newSizes
            }
        }))
        toast.success("All sizes selected for this variant")
    }

    const deselectAllSizes = (variantId: string) => {
        setColorVariants(colorVariants.map(variant =>
            variant.id === variantId ? { ...variant, sizes: [] } : variant
        ))
        toast.success("All sizes deselected for this variant")
    }

    const toggleSizeSelection = (variantId: string, sizeLabel: string) => {
        setColorVariants(colorVariants.map(variant => {
            if (variant.id !== variantId) return variant

            const exists = variant.sizes.find((s: any) => s.size === sizeLabel)
            if (exists) {
                return {
                    ...variant,
                    sizes: variant.sizes.filter((s: any) => s.size !== sizeLabel)
                }
            } else {
                const newSize: Size = {
                    id: generateUUID(),
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
        }))
    }

    const addNewSizeOption = () => {
        const label = newSizeOption.trim()
        if (!label) {
            toast.error("Size option cannot be empty")
            return
        }
        if (sizeOptions.includes(label)) {
            toast.error("Size option already exists")
            return
        }
        setSizeOptions([...sizeOptions, label])
        setNewSizeOption("")
        toast.success(`Size "${label}" added to global options`)
    }

    const removeSizeOption = (sizeToRemove: string) => {
        if (!confirm(`Remove "${sizeToRemove}" from global size options? This will also remove it from all variants.`)) return

        // Remove from global options
        const newSizeOptions = sizeOptions.filter(opt => opt !== sizeToRemove)
        setSizeOptions(newSizeOptions)

        // Remove from all variants
        setColorVariants(colorVariants.map(variant => ({
            ...variant,
            sizes: variant.sizes.filter((s: any) => s.size !== sizeToRemove)
        })))

        toast.success(`Size "${sizeToRemove}" removed`)
    }

    const removeSizeFromVariant = (variantId: string, sizeId: string) => {
        if (!confirm("Remove this size from the variant?")) return
        setColorVariants(colorVariants.map(variant =>
            variant.id === variantId
                ? { ...variant, sizes: variant.sizes.filter((s: any) => s.id !== sizeId) }
                : variant
        ))
    }

    const updateSizeInVariant = (variantId: string, sizeId: string, updates: Partial<Size>) => {
        setColorVariants(colorVariants.map(variant => {
            if (variant.id === variantId) {
                return {
                    ...variant,
                    sizes: variant.sizes.map((size: any) =>
                        size.id === sizeId ? { ...size, ...updates } : size
                    )
                }
            }
            return variant
        }))
    }

    const updateSizeAttribute = (variantId: string, sizeId: string, attributeName: string, value: any) => {
        setColorVariants(colorVariants.map(variant => {
            if (variant.id === variantId) {
                return {
                    ...variant,
                    sizes: variant.sizes.map((size: any) => {
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
        }))
    }

    const copyAttributeToAll = (attributeName: string, value: any) => {
        if (!colorVariants[0]?.sizes[0]) {
            toast.error("No sizes available to copy from")
            return
        }

        setColorVariants(colorVariants.map(variant => ({
            ...variant,
            sizes: variant.sizes.map((size: any) => ({
                ...size,
                attributes: {
                    ...size.attributes,
                    [attributeName]: value
                }
            }))
        })))
        toast.success(`Copied ${attributeName} to all sizes`)
    }

    const renderAttributeInput = (variantId: string, sizeId: string, attribute: CategoryFilter) => {
        const variant = colorVariants.find(v => v.id === variantId)
        if (!variant) return null

        const size = variant.sizes.find((s: any) => s.id === sizeId)
        if (!size) return null

        const value = size.attributes[attribute.name] ?? (attribute.type === "multiselect" ? [] : "")
        const errorKey = `${variantId}-${sizeId}-${attribute.name}`
        const hasError = formErrors[errorKey]

        const inputProps = {
            className: `h-9 text-sm ${hasError ? "border-red-500" : ""}`,
            disabled: loading,
            placeholder: `Enter ${attribute.name}${attribute.is_required ? " *" : ""}`
        }

        switch (attribute.type) {
            case "text":
                return (
                    <div>
                        <Input
                            {...inputProps}
                            value={value as string}
                            onChange={(e) => updateSizeAttribute(variantId, sizeId, attribute.name, e.target.value)}
                        />
                        {hasError && (
                            <p className="text-xs text-red-500 mt-1">{formErrors[errorKey]}</p>
                        )}
                    </div>
                )
            case "number":
                return (
                    <div>
                        <Input
                            {...inputProps}
                            type="number"
                            value={value as number}
                            onChange={(e) => updateSizeAttribute(variantId, sizeId, attribute.name,
                                e.target.value === "" ? "" : Number(e.target.value)
                            )}
                        />
                        {hasError && (
                            <p className="text-xs text-red-500 mt-1">{formErrors[errorKey]}</p>
                        )}
                    </div>
                )
            case "select":
                return (
                    <div>
                        <Select
                            value={value as string}
                            onValueChange={(val) => updateSizeAttribute(variantId, sizeId, attribute.name, val)}
                            disabled={loading}
                        >
                            <SelectTrigger className={`h-9 text-sm ${hasError ? "border-red-500" : ""}`}>
                                <SelectValue placeholder={`Select ${attribute.name}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {attribute.options.map((option: any) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {hasError && (
                            <p className="text-xs text-red-500 mt-1">{formErrors[errorKey]}</p>
                        )}
                    </div>
                )
            case "multiselect":
                const currentValues = Array.isArray(value) ? value : []
                return (
                    <div>
                        <div className="space-y-1 max-h-32 overflow-y-auto border rounded-md p-2">
                            {attribute.options.map((option: any) => (
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
                                        disabled={loading}
                                    />
                                    <label
                                        className="text-sm truncate cursor-pointer"
                                        htmlFor={`${variantId}-${sizeId}-${attribute.name}-${option}`}
                                    >
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {hasError && (
                            <p className="text-xs text-red-500 mt-1">{formErrors[errorKey]}</p>
                        )}
                    </div>
                )
            default:
                return null
        }
    }

    const totalVariants = colorVariants.length
    const totalSizes = colorVariants.reduce((sum, variant) => sum + variant.sizes.length, 0)

    return (
        <div className="space-y-6">
            {/* Global Size Management */}
            <Card className="shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-lg">Global Size Options</CardTitle>
                        </div>
                        <Badge variant="secondary" className="text-sm">
                            {sizeOptions.length} sizes
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {sizeOptions.map(opt => (
                                <Badge key={opt} variant="outline" className="px-3 py-1 text-sm flex items-center gap-1">
                                    {opt}
                                    <button
                                        type="button"
                                        onClick={() => removeSizeOption(opt)}
                                        className="text-muted-foreground hover:text-red-600 transition-colors"
                                        disabled={loading}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                            {sizeOptions.length === 0 && (
                                <p className="text-sm text-muted-foreground">No size options added yet</p>
                            )}
                        </div>

                        <div className="flex gap-2 max-w-md">
                            <Input
                                placeholder="Add new size option (e.g., XS, S, M, L, XL)"
                                value={newSizeOption}
                                onChange={(e) => setNewSizeOption(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        addNewSizeOption()
                                    }
                                }}
                                disabled={loading}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={addNewSizeOption}
                                variant="outline"
                                disabled={loading || !newSizeOption.trim()}
                                className="px-4"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        onClick={addColorVariant}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Color Variant
                    </Button>

                    {totalSizes > 0 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowSizeMatrix(!showSizeMatrix)}
                            disabled={loading}
                        >
                            <Settings2 className="h-4 w-4 mr-2" />
                            {showSizeMatrix ? "Hide" : "Show"} Size Matrix
                        </Button>
                    )}
                </div>

                {totalVariants > 0 && (
                    <div className="text-sm text-muted-foreground">
                        {totalVariants} color variant{totalVariants !== 1 ? 's' : ''} • {totalSizes} total configurations
                    </div>
                )}
            </div>

            {/* Color Variants */}
            <div className="space-y-4">
                {colorVariants.length === 0 ? (
                    <Card className="border-2 border-dashed border-muted-foreground/25">
                        <CardContent className="text-center py-12">
                            <div className="p-4 bg-muted/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                <Sparkles className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Color Variants Yet</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Create your first color variant to offer different colors and sizes for your product.
                                Each variant can have its own images, sizes, and pricing.
                            </p>
                            <Button
                                type="button"
                                onClick={addColorVariant}
                                disabled={loading}
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create First Variant
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    colorVariants.map((variant, index) => {
                        const isExpanded = expandedVariants[variant.id] ?? true
                        const hasErrors = Object.keys(formErrors).some(key => key.startsWith(variant.id))
                        const allSizesSelected = variant.sizes.length > 0 &&
                            variant.sizes.length === Array.from(new Set([...sizeOptions, ...variant.sizes.map((s: any) => s.size)])).length

                        return (
                            <Card
                                key={variant.id}
                                className={`transition-all duration-200 ${hasErrors ? 'border-red-200 bg-red-50/30' : 'hover:shadow-md'}`}
                            >
                                <CardHeader
                                    className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => toggleVariantExpansion(variant.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {variant.color || `Variant ${index + 1}`}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <span>{variant.images.length} images</span>
                                                        <span>•</span>
                                                        <span>{variant.sizes.length} sizes</span>
                                                        {hasErrors && (
                                                            <>
                                                                <span>•</span>
                                                                <div className="flex items-center gap-1 text-red-600">
                                                                    <AlertTriangle className="h-3 w-3" />
                                                                    <span>Has errors</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeColorVariant(variant.id)
                                                }}
                                                disabled={loading}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            {isExpanded ?
                                                <ChevronUp className="h-5 w-5 text-muted-foreground" /> :
                                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                            }
                                        </div>
                                    </div>
                                </CardHeader>

                                {isExpanded && (
                                    <CardContent className="pt-0">
                                        <div className="space-y-6">
                                            {/* Color Name Input */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="flex items-center gap-1 text-sm font-medium">
                                                        <Palette className="h-4 w-4" />
                                                        Color Name
                                                        <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        value={variant.color}
                                                        onChange={(e) => updateColorVariant(variant.id, { color: e.target.value })}
                                                        placeholder="e.g., Midnight Black, Ocean Blue, Sunset Red"
                                                        disabled={loading}
                                                        className="h-10"
                                                    />
                                                </div>
                                            </div>

                                            <Separator />

                                            {/* Images and Sizes */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Images Section */}
                                                <div className="space-y-4">
                                                    <Label className="flex items-center gap-2 text-base font-medium">
                                                        <ImageIcon className="h-5 w-5" />
                                                        Product Images
                                                    </Label>
                                                    <ImageUpload
                                                        onSelectFiles={(files) => {
                                                            const newImages = [...variant.images, ...files]
                                                            updateColorVariant(variant.id, { images: newImages })
                                                        }}
                                                        onRemove={(index) => {
                                                            const newImages = variant.images.filter((_: any, i: any) => i !== index)
                                                            let newPrimaryIndex = variant.primaryIndex
                                                            if (index === variant.primaryIndex) newPrimaryIndex = 0
                                                            else if (index < variant.primaryIndex) newPrimaryIndex -= 1
                                                            updateColorVariant(variant.id, {
                                                                images: newImages,
                                                                primaryIndex: newPrimaryIndex
                                                            })
                                                        }}
                                                        onSetPrimary={(index) => updateColorVariant(variant.id, { primaryIndex: index })}
                                                        value={variant.images}
                                                        primaryIndex={variant.primaryIndex}
                                                        multiple={true}
                                                        showPreview={true}
                                                        showLocalPreview={true}
                                                        disabled={loading}
                                                        maxFiles={5}
                                                    />
                                                </div>

                                                {/* Size Selection */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="flex items-center gap-2 text-base font-medium">
                                                            <Package className="h-5 w-5" />
                                                            Available Sizes
                                                        </Label>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary">
                                                                {variant.sizes.length} selected
                                                            </Badge>
                                                            {allSizesSelected ? (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => deselectAllSizes(variant.id)}
                                                                    disabled={loading}
                                                                    className="h-8 text-xs"
                                                                >
                                                                    Deselect All
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => selectAllSizes(variant.id)}
                                                                    disabled={loading || sizeOptions.length === 0}
                                                                    className="h-8 text-xs"
                                                                >
                                                                    <CheckSquare className="h-3 w-3 mr-1" />
                                                                    Select All
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <ScrollArea className="h-64 border rounded-lg p-3">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {Array.from(new Set([...sizeOptions, ...variant.sizes.map((s: any) => s.size)])).map(opt => {
                                                                const checked = !!variant.sizes.find((s: any) => s.size === opt)
                                                                return (
                                                                    <label
                                                                        key={opt}
                                                                        className={`flex items-center gap-2 p-3 border rounded-lg transition-all cursor-pointer ${checked
                                                                            ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                                                            : 'hover:bg-muted/50 hover:border-muted-foreground/30'
                                                                            }`}
                                                                    >
                                                                        <Checkbox
                                                                            checked={checked}
                                                                            onCheckedChange={() => toggleSizeSelection(variant.id, opt)}
                                                                            disabled={loading}
                                                                        />
                                                                        <span className="text-sm font-medium">{opt}</span>
                                                                    </label>
                                                                )
                                                            })}
                                                        </div>
                                                        {sizeOptions.length === 0 && (
                                                            <div className="text-center py-8 text-muted-foreground">
                                                                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                                <p className="text-sm">No size options available</p>
                                                                <p className="text-xs">Add global size options above</p>
                                                            </div>
                                                        )}
                                                    </ScrollArea>
                                                    {/* Quick Add Custom Size */}
                                                    <div className="space-y-2">
                                                        <Label className="text-sm text-muted-foreground">Quick add custom size</Label>
                                                        <Input
                                                            placeholder="Enter size and press Enter"
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault()
                                                                    const txt = (e.target as HTMLInputElement).value.trim()
                                                                    if (txt) {
                                                                        if (!sizeOptions.includes(txt)) {
                                                                            setSizeOptions([...sizeOptions, txt]) // Direct value instead of function
                                                                        }
                                                                        toggleSizeSelection(variant.id, txt);
                                                                        (e.target as HTMLInputElement).value = ""
                                                                    }
                                                                }
                                                            }}
                                                            disabled={loading}
                                                            className="h-9"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        )
                    })
                )}
            </div>

            {/* Size Matrix Table */}
            {showSizeMatrix && totalSizes > 0 && (
                <Card className="shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Settings2 className="h-5 w-5" />
                            <CardTitle>Size Matrix Configuration</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Configure pricing, inventory, and attributes for each size variant
                        </p>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="w-full rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-32 font-semibold">Color</TableHead>
                                        <TableHead className="w-24 font-semibold">Size</TableHead>
                                        <TableHead className="w-32 font-semibold">
                                            <div className="flex items-center gap-1">
                                                <Hash className="h-4 w-4" />
                                                SKU
                                            </div>
                                        </TableHead>
                                        <TableHead className="w-32 font-semibold">
                                            <div className="flex items-center gap-1">
                                                ₹ Price +/-
                                            </div>
                                        </TableHead>
                                        <TableHead className="w-32 font-semibold">Final Price</TableHead>
                                        <TableHead className="w-24 font-semibold">Stock</TableHead>
                                        {categoryAttributes.map((attr) => (
                                            <TableHead key={attr.name} className="min-w-[140px]">
                                                <div className="flex items-center gap-2">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger className="truncate max-w-[100px] text-left">
                                                                {attr.name}
                                                                {attr.is_required && <span className="text-red-500 ml-1">*</span>}
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{attr.name} {attr.is_required && '(Required)'}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    {colorVariants[0]?.sizes[0]?.attributes[attr.name] !== undefined && (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => copyAttributeToAll(attr.name, colorVariants[0].sizes[0].attributes[attr.name])}
                                                                        className="h-6 w-6 hover:bg-blue-50"
                                                                    >
                                                                        <Copy className="h-3 w-3" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Copy from first to all</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                </div>
                                            </TableHead>
                                        ))}
                                        <TableHead className="w-20 text-center font-semibold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {colorVariants.map((variant) =>
                                        variant.sizes.map((size: any, sizeIndex: number) => (
                                            <TableRow key={`${variant.id}_${size.id}`} className="hover:bg-muted/30">
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {variant.color || "Unnamed"}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <Badge variant="outline" className="font-mono">
                                                        {size.size}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        className="h-9 text-sm font-mono"
                                                        value={size.sku || ""}
                                                        onChange={(e) =>
                                                            updateSizeInVariant(variant.id, size.id, {
                                                                sku: e.target.value,
                                                            })
                                                        }
                                                        placeholder="SKU-001"
                                                        disabled={loading}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                                                            ₹
                                                        </span>
                                                        <Input
                                                            className="h-9 text-sm pl-8"
                                                            type="number"
                                                            step="0.01"
                                                            value={size.priceModifier || ""}
                                                            onChange={(e) =>
                                                                updateSizeInVariant(variant.id, size.id, {
                                                                    priceModifier:
                                                                        e.target.value === "" ? undefined : parseFloat(e.target.value) || 0,
                                                                })
                                                            }
                                                            placeholder="0.00"
                                                            disabled={loading}
                                                        />
                                                    </div>

                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded text-sm">
                                                        ₹{(
                                                            basePrice +
                                                            (size.priceModifier || 0)
                                                        ).toFixed(2)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        className="h-9 text-sm"
                                                        type="number"
                                                        min="0"
                                                        value={size.stock || ""}
                                                        onChange={(e) =>
                                                            updateSizeInVariant(variant.id, size.id, {
                                                                stock: e.target.value === "" ? undefined : parseInt(e.target.value) || 0,
                                                            })
                                                        }
                                                        placeholder="0"
                                                        disabled={loading}
                                                    />
                                                </TableCell>
                                                {categoryAttributes.map((attr) => (
                                                    <TableCell key={attr.name}>
                                                        {renderAttributeInput(variant.id, size.id, attr)}
                                                    </TableCell>
                                                ))}
                                                <TableCell className="text-center">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeSizeFromVariant(variant.id, size.id)}
                                                        disabled={loading}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>

                        {/* Matrix Summary */}
                        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Total configurations: <span className="font-semibold text-foreground">{totalSizes}</span>
                                </span>
                                <span className="text-muted-foreground">
                                    Price range: <span className="font-semibold text-green-600">
                                        ₹{Math.min(...colorVariants.flatMap(v => v.sizes.map((s: any) => basePrice + (s.priceModifier || 0)))).toFixed(2)}
                                    </span> - <span className="font-semibold text-green-600">
                                        ₹{Math.max(...colorVariants.flatMap(v => v.sizes.map((s: any) => basePrice + (s.priceModifier || 0)))).toFixed(2)}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}