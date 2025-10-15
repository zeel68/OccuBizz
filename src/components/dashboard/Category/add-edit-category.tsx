"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Plus,
    X,
    Trash2,
    Loader2,
    ArrowLeft,
    Info,
    CheckCircle2,
    AlertCircle,
    Image as ImageIcon,
    Settings,
    Filter,
    Tag
} from "lucide-react";

import ImageUpload from "@/components/shared/image-upload";
import { useCategoryStore } from "@/store/StoreAdmin/categoryStore";
import { toast } from "sonner";
import { iFilterOption, iAttributeOption, iCategoryFormData } from "@/models/StoreAdmin/category.model";

interface AddEditCategoryPageProps {
    categoryId?: string;
}

export default function AddEditCategoryPage({ categoryId }: AddEditCategoryPageProps) {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);

    const {
        createCategory,
        updateCategory,
        allCategories,
        fetchAllCategories,
        loading,
        error
    } = useCategoryStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [newFilterOption, setNewFilterOption] = useState("");
    const [activeTab, setActiveTab] = useState("basic");
    const [imageUploading, setImageUploading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const [newFilter, setNewFilter] = useState<iFilterOption>({
        name: "",
        type: "text",
        options: [],
        is_required: false,
        default_value: null
    });

    const [newAttribute, setNewAttribute] = useState<iAttributeOption>({
        name: "",
        type: "text",
        is_required: false,
        default_value: "",
    });

    const [formData, setFormData] = useState<iCategoryFormData>({
        name: "",
        display_name: "",
        slug: "",
        description: "",
        parent_id: "",
        sort_order: 1,
        is_active: true,
        is_primary: false,
        image_url: "",
        filters: [],
        attributes: [],
    });

    // Memoize filtered categories to prevent unnecessary recalculations
    const filteredCategories = useMemo(() => {
        return allCategories.filter((category) => category._id !== categoryId);
    }, [allCategories, categoryId]);

    // Initialize data on component mount
    useEffect(() => {
        const initializeData = async () => {
            try {
                await fetchAllCategories();
                setIsInitialized(true);
            } catch (error) {
                toast.error("Failed to load categories");
            }
        };

        initializeData();
    }, [fetchAllCategories]);

    // Populate form data when editing a category
    useEffect(() => {
        if (!isInitialized || !categoryId) return;

        const category = allCategories.find(cat => cat._id === categoryId);
        if (category) {
            setFormData({
                name: category.display_name || "",
                display_name: category.display_name || "",
                slug: category.slug || "",
                description: category.description || "",
                parent_id: category.parent_id || "",
                sort_order: category.sort_order || 1,
                is_active: category.is_active !== false,
                is_primary: category.is_primary || false,
                image_url: category.image_url || category.img_url || "",
                filters: (category.config?.filters || []).map((f: any) => ({
                    ...f,
                    options: f.options ? [...f.options] : []
                })),
                attributes: category.config?.attributes || [],
            });
        }
    }, [categoryId, allCategories, isInitialized]);

    // Generate slug from display name with proper sanitization
    const generateSlug = useCallback((displayName: string) => {
        return displayName
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
    }, []);

    // Optimized image upload function
    const uploadToCloudinary = useCallback(async (file: File): Promise<string> => {
        setImageUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);
            formDataUpload.append(
                "upload_preset",
                process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "BizzPocket",
            );
            formDataUpload.append("folder", "ecommerce_uploads/categories");

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formDataUpload,
                },
            );

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error?.message || "Image upload failed");
            }

            const data = await res.json();
            return data.secure_url;
        } catch (error) {
            toast.error("Image upload failed");
            throw error;
        } finally {
            setImageUploading(false);
        }
    }, []);

    // Handle form submission with optimized error handling
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.display_name.trim()) {
            toast.error("Category display name is required");
            return;
        }

        setIsSubmitting(true);

        try {
            let uploadedImageUrl = formData.image_url;

            // Upload image if selected
            if (selectedImages.length > 0) {
                toast.info("Uploading category image...");
                uploadedImageUrl = await uploadToCloudinary(selectedImages[0]);
                toast.success("Image uploaded successfully");
            }

            const categoryData = {
                display_name: formData.display_name.toLowerCase(),
                slug: formData.slug || generateSlug(formData.display_name),
                description: formData.description,
                parent_id: formData.parent_id || null,
                sort_order: Number(formData.sort_order),
                is_active: formData.is_active,
                is_primary: formData.is_primary,
                img_url: uploadedImageUrl,
                image_url: uploadedImageUrl,
                config: {
                    filters: formData.filters,
                    attributes: formData.attributes,
                },
            };

            if (categoryId) {
                await updateCategory(categoryId, categoryData as any);
                toast.success("Category updated successfully");
            } else {
                await createCategory(categoryData as any);
                toast.success("Category created successfully");
            }

            router.push("/categories");
            router.refresh();

        } catch (error: any) {
            toast.error(
                error.message ||
                (categoryId
                    ? "Failed to update category"
                    : "Failed to create category"),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter management functions
    const handleAddFilterOption = useCallback(() => {
        if (
            newFilterOption.trim() &&
            !newFilter.options.includes(newFilterOption.trim())
        ) {
            setNewFilter((prev) => ({
                ...prev,
                options: [...prev.options, newFilterOption.trim()],
            }));
            setNewFilterOption("");
        }
    }, [newFilterOption, newFilter.options]);

    const handleRemoveFilterOption = useCallback((option: string) => {
        setNewFilter((prev) => ({
            ...prev,
            options: prev.options.filter((o) => o !== option),
        }));
    }, []);

    const handleAddFilter = useCallback(() => {
        if (newFilter.name.trim()) {
            setFormData((prev) => ({
                ...prev,
                filters: [...prev.filters, { ...newFilter }],
            }));
            setNewFilter({
                name: "",
                type: "text",
                options: [],
                is_required: false,
                default_value: null
            });
            toast.success("Filter added successfully");
        }
    }, [newFilter]);

    const handleRemoveFilter = useCallback((index: number) => {
        setFormData((prev) => ({
            ...prev,
            filters: prev.filters.filter((_, i) => i !== index),
        }));
        toast.info("Filter removed");
    }, []);

    // Attribute management functions
    const handleAddAttribute = useCallback(() => {
        if (newAttribute.name.trim()) {
            setFormData((prev: any) => ({
                ...prev,
                attributes: [...prev.attributes, { ...newAttribute }],
            }));
            setNewAttribute({
                name: "",
                type: "text",
                is_required: false,
                default_value: "",
            });
            toast.success("Attribute added successfully");
        }
    }, [newAttribute]);

    const handleRemoveAttribute = useCallback((index: number) => {
        setFormData((prev) => ({
            ...prev,
            attributes: prev.attributes.filter((_, i) => i !== index),
        }));
        toast.info("Attribute removed");
    }, []);

    // Image management functions
    const handleImageSelect = useCallback((files: File[]) => {
        setSelectedImages(files.slice(0, 1)); // Only allow one image for categories
    }, []);

    const handleImageRemove = useCallback(() => {
        setSelectedImages([]);
        setFormData((prev) => ({ ...prev, image_url: "" }));
    }, []);

    // Display loading state while initializing
    if (!isInitialized) {
        return (
            <div className="container mx-auto py-6 flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <span>Loading categories...</span>
            </div>
        );
    }

    // Display error state if API call failed
    if (error) {
        return (
            <div className="container mx-auto py-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load categories. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {categoryId ? "Edit Category" : "Create New Category"}
                    </h1>
                </div>
                <Button
                    onClick={() => formRef.current?.requestSubmit()}
                    disabled={isSubmitting || loading}
                    size="lg"
                    className="min-w-[180px]"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {categoryId ? "Updating..." : "Creating..."}
                        </>
                    ) : categoryId ? "Update Category" : "Create Category"}
                </Button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="basic" className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Basic Info
                        </TabsTrigger>
                        <TabsTrigger value="filters" className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                        </TabsTrigger>
                        <TabsTrigger value="attributes" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Attributes
                        </TabsTrigger>
                    </TabsList>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main content */}
                        <div className="lg:col-span-2 space-y-6">
                            <TabsContent value="basic" className="m-0 space-y-6">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-xl">Basic Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="display_name">
                                                    Display Name <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="display_name"
                                                    value={formData.display_name}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            display_name: e.target.value,
                                                            slug: e.target.value ? generateSlug(e.target.value) : formData.slug,
                                                        }))
                                                    }
                                                    placeholder="Enter display name"
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="slug">Slug</Label>
                                                <Input
                                                    id="slug"
                                                    value={formData.slug}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            slug: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="Auto-generated from display name"
                                                    disabled={loading}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    URL-friendly identifier for the category
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        description: e.target.value,
                                                    }))
                                                }
                                                placeholder="Enter category description"
                                                rows={3}
                                                disabled={loading}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="parent_id">Parent Category</Label>
                                                <Select
                                                    value={formData.parent_id || "none"}
                                                    onValueChange={(value) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            parent_id: value === "none" ? "" : value,
                                                        }))
                                                    }
                                                    disabled={loading}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select parent category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">
                                                            No Parent (Root Category)
                                                        </SelectItem>
                                                        {filteredCategories.map((cat) => (
                                                            <SelectItem key={cat._id} value={cat._id}>
                                                                {cat.display_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="sort_order">Sort Order</Label>
                                                <Input
                                                    id="sort_order"
                                                    type="number"
                                                    min="1"
                                                    value={formData.sort_order}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            sort_order: Number(e.target.value),
                                                        }))
                                                    }
                                                    placeholder="1"
                                                    disabled={loading}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Lower numbers appear first
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>Category Image</Label>
                                                {imageUploading && (
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                        Uploading...
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <ImageUpload
                                                    value={selectedImages}
                                                    onSelectFiles={handleImageSelect}
                                                    onRemove={handleImageRemove}
                                                    disabled={isSubmitting || loading}
                                                    multiple={false}
                                                    showPreview={true}
                                                    showLocalPreview={true}
                                                />
                                                {formData.image_url && selectedImages.length === 0 && (
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-xs text-muted-foreground">
                                                            Current image:
                                                        </p>
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={formData.image_url}
                                                                alt="Current category image"
                                                                className="h-16 w-16 rounded object-cover border"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={handleImageRemove}
                                                                disabled={loading}
                                                            >
                                                                Remove Image
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="filters" className="m-0">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-xl">Category Filters</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Add filters to help customers narrow down products in this category
                                        </p>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {formData.filters.length > 0 ? (
                                            <ScrollArea className="h-[300px] pr-4">
                                                <div className="space-y-3">
                                                    {formData.filters.map((filter, index) => (
                                                        <div key={index} className="border rounded-lg p-4 bg-muted/5">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="font-medium">{filter.name}</h4>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="outline">{filter.type}</Badge>
                                                                    {filter.is_required && (
                                                                        <Badge variant="secondary">Required</Badge>
                                                                    )}
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        onClick={() => handleRemoveFilter(index)}
                                                                        disabled={loading}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            {filter.options.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-2">
                                                                    {filter.options.map((option, optIndex) => (
                                                                        <Badge
                                                                            key={optIndex}
                                                                            variant="outline"
                                                                            className="text-xs"
                                                                        >
                                                                            {option}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        ) : (
                                            <div className="text-center py-8 border rounded-lg bg-muted/10">
                                                <Filter className="h-10 w-10 mx-auto text-muted-foreground" />
                                                <p className="text-muted-foreground mt-2">
                                                    No filters added yet
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Add filters to help customers narrow down products in this category
                                                </p>
                                            </div>
                                        )}

                                        <Separator className="my-6" />

                                        <div className="space-y-4 border rounded-lg p-4 bg-muted/5">
                                            <h4 className="font-medium">Add New Filter</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Filter Name</Label>
                                                    <Input
                                                        value={newFilter.name}
                                                        onChange={(e) =>
                                                            setNewFilter((prev) => ({
                                                                ...prev,
                                                                name: e.target.value,
                                                            }))
                                                        }
                                                        placeholder="e.g., Color, Size"
                                                        disabled={loading}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Filter Type</Label>
                                                    <Select
                                                        value={newFilter.type}
                                                        onValueChange={(value) =>
                                                            setNewFilter((prev) => ({
                                                                ...prev,
                                                                type: value as iFilterOption["type"]
                                                            }))
                                                        }
                                                        disabled={loading}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="text">Text</SelectItem>
                                                            <SelectItem value="select">Select</SelectItem>
                                                            <SelectItem value="multiselect">
                                                                Multi-Select
                                                            </SelectItem>
                                                            <SelectItem value="range">Range</SelectItem>
                                                            <SelectItem value="boolean">Boolean</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {(newFilter.type === "select" ||
                                                newFilter.type === "multiselect") && (
                                                    <div className="space-y-2">
                                                        <Label>Filter Options</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                value={newFilterOption}
                                                                onChange={(e) =>
                                                                    setNewFilterOption(e.target.value)
                                                                }
                                                                placeholder="Add option"
                                                                onKeyDown={(e) =>
                                                                    e.key === "Enter" &&
                                                                    (e.preventDefault(), handleAddFilterOption())
                                                                }
                                                                disabled={loading}
                                                            />
                                                            <Button
                                                                type="button"
                                                                size="icon"
                                                                onClick={handleAddFilterOption}
                                                                disabled={loading || !newFilterOption.trim()}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        {newFilter.options.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                {newFilter.options.map((option, index) => (
                                                                    <Badge
                                                                        key={index}
                                                                        variant="secondary"
                                                                        className="cursor-pointer px-2 py-1 flex items-center gap-1"
                                                                        onClick={() => handleRemoveFilterOption(option)}
                                                                    >
                                                                        <span className="max-w-[100px] truncate">
                                                                            {option}
                                                                        </span>
                                                                        <X
                                                                            className="h-3 w-3"
                                                                        />
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={newFilter.is_required}
                                                        onCheckedChange={(checked) =>
                                                            setNewFilter((prev) => ({
                                                                ...prev,
                                                                is_required: checked,
                                                            }))
                                                        }
                                                        disabled={loading}
                                                    />
                                                    <Label>Required Filter</Label>
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={handleAddFilter}
                                                    disabled={!newFilter.name.trim() || loading}
                                                >
                                                    Add Filter
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="attributes" className="m-0">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-xl">Category Attributes</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Add attributes to define product characteristics in this category
                                        </p>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {formData.attributes.length > 0 ? (
                                            <ScrollArea className="h-[300px] pr-4">
                                                <div className="space-y-3">
                                                    {formData.attributes.map((attr, index) => (
                                                        <div key={index} className="border rounded-lg p-4 bg-muted/5">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="font-medium">{attr.name}</h4>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="outline">{attr.type}</Badge>
                                                                    {attr.is_required && (
                                                                        <Badge variant="secondary">Required</Badge>
                                                                    )}
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        onClick={() => handleRemoveAttribute(index)}
                                                                        disabled={loading}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            {attr.default_value && (
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    Default: {attr.default_value}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        ) : (
                                            <div className="text-center py-8 border rounded-lg bg-muted/10">
                                                <Settings className="h-10 w-10 mx-auto text-muted-foreground" />
                                                <p className="text-muted-foreground mt-2">
                                                    No attributes added yet
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Add attributes to define product characteristics in this category
                                                </p>
                                            </div>
                                        )}

                                        <Separator className="my-6" />

                                        <div className="space-y-4 border rounded-lg p-4 bg-muted/5">
                                            <h4 className="font-medium">Add New Attribute</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Attribute Name</Label>
                                                    <Input
                                                        value={newAttribute.name}
                                                        onChange={(e) =>
                                                            setNewAttribute((prev) => ({
                                                                ...prev,
                                                                name: e.target.value,
                                                            }))
                                                        }
                                                        placeholder="e.g., Material, Weight"
                                                        disabled={loading}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Attribute Type</Label>
                                                    <Select
                                                        value={newAttribute.type}
                                                        onValueChange={(value) =>
                                                            setNewAttribute((prev) => ({
                                                                ...prev,
                                                                type: value as iAttributeOption["type"]
                                                            }))
                                                        }
                                                        disabled={loading}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="text">Text</SelectItem>
                                                            <SelectItem value="number">Number</SelectItem>
                                                            <SelectItem value="boolean">Boolean</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Default Value (Optional)</Label>
                                                <Input
                                                    value={newAttribute.default_value}
                                                    onChange={(e) =>
                                                        setNewAttribute((prev) => ({
                                                            ...prev,
                                                            default_value: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="Enter default value"
                                                    disabled={loading}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={newAttribute.is_required}
                                                        onCheckedChange={(checked) =>
                                                            setNewAttribute((prev) => ({
                                                                ...prev,
                                                                is_required: checked,
                                                            }))
                                                        }
                                                        disabled={loading}
                                                    />
                                                    <Label>Required Attribute</Label>
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={handleAddAttribute}
                                                    disabled={!newAttribute.name.trim() || loading}
                                                >
                                                    Add Attribute
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="is_active">Active Status</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Make this category visible to customers
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_active"
                                            checked={formData.is_active}
                                            onCheckedChange={(checked) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    is_active: checked,
                                                }))
                                            }
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="is_primary">Primary Category</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Mark as a main category
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_primary"
                                            checked={formData.is_primary}
                                            onCheckedChange={(checked) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    is_primary: checked,
                                                }))
                                            }
                                            disabled={loading}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {formData.parent_id && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Parent Category</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">
                                                {allCategories.find((c: any) => c._id === formData.parent_id)?.display_name}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </Tabs>
            </form>
        </div>
    );
}