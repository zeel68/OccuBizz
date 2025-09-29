// add-edit-product.tsx
"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Loader2, Save, Info, Tag, DollarSign, BarChart3, Truck, Search, Settings } from 'lucide-react'

// Store hooks
import { useProductStore } from "@/store/StoreAdmin/productStore"
import { useCategoryStore } from "@/store/StoreAdmin/categoryStore"

// Tab components


// Types
import { ProductFormData, ProductVariant, Specification, CategoryFilter } from "@/types/product.types"
import { AlertTriangle } from "lucide-react"
import { ColorVariantsTab } from "./tabs/colors-tab"
import { PricingTab } from "./tabs/pricing-tab"
import { InventoryTab } from "./tabs/inventory-tab"
import { ShippingTab } from "./tabs/shipping-tab"
import { SEOTab } from "./tabs/seo-tab"
import { AdvancedTab } from "./tabs/advance-tab"
import { BasicTab } from "./tabs/basic-tab"
import { iTag } from "@/models/StoreAdmin/product.model"

// Utility functions
const generateUUID = () => crypto.randomUUID()

const normalizeFilters = (raw: any): CategoryFilter[] => {
    if (!raw) return []
    if (Array.isArray(raw)) {
        return raw.map(item => ({
            name: item?.name || item?.key || "",
            type: item?.type || "text",
            options: Array.isArray(item?.options) ? item.options : [],
            is_required: !!item?.is_required
        }))
    }
    if (typeof raw === "object") {
        return Object.entries(raw).map(([key, val]) => ({
            name: (val as any)?.name || key,
            type: (val as any)?.type || "text",
            options: Array.isArray((val as any)?.options) ? (val as any).options : [],
            is_required: !!(val as any)?.is_required
        }))
    }
    return []
}

interface AddEditProductPageProps {
    id?: string;
}

