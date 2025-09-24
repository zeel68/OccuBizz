import { useCallback, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, ImageIcon, Tag, Plus, X } from "lucide-react"

import { RichTextEditor } from "@/components/ui/rich-text-editor"
import ImageUpload from "@/components/shared/image-upload"
import { iProductFormData } from "@/models/StoreAdmin/product.model"
import { iCategory } from "@/models/StoreAdmin/category.model"

interface BasicTabProps {
    form: UseFormReturn<iProductFormData>
    loading: boolean
    allCategories: iCategory[]
    mainImages: (File | string)[]
    mainPrimaryIndex: number
    tags: Array<{ tagName: string; value: string }>
    setMainImages: (images: (File | string)[]) => void
    setMainPrimaryIndex: (index: number) => void
    setTags: (tags: Array<{ tagName: string; value: string }>) => void
    handleNumberChange: (field: string, value: string) => void
}

interface NewTagState {
    tagName: string
    value: string
}

export default function BasicTab({
    form,
    loading,
    allCategories,
    mainImages,
    mainPrimaryIndex,
    tags,
    setMainImages,
    setMainPrimaryIndex,
    setTags,
    handleNumberChange
}: BasicTabProps) {
    const [newTag, setNewTag] = useState<NewTagState>({ tagName: "", value: "" })

    // Main image handling
    const handleMainImageSelect = useCallback(
        (files: File[]) => {
            setMainImages((prev) => [...prev, ...files])
        },
        [setMainImages]
    )

    const handleMainImageRemove = useCallback(
        (index: number) => {
            setMainImages((prev) => prev.filter((_, i) => i !== index))
            setMainPrimaryIndex((prevPrimary) => (index === prevPrimary ? 0 : prevPrimary > index ? prevPrimary - 1 : prevPrimary))
        },
        [setMainImages, setMainPrimaryIndex]
    )

    const handleMainSetPrimaryImage = useCallback(
        (index: number) => {
            setMainPrimaryIndex(index)
        },
        [setMainPrimaryIndex]
    )

    // Tag management
    const addTag = useCallback(() => {
        const trimmedTagName = newTag.tagName.trim()
        const trimmedValue = newTag.value.trim()

        if (!trimmedTagName || loading) return

        // Check if tag with same name already exists (case-insensitive)
        const tagExists = tags.some((tag) => tag.tagName.toLowerCase() === trimmedTagName.toLowerCase())

        if (tagExists) return

        const newTagObj = {
            tagName: trimmedTagName,
            value: trimmedValue
        }

        setTags((prev) => [...prev, newTagObj])
        setNewTag({ tagName: "", value: "" })

        // Update form state — cast to the expected tags type
        const currentTags = (form.getValues("tags") as { tagName: string; value: string }[]) || []
        form.setValue("tags", [...currentTags, newTagObj])
    }, [newTag, tags, setTags, form, loading])

    const removeTag = useCallback(
        (index: number) => {
            if (loading) return

            setTags((prev) => prev.filter((_, i) => i !== index))

            // Update form state (use the external `tags` prop to compute updated array)
            const updatedTags = tags.filter((_, i) => i !== index)
            form.setValue("tags", updatedTags)
        },
        [tags, setTags, form, loading]
    )

    const handleTagInputChange = useCallback((field: keyof NewTagState, value: string) => {
        setNewTag((prev) => ({
            ...prev,
            [field]: value
        }))
    }, [])

    const handleTagKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault()
                addTag()
            }
        },
        [addTag]
    )

    // Safe watch for category (string | undefined)
    const watchedCategory = form.watch("category") as string | undefined

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Product Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input id="name" {...form.register("name", { required: "Product name is required" })} placeholder="Enter product name" disabled={loading} />
                            {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={String(watchedCategory ?? "")} onValueChange={(value: string) => form.setValue("category", value)} disabled={loading}>
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
                                <Input id="brand" {...form.register("brand")} placeholder="Enter brand name" disabled={loading} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU</Label>
                                <Input id="sku" {...form.register("sku")} placeholder="Enter product SKU" disabled={loading} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="GST">GST</Label>
                                <Input id="GST" {...form.register("GST")} placeholder="Enter GST %" disabled={loading} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="HSNCode">HSN Code</Label>
                                <Input id="HSNCode" {...form.register("HSNCode")} placeholder="Enter product HSN code" disabled={loading} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <RichTextEditor
                                label="Description"
                                value={form.watch("description") || ""}
                                onChange={(value) => form.setValue("description", value)}
                                placeholder="Describe your product in detail..."
                                disabled={loading}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
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
                        />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Tags
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tagName">Tag Name</Label>
                            <Input
                                id="tagName"
                                value={newTag.tagName}
                                onChange={(e) => handleTagInputChange("tagName", e.target.value)}
                                placeholder="Enter tag name"
                                disabled={loading}
                                onKeyDown={handleTagKeyDown}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tagValue">Tag Value</Label>
                            <Input
                                id="tagValue"
                                value={newTag.value}
                                onChange={(e) => handleTagInputChange("value", e.target.value)}
                                placeholder="Enter tag value"
                                disabled={loading}
                                onKeyDown={handleTagKeyDown}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button type="button" onClick={addTag} variant="outline" disabled={loading || !newTag.tagName.trim()} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Tag
                        </Button>
                    </div>

                    {tags.length > 0 && (
                        <div className="space-y-2">
                            <Label>Added Tags ({tags.length})</Label>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <Badge
                                        onClick={() => removeTag(index)}
                                        key={`${tag.tagName}-${index}`}
                                        variant="secondary"
                                        className="cursor-pointer flex items-center gap-1"
                                    >
                                        {tag.tagName}: {tag.value}
                                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(index)} />
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
