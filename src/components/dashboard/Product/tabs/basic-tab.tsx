// tabs/BasicTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Package, ImageIcon, Tag, Settings, X, Plus, AlertTriangle } from 'lucide-react'
import { UseFormReturn } from "react-hook-form"
import { ProductFormData, Specification, } from "@/types/product.types"
import ImageUpload from "@/components/shared/image-upload"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { useState } from "react"
import { iTag } from "@/models/StoreAdmin/product.model"

interface BasicTabProps {
    form: UseFormReturn<ProductFormData>
    loading: boolean
    formErrors: Record<string, string>
    setFormErrors: (errors: Record<string, string>) => void
    validateForm: () => boolean
    allCategories: any[]
    tags: iTag[]
    setTags: (tags: iTag[]) => void
    specifications: Specification[]
    setSpecifications: (specs: Specification[]) => void
    mainImages: (File | string)[]
    setMainImages: (images: (File | string)[]) => void
    mainPrimaryIndex: number
    setMainPrimaryIndex: (index: number) => void
}

export function BasicTab({
    form,
    loading,
    formErrors,
    allCategories,
    tags,
    setTags,
    specifications,
    setSpecifications,
    mainImages,
    setMainImages,
    mainPrimaryIndex,
    setMainPrimaryIndex
}: BasicTabProps) {
    const [newTag, setNewTag] = useState<iTag>({ name: '', value: '' })
    const [newSpecification, setNewSpecification] = useState<Specification>({ key: '', value: '' })

    const handleNumberChange = (field: keyof ProductFormData, value: string) => {
        const num = value === '' ? 0 : Number(value)
        form.setValue(field, num as any)
    }

    const addTag = () => {
        const trimmedName = newTag.name.trim()
        const trimmedValue = newTag.value.trim()

        if (trimmedName && trimmedValue) {
            if (tags.some(tag => tag.name.toLowerCase() === trimmedName.toLowerCase())) {
                alert(`Tag "${trimmedName}" already exists`)
                return
            }
            setTags([...tags, { name: trimmedName, value: trimmedValue }])
            setNewTag({ name: '', value: '' })
        }
    }

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index))
    }

    const addSpecification = () => {
        const { key, value } = newSpecification
        const trimmedKey = key.trim()
        const trimmedValue = value.trim()

        if (trimmedKey && trimmedValue) {
            if (specifications.some(spec => spec.key === trimmedKey)) {
                alert(`Specification "${trimmedKey}" already exists`)
                return
            }
            setSpecifications([...specifications, { key: trimmedKey, value: trimmedValue }])
            setNewSpecification({ key: '', value: '' })
        }
    }

    const removeSpecification = (index: number) => {
        setSpecifications(specifications.filter((_, i) => i !== index))
    }

    const handleMainImageSelect = (files: File[]) => {
        setMainImages([...mainImages, ...files])
    }

    const handleMainImageRemove = (index: number) => {
        setMainImages(mainImages.filter((_, i) => i !== index))
        setMainPrimaryIndex(index === mainPrimaryIndex ? 0 : mainPrimaryIndex > index ? mainPrimaryIndex - 1 : mainPrimaryIndex)
    }

    const handleMainSetPrimaryImage = (index: number) => {
        setMainPrimaryIndex(index)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Product Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-1">
                                Product Name
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                {...form.register("name")}
                                placeholder="Enter product name"
                                disabled={loading}
                                className={formErrors.name ? "border-red-500" : ""}
                            />
                            {formErrors.name && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {formErrors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={form.watch("category") || ""}
                                onValueChange={(value) => form.setValue("category", value)}
                                disabled={loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allCategories.map((category) => (
                                        <SelectItem key={category._id} value={category._id}>
                                            {category.display_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="brand">Brand</Label>
                                <Input
                                    id="brand"
                                    {...form.register("brand")}
                                    placeholder="Enter brand name"
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU</Label>
                                <Input
                                    id="sku"
                                    {...form.register("sku")}
                                    placeholder="Enter product SKU"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="GST">GST (%)</Label>
                                <Input
                                    id="GST"
                                    {...form.register("GST")}
                                    placeholder="Enter GST percentage"
                                    disabled={loading}
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="HSNCode">HSN Code</Label>
                                <Input
                                    id="HSNCode"
                                    {...form.register("HSNCode")}
                                    placeholder="Enter HSN code"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <RichTextEditor
                                value={form.watch("description") || ""}
                                onChange={(value) => form.setValue("description", value)}
                                placeholder="Describe your product in detail..."
                                disabled={loading}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Product Images
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ImageUpload
                            onSelectFiles={handleMainImageSelect}
                            onRemove={handleMainImageRemove}
                            onSetPrimary={handleMainSetPrimaryImage}
                            value={mainImages}
                            primaryIndex={mainPrimaryIndex}
                            multiple={true}
                            showPreview={true}
                            disabled={loading}
                            showLocalPreview={true}
                            maxFiles={10}
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                            Upload up to 10 images. First image will be used as primary.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Tags
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            value={newTag.name}
                            onChange={(e) => setNewTag((prev: any) => ({ ...prev, name: e.target.value }))}
                            placeholder="Tag name"
                            disabled={loading}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    addTag()
                                }
                            }}
                        />
                        <div className="flex gap-2">
                            <Input
                                value={newTag.value}
                                onChange={(e) => setNewTag((prev: any) => ({ ...prev, value: e.target.value }))}
                                placeholder="Tag value"
                                disabled={loading}
                                className="flex-1"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        addTag()
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                onClick={addTag}
                                variant="outline"
                                disabled={loading || !newTag.name.trim() || !newTag.value.trim()}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    {tags.length > 0 && (
                        <div className="space-y-2">
                            {tags.map((tag, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium">{tag.name}:</span>
                                        <span className="text-muted-foreground">{tag.value}</span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeTag(index)}
                                        disabled={loading}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Specifications
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            value={newSpecification.key}
                            onChange={(e) => setNewSpecification(prev => ({ ...prev, key: e.target.value }))}
                            placeholder="Specification name"
                            disabled={loading}
                        />
                        <div className="flex gap-2">
                            <Input
                                value={newSpecification.value}
                                onChange={(e) => setNewSpecification(prev => ({ ...prev, value: e.target.value }))}
                                placeholder="Specification value"
                                disabled={loading}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={addSpecification}
                                variant="outline"
                                disabled={loading || !newSpecification.key.trim() || !newSpecification.value.trim()}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    {specifications.length > 0 && (
                        <div className="space-y-2">
                            {specifications.map((spec, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
                                    <span className="font-medium">{spec.key}:</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-muted-foreground">{spec.value}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSpecification(index)}
                                            disabled={loading}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}