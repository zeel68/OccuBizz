"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { v4 } from "uuid"
import { Save, Info, Tag, DollarSign, BarChart3, Truck, Search, Settings } from 'lucide-react'

import { useProductStore } from "@/store/StoreAdmin/productStore"
import { useCategoryStore } from "@/store/StoreAdmin/categoryStore"
import { iProductFormData, iProductVariant } from "@/models/StoreAdmin/product.model"
import { normalizeFilters } from "@/lib/utils"
import ColorVariantsTab from "./tabs/colors-tab"
import PricingTab from "./tabs/pricing-tab"
import InventoryTab from "./tabs/inventory-tab"
import SEOTab from "./tabs/seo-tab"
import ShippingTab from "./tabs/shipping-tab"
import AdvancedTab from "./tabs/advance-tab"
import BasicTab from "./tabs/basic-tab"



interface AddEditProductPageProps {
    id?: string
}

export default function AddEditProductPage({ id }: AddEditProductPageProps) {
    const productId = id
    const router = useRouter()
    const { updateProduct, createProduct, fetchProductById, selectedProduct, error } = useProductStore()
    const { allCategories, fetchAllCategories } = useCategoryStore()

    const [loading, setLoading] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState("basic")

    // State that needs to be shared across tabs
    const [mainImages, setMainImages] = useState<(File | string)[]>([])
    const [mainPrimaryIndex, setMainPrimaryIndex] = useState(0)
    const [tags, setTags] = useState<any[]>([])
    const [specifications, setSpecifications] = useState<Record<string, any>>({})
    const [colorVariants, setColorVariants] = useState<iProductVariant[]>([])
    const [seoKeywords, setSeoKeywords] = useState<string[]>([])
    const [sizeOptions, setSizeOptions] = useState<string[]>(["S", "M", "L", "XL", "XXL"])

    const form = useForm<iProductFormData>({
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            compare_price: undefined,
            cost_price: undefined,
            category: undefined,
            brand: undefined,
            sku: undefined,
            GST: undefined,
            HSNCode: undefined,
            stock: {
                quantity: 0,
                track_inventory: true,
                low_stock_threshold: 10,
                allow_backorder: false,
            },
            specifications: undefined,
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
    const selectedCategory = allCategories.find(cat => cat._id === selectedCategoryId)
    const categoryAttributes = normalizeFilters(selectedCategory?.config?.attributes)

    // Fetch data
    useEffect(() => {
        if (productId) {
            fetchProductById(productId)
        }
        if (allCategories.length === 0) {
            fetchAllCategories(true)
        }
    }, [productId, allCategories.length, fetchProductById, fetchAllCategories])

    // Populate form with product data
    useEffect(() => {
        if (selectedProduct) {
            form.reset(selectedProduct as any)
            setTags(selectedProduct.tags || [])
            setSeoKeywords(selectedProduct.seo?.keywords || [])
            setSpecifications(selectedProduct.specifications || {})
            setMainImages(selectedProduct.images || [])
            setMainPrimaryIndex(selectedProduct.primaryImageIndex || 0)

            const variantsWithSizes = (selectedProduct.variants || []).map(v => ({
                ...v,
                id: v.id || v4(),
                images: v.images || [],
                primaryIndex: v.primaryIndex || 0,
                sizes: v.sizes ? v.sizes.map(s => ({
                    ...s,
                    id: s.id || v4(),
                    attributes: s.attributes || {}
                })) : []
            }))
            setColorVariants(variantsWithSizes as any)
        }
    }, [selectedProduct, form])

    // Cloudinary upload function
    const uploadMultipleToCloudinary = async (files: (File | string)[]): Promise<string[]> => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "BizzWeb"

        if (!cloudName || !uploadPreset) {
            throw new Error("Missing Cloudinary configuration")
        }

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

        const uploadPromises = files.map(async (file) => {
            if (typeof file === "string") return file
            const formData = new FormData()
            formData.append("file", file)
            formData.append("upload_preset", uploadPreset)
            formData.append("folder", "ecommerce_uploads/products")

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
        })

        return await Promise.all(uploadPromises)
    }

    // Handle number inputs
    const handleNumberChange = (field: string, value: string) => {
        const num = value === "" ? undefined : Number(value)
        form.setValue(field as any, num)
    }

    // Form submission
    const onSubmit = async (data: iProductFormData) => {
        try {
            setLoading(true)

            // Upload main images
            const mainImageUrls = await uploadMultipleToCloudinary(mainImages)

            // Upload variant images
            const variantUploadPromises = colorVariants.map(async variant => {
                const imageUrls = await uploadMultipleToCloudinary(variant.images)
                const sizes = variant.sizes.map(size => ({
                    ...size,
                    attributes: size.attributes
                }))
                return {
                    ...variant,
                    images: imageUrls,
                    sizes
                }
            })

            const variantsWithImages = await Promise.all(variantUploadPromises)

            // Prepare final data
            data.slug = data.name.toLowerCase().replace(/\s+/g, "-")
            data.images = mainImageUrls
            data.variants = variantsWithImages
            data.tags = tags
            data.specifications = specifications
            data.seo = {
                ...data.seo,
                keywords: seoKeywords,
            }
            data.stock = {
                ...data.stock,
                low_stock_threshold: data.stock.low_stock_threshold,
                allow_backorder: data.stock.allow_backorder,
                track_inventory: data.stock.track_inventory
            }

            // Save product
            if (productId) {
                await updateProduct(productId, data)
                toast.success("Product updated successfully")
            } else {
                await createProduct(data)
                if (!error) {
                    toast.success("Product added successfully")
                } else {
                    toast.error(error)
                }
            }

            if (!error) {
                router.push("/products")
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to save product")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-semibold">
                                {productId ? "Edit Product" : "Add Product"}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => router.push("/products")}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                form="product-form"
                                disabled={loading}
                                className="flex items-center gap-2"
                            >
                                {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />}
                                <Save className="h-4 w-4" />
                                {productId ? "Update Product" : "Add Product"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form
                    id="product-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-7">
                            <TabsTrigger value="basic" className="flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                Basic
                            </TabsTrigger>
                            <TabsTrigger value="attributes" className="flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                Variants
                            </TabsTrigger>
                            <TabsTrigger value="pricing" className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Pricing
                            </TabsTrigger>
                            <TabsTrigger value="inventory" className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Inventory
                            </TabsTrigger>
                            <TabsTrigger value="shipping" className="flex items-center gap-2">
                                <Truck className="h-4 w-4" />
                                Shipping
                            </TabsTrigger>
                            <TabsTrigger value="seo" className="flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                SEO
                            </TabsTrigger>
                            <TabsTrigger value="advanced" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Advanced
                            </TabsTrigger>
                        </TabsList>

                        <div className="mt-8">
                            <TabsContent value="basic">
                                <BasicTab
                                    form={form}
                                    loading={loading}
                                    allCategories={allCategories}
                                    mainImages={mainImages}
                                    mainPrimaryIndex={mainPrimaryIndex}
                                    tags={tags}
                                    setMainImages={setMainImages}
                                    setMainPrimaryIndex={setMainPrimaryIndex}
                                    setTags={setTags}
                                    handleNumberChange={handleNumberChange}
                                />
                            </TabsContent>

                            <TabsContent value="attributes">
                                <ColorVariantsTab
                                    form={form}
                                    loading={loading}
                                    colorVariants={colorVariants}
                                    setColorVariants={setColorVariants}
                                    sizeOptions={sizeOptions}
                                    setSizeOptions={setSizeOptions}
                                    categoryAttributes={categoryAttributes}
                                    selectedCategory={selectedCategory}
                                    handleNumberChange={handleNumberChange}
                                />
                            </TabsContent>

                            <TabsContent value="pricing">
                                <PricingTab
                                    form={form}
                                    loading={loading}
                                    handleNumberChange={handleNumberChange}
                                />
                            </TabsContent>

                            <TabsContent value="inventory">
                                <InventoryTab
                                    form={form}
                                    loading={loading}
                                    handleNumberChange={handleNumberChange}
                                />
                            </TabsContent>

                            <TabsContent value="shipping">
                                <ShippingTab
                                    form={form}
                                    loading={loading}
                                    handleNumberChange={handleNumberChange}
                                />
                            </TabsContent>

                            <TabsContent value="seo">
                                <SEOTab
                                    form={form}
                                    loading={loading}
                                    seoKeywords={seoKeywords}
                                    setSeoKeywords={setSeoKeywords}
                                />
                            </TabsContent>

                            <TabsContent value="advanced">
                                <AdvancedTab
                                    form={form}
                                    loading={loading}
                                    specifications={specifications}
                                    setSpecifications={setSpecifications}
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                </form>
            </div>
        </div>
    )
}