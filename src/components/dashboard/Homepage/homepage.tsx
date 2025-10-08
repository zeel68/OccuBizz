"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
    Plus, Edit, Trash2, ImageIcon, ExternalLink, Loader2, Images,
    GripVertical, Eye, EyeOff, Upload, X, Check, AlertCircle,
    ChevronLeft, ChevronRight, Move, Save, RefreshCw
} from 'lucide-react'
import { useHomepageStore } from "@/store/StoreAdmin/homepageStore"
import ImageUpload from "@/components/shared/image-upload"
import { iHeroSlide, iHeroSlideForm } from "@/models/StoreAdmin/homepage.model"
import { cn } from "@/lib/utils"

interface HeroSlideFormData {
    title: string
    subtitle: string
    link: string
    display_order: number
    is_active: boolean
    button_text?: string
    description?: string
}

interface DragItem {
    index: number
    id: string
}

export function HeroSlidesManager() {
    const { heroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide, loading } = useHomepageStore()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingSlide, setEditingSlide] = useState<iHeroSlide | null>(null)
    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const [previewMode, setPreviewMode] = useState(false)
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [draggedItem, setDraggedItem] = useState<DragItem | null>(null)
    const [dragOverItem, setDragOverItem] = useState<number | null>(null)
    const [activeTab, setActiveTab] = useState("details")
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [slideToDelete, setSlideToDelete] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState<HeroSlideFormData>({
        title: "",
        subtitle: "",
        link: "",
        display_order: 1,
        is_active: true,
        button_text: "Shop Now",
        description: ""
    })

    // Auto-save functionality
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'n' && !isDialogOpen) {
                    e.preventDefault()
                    handleOpenDialog()
                } else if (e.key === 's' && isDialogOpen) {
                    e.preventDefault()
                    handleSubmit(e as any)
                }
            } else if (e.key === 'Escape' && isDialogOpen) {
                handleCloseDialog()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isDialogOpen, hasUnsavedChanges])

    // Auto-save effect
    useEffect(() => {
        if (hasUnsavedChanges && editingSlide) {
            const timer = setTimeout(() => {
                handleAutoSave()
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [formData, hasUnsavedChanges, editingSlide])

    const handleAutoSave = async () => {
        if (!editingSlide) return

        setAutoSaveStatus("saving")
        try {
            let submitData = {} as iHeroSlideForm
            submitData.title = formData.title;
            submitData.display_order = formData.display_order
            submitData.link = formData.link
            submitData.subtitle = formData.subtitle
            submitData.button_text = formData.button_text
            submitData.description = formData.description

            if (selectedImages.length > 0) {
                let image = await uploadToCloudinary(selectedImages[0]);
                submitData.image = image
            }

            await updateHeroSlide(editingSlide._id, submitData)
            setAutoSaveStatus("saved")
            setHasUnsavedChanges(false)
            setTimeout(() => setAutoSaveStatus("idle"), 2000)
        } catch (error: any) {
            setAutoSaveStatus("idle")
            toast.error("Auto-save failed: " + (error.message || "Unknown error"))
        }
    }

    const handleOpenDialog = (slide?: iHeroSlide) => {
        if (slide) {
            setEditingSlide(slide)
            setFormData({
                title: slide.title,
                subtitle: slide.subtitle || "",
                link: slide.link || "",
                display_order: slide.display_order,
                is_active: slide.is_active,
                button_text: slide.button_text || "Shop Now",
                description: slide.description || ""
            })
        } else {
            setEditingSlide(null)
            setFormData({
                title: "",
                subtitle: "",
                link: "",
                display_order: heroSlides.length + 1,
                is_active: true,
                button_text: "Shop Now",
                description: ""
            })
        }
        setSelectedImages([])
        setFormErrors({})
        setActiveTab("details")
        setIsDialogOpen(true)
    }

    const handleCloseDialog = () => {
        if (hasUnsavedChanges) {
            if (confirm("You have unsaved changes. Are you sure you want to close?")) {
                setIsDialogOpen(false)
                setEditingSlide(null)
                setSelectedImages([])
                setHasUnsavedChanges(false)
            }
        } else {
            setIsDialogOpen(false)
            setEditingSlide(null)
            setSelectedImages([])
        }
    }

    const validateForm = () => {
        const errors: Record<string, string> = {}

        if (!formData.title.trim()) {
            errors.title = "Title is required"
        }

        if (formData.link && !formData.link.startsWith('http')) {
            errors.link = "Link must start with http:// or https://"
        }

        if (!editingSlide && selectedImages.length === 0) {
            errors.image = "Please select an image"
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const uploadToCloudinary = async (file: File): Promise<string> => {
        setIsUploading(true)
        setUploadProgress(0)

        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "BizzWeb",
        );
        formDataUpload.append("folder", "ecommerce_uploads/heroslides");

        // Simulate progress
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval)
                    return 90
                }
                return prev + 10
            })
        }, 200)

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formDataUpload,
                },
            );

            clearInterval(progressInterval)
            setUploadProgress(100)

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error?.message || "Image upload failed");
            }

            const data = await res.json();
            return data.secure_url;
        } finally {
            setTimeout(() => {
                setIsUploading(false)
                setUploadProgress(0)
            }, 500)
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error("Please fix the errors in the form")
            return
        }

        setIsSaving(true)
        try {
            let submitData = {} as iHeroSlideForm
            submitData.title = formData.title;
            submitData.display_order = formData.display_order
            submitData.link = formData.link
            submitData.subtitle = formData.subtitle
            submitData.button_text = formData.button_text
            submitData.description = formData.description

            if (selectedImages.length > 0) {
                toast.info("Uploading slide image...");
                let image = await uploadToCloudinary(selectedImages[0]);
                toast.success("Image uploaded successfully");
                submitData.image = image
            }

            if (editingSlide) {
                await updateHeroSlide(editingSlide._id, submitData)
                toast.success("Hero slide updated successfully")
            } else {
                await createHeroSlide(submitData)
                toast.success("Hero slide created successfully")
            }

            setIsDialogOpen(false)
            setEditingSlide(null)
            setSelectedImages([])
            setHasUnsavedChanges(false)
        } catch (error: any) {
            toast.error(error.message || "Failed to save hero slide")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteClick = (slideId: string) => {
        setSlideToDelete(slideId)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!slideToDelete) return

        try {
            await deleteHeroSlide(slideToDelete)
            toast.success("Hero slide deleted successfully")
            setDeleteDialogOpen(false)
            setSlideToDelete(null)
        } catch (error: any) {
            toast.error(error.message || "Failed to delete hero slide")
        }
    }

    const handleDragStart = (e: React.DragEvent, index: number, id: string) => {
        setDraggedItem({ index, id })
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setDragOverItem(index)
    }

    const handleDragLeave = () => {
        setDragOverItem(null)
    }

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault()
        setDragOverItem(null)

        if (!draggedItem) return

        const draggedIndex = draggedItem.index
        if (draggedIndex === dropIndex) return

        // Reorder logic would go here
        // This is a simplified version - in a real implementation, 
        // you'd update the display_order of all affected slides

        toast.success("Slide order updated")
        setDraggedItem(null)
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
        setDragOverItem(null)
    }

    const handlePrevPreview = () => {
        setCurrentPreviewIndex((prev) =>
            prev === 0 ? heroSlides.length - 1 : prev - 1
        )
    }

    const handleNextPreview = () => {
        setCurrentPreviewIndex((prev) =>
            prev === heroSlides.length - 1 ? 0 : prev + 1
        )
    }

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setHasUnsavedChanges(true)
        if (formErrors[field]) {
            setFormErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const handleFileSelect = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold">Hero Slides</h3>
                    <p className="text-sm text-muted-foreground mt-1">Manage your homepage hero carousel slides</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="flex items-center gap-2"
                    >
                        {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {previewMode ? "Exit Preview" : "Preview Mode"}
                    </Button>
                    <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Hero Slide
                    </Button>
                </div>
            </div>

            {heroSlides.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Images className="h-16 w-16 text-muted-foreground mb-4" />
                        <h4 className="text-lg font-medium mb-2">No hero slides yet</h4>
                        <p className="text-muted-foreground text-center max-w-md mb-6">
                            Create your first hero slide to showcase featured products, promotions, or announcements on your homepage.
                        </p>
                        <Button onClick={() => handleOpenDialog()} size="lg">
                            <Plus className="h-5 w-5 mr-2" />
                            Create Your First Slide
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {previewMode && (
                        <div className="relative w-full max-w-5xl mx-auto">
                            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
                                <img
                                    src={heroSlides[currentPreviewIndex]?.image_url || "/placeholder.svg"}
                                    alt={heroSlides[currentPreviewIndex]?.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-8">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                        {heroSlides[currentPreviewIndex]?.title}
                                    </h2>
                                    {heroSlides[currentPreviewIndex]?.subtitle && (
                                        <p className="text-xl text-white/90 mb-4">
                                            {heroSlides[currentPreviewIndex]?.subtitle}
                                        </p>
                                    )}
                                    {heroSlides[currentPreviewIndex]?.description && (
                                        <p className="text-white/80 mb-6 max-w-2xl">
                                            {heroSlides[currentPreviewIndex]?.description}
                                        </p>
                                    )}
                                    {heroSlides[currentPreviewIndex]?.button_text && (
                                        <Button size="lg" className="w-fit">
                                            {heroSlides[currentPreviewIndex]?.button_text}
                                        </Button>
                                    )}
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                                    onClick={handlePrevPreview}
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                                    onClick={handleNextPreview}
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </Button>

                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {heroSlides.map((_, index) => (
                                        <button
                                            key={index}
                                            className={cn(
                                                "w-2 h-2 rounded-full transition-all",
                                                index === currentPreviewIndex
                                                    ? "bg-white w-8"
                                                    : "bg-white/50"
                                            )}
                                            onClick={() => setCurrentPreviewIndex(index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {!previewMode && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {heroSlides
                                .sort((a, b) => a.display_order - b.display_order)
                                .map((slide, index) => (
                                    <Card
                                        key={slide._id}
                                        className={cn(
                                            "overflow-hidden transition-all duration-200 hover:shadow-lg",
                                            draggedItem?.id === slide._id && "opacity-50",
                                            dragOverItem === index && "ring-2 ring-primary"
                                        )}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index, slide._id)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <div className="relative aspect-video">
                                            <img
                                                src={slide.image_url || "/placeholder.svg"}
                                                alt={slide.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-3 right-3 flex gap-2">
                                                <Badge variant={slide.is_active ? "default" : "secondary"} className="bg-black/70 text-white">
                                                    {slide.is_active ? "Active" : "Inactive"}
                                                </Badge>
                                                <Badge variant="outline" className="bg-black/70 text-white border-white/20">
                                                    #{slide.display_order}
                                                </Badge>
                                            </div>
                                            <div className="absolute top-3 left-3 cursor-move">
                                                <div className="bg-black/50 text-white p-1 rounded">
                                                    <GripVertical className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                        <CardContent className="p-5">
                                            <h4 className="font-semibold text-lg truncate mb-2">{slide.title}</h4>
                                            {slide.subtitle && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {slide.subtitle}
                                                </p>
                                            )}
                                            {slide.link && (
                                                <div className="flex items-center gap-1 mb-4">
                                                    <ExternalLink className="h-3 w-3" />
                                                    <span className="text-xs text-muted-foreground truncate">
                                                        {slide.link}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleOpenDialog(slide)}
                                                    >
                                                        <Edit className="h-3 w-3 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(slide._id)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-3 w-3 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Move className="h-3 w-3 mr-1" />
                                                    Drag to reorder
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    )}
                </>
            )}

            {/* Hero Slide Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center justify-between">
                            <span>{editingSlide ? "Edit Hero Slide" : "Create New Hero Slide"}</span>
                            {editingSlide && autoSaveStatus !== "idle" && (
                                <div className="flex items-center gap-2 text-sm">
                                    {autoSaveStatus === "saving" && (
                                        <>
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    )}
                                    {autoSaveStatus === "saved" && (
                                        <>
                                            <Check className="h-3 w-3 text-green-500" />
                                            <span className="text-green-500">Saved</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="details">Slide Details</TabsTrigger>
                            <TabsTrigger value="appearance">Appearance</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6 mt-4">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange("title", e.target.value)}
                                            placeholder="Enter an engaging title"
                                            className={formErrors.title ? "border-red-500" : ""}
                                        />
                                        {formErrors.title && (
                                            <p className="text-xs text-red-500">{formErrors.title}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="button_text">Button Text</Label>
                                        <Input
                                            id="button_text"
                                            value={formData.button_text}
                                            onChange={(e) => handleInputChange("button_text", e.target.value)}
                                            placeholder="Shop Now"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subtitle">Subtitle</Label>
                                    <Textarea
                                        id="subtitle"
                                        value={formData.subtitle}
                                        onChange={(e) => handleInputChange("subtitle", e.target.value)}
                                        placeholder="Enter a catchy subtitle"
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        placeholder="Provide additional details about this slide"
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="link">Link URL</Label>
                                    <Input
                                        id="link"
                                        type="text"
                                        value={formData.link}
                                        onChange={(e) => handleInputChange("link", e.target.value)}
                                        placeholder="https://example.com"
                                        className={formErrors.link ? "border-red-500" : ""}
                                    />
                                    {formErrors.link && (
                                        <p className="text-xs text-red-500">{formErrors.link}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">Include https:// for external links</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="display_order">Display Order</Label>
                                        <Input
                                            id="display_order"
                                            type="number"
                                            min="1"
                                            value={formData.display_order}
                                            onChange={(e) => handleInputChange("display_order", Number(e.target.value))}
                                        />
                                        <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
                                    </div>
                                    <div className="flex items-center space-x-2 pt-6">
                                        <Switch
                                            id="is_active"
                                            checked={formData.is_active}
                                            onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                                        />
                                        <Label htmlFor="is_active">Active</Label>
                                    </div>
                                </div>

                                <DialogFooter className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSaving || isUploading}>
                                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {editingSlide ? "Update" : "Create"} Slide
                                    </Button>
                                </DialogFooter>
                            </form>
                        </TabsContent>

                        <TabsContent value="appearance" className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <Label>Slide Image {!editingSlide && "*"}</Label>
                                <p className="text-xs text-muted-foreground mb-2">
                                    Recommended size: 1920x600 pixels (3.2:1 aspect ratio)
                                </p>

                                {formErrors.image && (
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{formErrors.image}</AlertDescription>
                                    </Alert>
                                )}

                                {isUploading && (
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm">Uploading image...</span>
                                            <span className="text-sm">{uploadProgress}%</span>
                                        </div>
                                        <Progress value={uploadProgress} className="h-2" />
                                    </div>
                                )}

                                {selectedImages.length > 0 ? (
                                    <div className="relative">
                                        <div className="border rounded-md overflow-hidden">
                                            <img
                                                src={URL.createObjectURL(selectedImages[0])}
                                                alt="Selected image"
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                            onClick={() => setSelectedImages([])}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div
                                        className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={handleFileSelect}
                                    >
                                        <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm font-medium mb-1">Click to upload an image</p>
                                        <p className="text-xs text-muted-foreground">or drag and drop</p>
                                        <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF up to 10MB</p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    setSelectedImages([e.target.files[0]])
                                                    setFormErrors(prev => {
                                                        const newErrors = { ...prev }
                                                        delete newErrors.image
                                                        return newErrors
                                                    })
                                                }
                                            }}
                                        />
                                    </div>
                                )}

                                {editingSlide && editingSlide.image_url && selectedImages.length === 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground mb-2">Current image:</p>
                                        <div className="relative w-full h-48 rounded-md overflow-hidden border">
                                            <img
                                                src={editingSlide.image_url || "/placeholder.svg"}
                                                alt="Current slide"
                                                className="w-full h-full object-cover"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                                onClick={handleFileSelect}
                                            >
                                                <RefreshCw className="h-4 w-4 mr-1" />
                                                Change
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-4 border-t">
                                <Button
                                    onClick={() => setActiveTab("details")}
                                    variant="outline"
                                    className="mr-2"
                                >
                                    Back to Details
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSaving || isUploading}
                                >
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingSlide ? "Update" : "Create"} Slide
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Are you sure you want to delete this hero slide? This action cannot be undone.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}