export default function AddEditProductPage({ id }: AddEditProductPageProps) {
    const router = useRouter()
    const { updateProduct, createProduct, fetchProductById, selectedProduct, error } = useProductStore()
    const { allCategories, fetchAllCategories } = useCategoryStore()

    // Form and loading states
    const [loading, setLoading] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<string>("basic")
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})

    // Shared states
    const [tags, setTags] = useState<iTag[]>([])
    const [specifications, setSpecifications] = useState<Specification[]>([])
    const [seoKeywords, setSeoKeywords] = useState<string[]>([])
    const [mainImages, setMainImages] = useState<(File | string)[]>([])
    const [mainPrimaryIndex, setMainPrimaryIndex] = useState<number>(0)
    const [colorVariants, setColorVariants] = useState<ProductVariant[]>([])
    const [sizeOptions, setSizeOptions] = useState<string[]>(["XS", "S", "M", "L", "XL", "XXL"])

    const form = useForm<ProductFormData>({
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            compare_price: undefined,
            cost_price: undefined,
            category: "",
            brand: "",
            sku: "",
            GST: "",
            HSNCode: "",
            stock: {
                quantity: 0,
                track_inventory: true,
                low_stock_threshold: 10,
                allow_backorder: false,
            },
            specifications: {},
            tags: [],
            seo: {
                title: "",
                description: "",
                keywords: [],
            },
            shipping: {
                weight: undefined,
                dimensions: {
                    length: undefined,
                    width: undefined,
                    height: undefined,
                },
            },
            variants: [],
            is_active: true,
            is_featured: false,
            visibility: "public",
            images: [],
        },
    })

    const selectedCategoryId = form.watch("category")
    const selectedCategory = useMemo(() =>
        allCategories.find(cat => cat._id === selectedCategoryId),
        [allCategories, selectedCategoryId]
    )

    const categoryAttributes = useMemo(() =>
        normalizeFilters(selectedCategory?.config?.attributes),
        [selectedCategory]
    )

    // Data fetching effects
    useEffect(() => {
        const loadData = async () => {
            try {
                if (allCategories.length === 0) {
                    await fetchAllCategories()
                }
                if (id) {
                    await fetchProductById(id)
                }
            } catch (err) {
                console.error("Error loading data:", err)
                toast.error("Failed to load product data")
            }
        }
        loadData()
    }, [id, fetchProductById, fetchAllCategories])

    // Populate form with existing product data
    useEffect(() => {
        if (selectedProduct && id) {
            const productData: ProductFormData = {
                ...selectedProduct,
                price: selectedProduct.price || 0,
                compare_price: selectedProduct.compare_price ?? undefined,
                cost_price: selectedProduct.cost_price ?? undefined,
                stock: {
                    quantity: selectedProduct.stock?.quantity || 0,
                    track_inventory: selectedProduct.stock?.track_inventory ?? true,
                    low_stock_threshold: selectedProduct.stock?.low_stock_threshold || 10,
                    allow_backorder: selectedProduct.stock?.allow_backorder ?? false
                },
                shipping: {
                    weight: selectedProduct.shipping?.weight ?? undefined,
                    dimensions: {
                        length: selectedProduct.shipping?.dimensions?.length ?? undefined,
                        width: selectedProduct.shipping?.dimensions?.width ?? undefined,
                        height: selectedProduct.shipping?.dimensions?.height ?? undefined
                    }
                },
                variants: selectedProduct.variants || []
            } as any

            form.reset(productData)
            setTags(selectedProduct.tags || [])
            setSeoKeywords(selectedProduct.seo?.keywords || [])

            const specs = Object.entries(selectedProduct.specifications || {}).map(([key, value]) =>
                ({ key, value: value as string })
            )
            setSpecifications(specs)

            setMainImages(selectedProduct.images || [])
            setMainPrimaryIndex(selectedProduct.primaryImageIndex || 0)

            const variantsWithIds = (selectedProduct.variants || []).map(v => ({
                ...v,
                id: v.id || generateUUID(),
                images: v.images || [],
                primaryIndex: v.primaryIndex || 0,
                sizes: (v.sizes || []).map(s => ({
                    ...s,
                    id: s.id || generateUUID(),
                    stock: Number(s.stock) || 0,
                    priceModifier: Number(s.priceModifier) || 0,
                    attributes: s.attributes || {}
                }))
            }))
            setColorVariants(variantsWithIds)
        }
    }, [selectedProduct, id, form])

    // Validation helper
    const validateForm = useCallback(() => {
        const errors: Record<string, string> = {}
        const values = form.getValues()

        if (!values.name?.trim()) errors.name = "Product name is required"
        if (values.price <= 0) errors.price = "Valid price is required"
        if (values.compare_price && values.compare_price <= values.price) {
            errors.compare_price = "Compare price should be higher than selling price"
        }

        // Validate required attributes
        colorVariants.forEach(variant => {
            variant.sizes.forEach(size => {
                categoryAttributes.forEach(attr => {
                    if (attr.is_required) {
                        const value = size.attributes[attr.name]
                        if (!value || (Array.isArray(value) && value.length === 0)) {
                            errors[`${variant.id}-${size.id}-${attr.name}`] = `${attr.name} is required`
                        }
                    }
                })
            })
        })

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }, [form, colorVariants, categoryAttributes])

    // Cloudinary upload with better error handling
    const uploadMultipleToCloudinary = async (files: (File | string)[]) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "BizzWeb"

        if (!cloudName || !uploadPreset) {
            throw new Error("Missing Cloudinary configuration")
        }

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

        const uploadPromises = files.map(async (file) => {
            if (typeof file === "string") return file

            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error(`File ${file.name} is not an image`)
            }

            const formData = new FormData()
            formData.append("file", file)
            formData.append("upload_preset", uploadPreset)
            formData.append("folder", "ecommerce_uploads/products")

            try {
                const res = await fetch(uploadUrl, {
                    method: "POST",
                    body: formData,
                })

                if (!res.ok) {
                    const err = await res.json()
                    throw new Error(err.error?.message || "Image upload failed")
                }

                const data = await res.json()
                return data.secure_url
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error)
                throw new Error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
        })

        const results = await Promise.allSettled(uploadPromises)
        const successfulUploads: string[] = []
        const errors: string[] = []

        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                successfulUploads.push(result.value)
            } else {
                errors.push(`Image ${index + 1}: ${result.reason}`)
            }
        })

        if (errors.length > 0) {
            throw new Error(`Some images failed to upload: ${errors.join(', ')}`)
        }

        return successfulUploads
    }

    // Form submission
    const onSubmit = async (data: ProductFormData) => {
        if (!validateForm()) {
            toast.error("Please fix the form errors before submitting")
            return
        }

        try {
            setLoading(true)

            // Upload images with progress
            toast.info("Uploading images...")
            const mainImageUrls = await uploadMultipleToCloudinary(mainImages)

            // Process variants
            toast.info("Processing variants...")
            const variantUploadPromises = colorVariants.map(async variant => {
                const imageUrls = await uploadMultipleToCloudinary(variant.images)
                return {
                    ...variant,
                    images: imageUrls,
                    sizes: variant.sizes.map(size => ({
                        ...size,
                        stock: Number(size.stock) || 0,
                        priceModifier: Number(size.priceModifier) || 0
                    }))
                }
            })

            const variantsWithImages = await Promise.all(variantUploadPromises)

            // Prepare final data
            const finalData: ProductFormData = {
                ...data,
                slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                images: mainImageUrls,
                primaryImageIndex: mainPrimaryIndex,
                variants: variantsWithImages,
                tags,
                specifications: specifications.reduce((acc, spec) => ({ ...acc, [spec.key]: spec.value }), {}),
                seo: {
                    ...data.seo,
                    keywords: seoKeywords,
                },
            }

            if (id) {
                await updateProduct(id, finalData)
                toast.success("Product updated successfully")
            } else {
                await createProduct(finalData)
                toast.success("Product created successfully")
            }

            router.push("/products")

        } catch (err: any) {
            console.error("Submission error:", err)
            toast.error(err.message || "Failed to save product")
        } finally {
            setLoading(false)
        }
    }

    // Shared props for tab components
    const sharedProps = {
        form,
        loading,
        formErrors,
        setFormErrors,
        validateForm
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-semibold">{id ? "Edit Product" : "Add Product"}</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (confirm('Are you sure you want to leave? Unsaved changes will be lost.')) {
                                        router.push("/products")
                                    }
                                }}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                disabled={loading}
                                className="flex items-center gap-2"
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                <Save className="h-4 w-4" />
                                {id ? "Update Product" : "Add Product"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 bg-muted/50 p-1 rounded-lg">
                            <TabsTrigger value="basic" className="flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                <span className="hidden md:inline">Basic</span>
                            </TabsTrigger>
                            <TabsTrigger value="color-variants" className="flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                <span className="hidden md:inline">Variants</span>
                            </TabsTrigger>
                            <TabsTrigger value="pricing" className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span className="hidden md:inline">Pricing</span>
                            </TabsTrigger>
                            <TabsTrigger value="inventory" className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                <span className="hidden md:inline">Inventory</span>
                            </TabsTrigger>
                            <TabsTrigger value="shipping" className="flex items-center gap-2">
                                <Truck className="h-4 w-4" />
                                <span className="hidden md:inline">Shipping</span>
                            </TabsTrigger>
                            <TabsTrigger value="seo" className="flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                <span className="hidden md:inline">SEO</span>
                            </TabsTrigger>
                            <TabsTrigger value="advanced" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                <span className="hidden md:inline">Advanced</span>
                            </TabsTrigger>
                        </TabsList>

                        <div className="mt-8">
                            <TabsContent value="basic">
                                <BasicTab
                                    {...sharedProps}
                                    allCategories={allCategories}
                                    tags={tags}
                                    setTags={setTags}
                                    specifications={specifications}
                                    setSpecifications={setSpecifications}
                                    mainImages={mainImages}
                                    setMainImages={setMainImages}
                                    mainPrimaryIndex={mainPrimaryIndex}
                                    setMainPrimaryIndex={setMainPrimaryIndex}
                                />
                            </TabsContent>

                            <TabsContent value="color-variants">
                                <ColorVariantsTab
                                    {...sharedProps}
                                    colorVariants={colorVariants}
                                    setColorVariants={setColorVariants}
                                    sizeOptions={sizeOptions}
                                    setSizeOptions={setSizeOptions}
                                    categoryAttributes={categoryAttributes}
                                />
                            </TabsContent>

                            <TabsContent value="pricing">
                                <PricingTab {...sharedProps} />
                            </TabsContent>

                            <TabsContent value="inventory">
                                <InventoryTab
                                    {...sharedProps}
                                    colorVariants={colorVariants}
                                />
                            </TabsContent>

                            <TabsContent value="shipping">
                                <ShippingTab {...sharedProps} />
                            </TabsContent>

                            <TabsContent value="seo">
                                <SEOTab
                                    {...sharedProps}
                                    seoKeywords={seoKeywords}
                                    setSeoKeywords={setSeoKeywords}
                                />
                            </TabsContent>

                            <TabsContent value="advanced">
                                <AdvancedTab
                                    {...sharedProps}
                                    allCategories={allCategories}
                                    colorVariants={colorVariants}
                                    mainImages={mainImages}
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                </form>
            </div>
        </div>
    )
}