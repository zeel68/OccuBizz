// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { useRouter } from "next/navigation"
// import { useForm } from "react-hook-form"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// import {
//     Plus, X, Trash2, Save, Package, Tag, Settings, DollarSign,
//     Truck, Search, BarChart3, ImageIcon, Info, Copy, AlertTriangle,
//     Eye, EyeOff, Loader2
// } from 'lucide-react'
// import { toast } from "sonner"

// // Real store hooks
// import { useProductStore } from "@/store/StoreAdmin/productStore"
// import { useCategoryStore } from "@/store/StoreAdmin/categoryStore"

// // Real components
// import ImageUpload from "@/components/shared/image-upload"
// import { RichTextEditor } from "@/components/ui/rich-text-editor"

// // Models
// import { CategoryFilter, iProductFormData, iProductVariant } from "@/models/StoreAdmin/product.model"

// // Utility functions
// const generateUUID = () => Math.random().toString(36).substr(2, 9)

// const normalizeFilters = (raw: any): CategoryFilter[] => {
//     if (!raw) return []
//     if (Array.isArray(raw)) {
//         return raw.map(item => ({
//             name: item?.name || item?.key || "",
//             type: item?.type || "text",
//             options: Array.isArray(item?.options) ? item.options : [],
//             is_required: !!item?.is_required
//         }))
//     }
//     if (typeof raw === "object") {
//         return Object.entries(raw).map(([key, val]) => ({
//             name: (val as any)?.name || key,
//             type: (val as any)?.type || "text",
//             options: Array.isArray((val as any)?.options) ? (val as any).options : [],
//             is_required: !!(val as any)?.is_required
//         }))
//     }
//     return []
// }

// type Specification = { key: string; value: string }

// export default function AddEditProductPage({ id }: { id?: string }) {
//     const router = useRouter()
//     const { updateProduct, createProduct, fetchProductById, selectedProduct, error } = useProductStore()
//     const { allCategories, fetchAllCategories } = useCategoryStore()

//     // Form and loading states
//     const [loading, setLoading] = useState<boolean>(false)
//     const [activeTab, setActiveTab] = useState<string>("basic")
//     const [formErrors, setFormErrors] = useState<Record<string, string>>({})

//     // Image states
//     const [mainImages, setMainImages] = useState<(File | string)[]>([])
//     const [mainPrimaryIndex, setMainPrimaryIndex] = useState<number>(0)

//     // Dynamic content states
//     const [tags, setTags] = useState<string[]>([])
//     const [newTag, setNewTag] = useState<string>("")
//     const [specifications, setSpecifications] = useState<Specification[]>([])
//     const [newSpecification, setNewSpecification] = useState<Specification>({ key: "", value: "" })
//     const [colorVariants, setColorVariants] = useState<iProductVariant[]>([])
//     const [seoKeywords, setSeoKeywords] = useState<string[]>([])
//     const [newKeyword, setNewKeyword] = useState<string>("")
//     const [sizeOptions, setSizeOptions] = useState<string[]>(["XS", "S", "M", "L", "XL", "XXL"])
//     const [newSizeOption, setNewSizeOption] = useState<string>("")

//     const form = useForm<iProductFormData>({
//         defaultValues: {
//             name: "",
//             description: "",
//             price: 0,
//             compare_price: undefined,
//             cost_price: undefined,
//             category: "",
//             brand: "",
//             sku: "",
//             GST: "",
//             HSNCode: "",
//             stock: {
//                 quantity: 0,
//                 track_inventory: true,
//                 low_stock_threshold: 10,
//                 allow_backorder: false,
//             },
//             specifications: {},
//             tags: [],
//             seo: {
//                 title: "",
//                 description: "",
//                 keywords: [],
//             },
//             shipping: {
//                 weight: undefined,
//                 dimensions: {
//                     length: undefined,
//                     width: undefined,
//                     height: undefined,
//                 },
//             },
//             variants: [],
//             is_active: true,
//             is_featured: false,
//             visibility: "public",
//             images: [],
//         },
//     })

//     const selectedCategoryId = form.watch("category")
//     const selectedCategory = allCategories.find(cat => cat._id === selectedCategoryId)
//     const categoryAttributes = normalizeFilters(selectedCategory?.config?.attributes)

//     // Data fetching effects
//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 if (allCategories.length === 0) {
//                     await fetchAllCategories()
//                 }
//                 if (id) {
//                     await fetchProductById(id)
//                 }
//             } catch (err) {
//                 console.error("Error loading data:", err)
//             }
//         }
//         loadData()
//     }, [id, allCategories.length, fetchProductById, fetchAllCategories])

//     // Populate form with existing product data
//     useEffect(() => {
//         if (selectedProduct && id) {
//             const productData: iProductFormData = {
//                 ...selectedProduct,
//                 price: selectedProduct.price || 0,
//                 compare_price: selectedProduct.compare_price,
//                 cost_price: selectedProduct.cost_price,
//                 stock: {
//                     ...selectedProduct.stock,
//                     quantity: selectedProduct.stock?.quantity || 0,
//                     low_stock_threshold: selectedProduct.stock?.low_stock_threshold || 10
//                 },
//                 shipping: {
//                     ...selectedProduct.shipping,
//                     weight: selectedProduct.shipping?.weight,
//                     dimensions: {
//                         length: selectedProduct.shipping?.dimensions?.length,
//                         width: selectedProduct.shipping?.dimensions?.width,
//                         height: selectedProduct.shipping?.dimensions?.height
//                     }
//                 }
//             } as any

//             form.reset(productData)
//             setTags(selectedProduct.tags || [])
//             setSeoKeywords(selectedProduct.seo?.keywords || [])
//             setSpecifications(Object.entries(selectedProduct.specifications || {}).map(([key, value]) => ({ key, value: value as string })))
//             setMainImages(selectedProduct.images || [])
//             setMainPrimaryIndex(selectedProduct.primaryImageIndex || 0)

//             const variantsWithIds = (selectedProduct.variants || []).map(v => ({
//                 ...v,
//                 id: v.id || generateUUID(),
//                 images: v.images || [],
//                 primaryIndex: v.primaryIndex || 0,
//                 sizes: (v.sizes || []).map(s => ({
//                     ...s,
//                     id: s.id || generateUUID(),
//                     attributes: s.attributes || {}
//                 }))
//             }))
//             setColorVariants(variantsWithIds)
//         }
//     }, [selectedProduct, id, form])

//     // Validation helper
//     const validateForm = () => {
//         const errors: Record<string, string> = {}
//         const values = form.getValues()

//         if (!values.name?.trim()) errors.name = "Product name is required"
//         if (values.price <= 0) errors.price = "Valid price is required"
//         if (values.compare_price && values.compare_price <= values.price) {
//             errors.compare_price = "Compare price should be higher than selling price"
//         }

//         setFormErrors(errors)
//         return Object.keys(errors).length === 0
//     }

//     // Image handling functions
//     const handleMainImageSelect = useCallback((files: File[]) => {
//         setMainImages(prev => [...prev, ...files])
//     }, [])

//     const handleMainImageRemove = useCallback((index: number) => {
//         setMainImages(prev => prev.filter((_, i) => i !== index))
//         setMainPrimaryIndex(prev => index === prev ? 0 : prev > index ? prev - 1 : prev)
//     }, [])

//     const handleMainSetPrimaryImage = useCallback((index: number) => {
//         setMainPrimaryIndex(index)
//     }, [])

//     // Tag management
//     const addTag = useCallback(() => {
//         const trimmed = newTag.trim()
//         if (trimmed && !tags.includes(trimmed)) {
//             setTags(prev => [...prev, trimmed])
//             setNewTag("")
//         }
//     }, [newTag, tags])

//     const removeTag = useCallback((tag: string) => {
//         setTags(prev => prev.filter(t => t !== tag))
//     }, [])

//     // Specification management  
//     const addSpecification = useCallback(() => {
//         const { key, value } = newSpecification
//         const trimmedKey = key.trim()
//         const trimmedValue = value.trim()
//         if (trimmedKey && trimmedValue) {
//             setSpecifications(prev => [...prev, { key: trimmedKey, value: trimmedValue }])
//             setNewSpecification({ key: "", value: "" })
//         }
//     }, [newSpecification])

//     const removeSpecification = useCallback((index: number) => {
//         setSpecifications(prev => prev.filter((_, i) => i !== index))
//     }, [])

//     // SEO keyword management
//     const addKeyword = useCallback(() => {
//         const trimmed = newKeyword.trim()
//         if (trimmed && !seoKeywords.includes(trimmed)) {
//             setSeoKeywords(prev => [...prev, trimmed])
//             setNewKeyword("")
//         }
//     }, [newKeyword, seoKeywords])

//     const removeKeyword = useCallback((keyword: string) => {
//         setSeoKeywords(prev => prev.filter(k => k !== keyword))
//     }, [])

//     // Number input handler
//     const handleNumberChange = (field: any, value: string) => {
//         const num = value === "" ? undefined : Number(value)
//         form.setValue(field, num)
//     }

//     // Variant management functions
//     const addColorVariant = () => {
//         const newVariant: iProductVariant = {
//             id: generateUUID(),
//             color: "",
//             images: [],
//             primaryIndex: 0,
//             sizes: [],
//             option: "",
//             price: 0,
//             sku: "",
//             stock_quantity: 0
//         } as any
//         setColorVariants(prev => [...prev, newVariant])
//     }

//     const removeColorVariant = (id: string) => {
//         setColorVariants(prev => prev.filter(v => v.id !== id))
//     }

//     const updateColorVariant = (id: string, updates: Partial<iProductVariant>) => {
//         setColorVariants(prev =>
//             prev.map(variant =>
//                 variant.id === id ? { ...variant, ...updates } : variant
//             )
//         )
//     }

//     const toggleSizeSelection = (variantId: string, sizeLabel: string) => {
//         setColorVariants(prev =>
//             prev.map(variant => {
//                 if (variant.id !== variantId) return variant

//                 const exists = variant.sizes.find(s => s.size === sizeLabel)
//                 if (exists) {
//                     return {
//                         ...variant,
//                         sizes: variant.sizes.filter(s => s.size !== sizeLabel)
//                     }
//                 } else {
//                     const newSize = {
//                         id: generateUUID(),
//                         size: sizeLabel,
//                         stock: 0,
//                         priceModifier: 0,
//                         sku: "",
//                         attributes: {}
//                     }
//                     return {
//                         ...variant,
//                         sizes: [...variant.sizes, newSize]
//                     }
//                 }
//             })
//         )
//     }

//     const addNewSizeOption = () => {
//         const label = newSizeOption.trim()
//         if (!label || sizeOptions.includes(label)) return

//         setSizeOptions(prev => [...prev, label])
//         setNewSizeOption("")
//     }

//     const removeSizeFromVariant = (variantId: string, sizeId: string) => {
//         setColorVariants(prev =>
//             prev.map(variant =>
//                 variant.id === variantId
//                     ? { ...variant, sizes: variant.sizes.filter(s => s.id !== sizeId) }
//                     : variant
//             )
//         )
//     }

//     const updateSizeInVariant = (variantId: string, sizeId: string, updates: Partial<any>) => {
//         setColorVariants(prev =>
//             prev.map(variant => {
//                 if (variant.id === variantId) {
//                     return {
//                         ...variant,
//                         sizes: variant.sizes.map(size =>
//                             size.id === sizeId ? { ...size, ...updates } : size
//                         )
//                     }
//                 }
//                 return variant
//             })
//         )
//     }

//     const updateSizeAttribute = (variantId: string, sizeId: string, attributeName: string, value: any) => {
//         setColorVariants(prev =>
//             prev.map(variant => {
//                 if (variant.id === variantId) {
//                     return {
//                         ...variant,
//                         sizes: variant.sizes.map(size => {
//                             if (size.id === sizeId) {
//                                 return {
//                                     ...size,
//                                     attributes: {
//                                         ...size.attributes,
//                                         [attributeName]: value
//                                     }
//                                 }
//                             }
//                             return size
//                         })
//                     }
//                 }
//                 return variant
//             })
//         )
//     }

//     const copyAttributeToAll = (attributeName: string, value: any) => {
//         setColorVariants(prev =>
//             prev.map(variant => ({
//                 ...variant,
//                 sizes: variant.sizes.map(size => ({
//                     ...size,
//                     attributes: {
//                         ...size.attributes,
//                         [attributeName]: value
//                     }
//                 }))
//             }))
//         )
//         toast.success(`Copied ${attributeName} to all sizes`)
//     }

//     // Cloudinary upload
//     const uploadMultipleToCloudinary = async (files: (File | string)[]) => {
//         const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
//         const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "BizzWeb"

//         if (!cloudName || !uploadPreset) {
//             throw new Error("Missing Cloudinary configuration")
//         }

//         const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

//         const uploadPromises = files.map(async (file) => {
//             if (typeof file === "string") return file
//             const formData = new FormData()
//             formData.append("file", file)
//             formData.append("upload_preset", uploadPreset)
//             formData.append("folder", "ecommerce_uploads/products")

//             const res = await fetch(uploadUrl, {
//                 method: "POST",
//                 body: formData,
//             })

//             if (!res.ok) {
//                 const err = await res.json()
//                 throw new Error(err.error?.message || "Image upload failed")
//             }

//             const data = await res.json()
//             return data.secure_url
//         })

//         return Promise.all(uploadPromises)
//     }

//     // Form submission
//     const onSubmit = async (data: iProductFormData) => {
//         if (!validateForm()) return

//         try {
//             setLoading(true)

//             // Upload images
//             const mainImageUrls = await uploadMultipleToCloudinary(mainImages)

//             // Process variants
//             const variantUploadPromises = colorVariants.map(async variant => {
//                 const imageUrls = await uploadMultipleToCloudinary(variant.images)
//                 return {
//                     ...variant,
//                     images: imageUrls,
//                     sizes: variant.sizes.map(size => ({
//                         ...size,
//                         stock: parseInt(size.stock as any) || 0,
//                         priceModifier: parseFloat(size.priceModifier as any) || 0
//                     }))
//                 }
//             })

//             const variantsWithImages = await Promise.all(variantUploadPromises)

//             // Prepare final data
//             const finalData: iProductFormData = {
//                 ...data,
//                 slug: data.name.toLowerCase().replace(/\s+/g, "-"),
//                 images: mainImageUrls,
//                 variants: variantsWithImages,
//                 tags,
//                 specifications: specifications.reduce((acc, spec) => ({ ...acc, [spec.key]: spec.value }), {}),
//                 seo: {
//                     ...data.seo,
//                     keywords: seoKeywords,
//                 },
//             }

//             if (id) {
//                 await updateProduct(id, finalData)
//                 toast.success("Product updated successfully")
//             } else {
//                 await createProduct(finalData)
//                 toast.success("Product created successfully")
//             }

//             router.push("/products")

//         } catch (err: any) {
//             toast.error(err.message || "Failed to save product")
//         } finally {
//             setLoading(false)
//         }
//     }

//     // Render attribute input for variants
//     const renderAttributeInput = (variantId: string, sizeId: string, attribute: CategoryFilter) => {
//         const variant = colorVariants.find(v => v.id === variantId)
//         if (!variant) return null

//         const size = variant.sizes.find(s => s.id === sizeId)
//         if (!size) return null

//         const value = size.attributes[attribute.name] ?? (attribute.type === "multiselect" ? [] : "")

//         switch (attribute.type) {
//             case "text":
//                 return (
//                     <Input
//                         className="h-8 text-sm"
//                         value={value as string}
//                         onChange={(e) => updateSizeAttribute(variantId, sizeId, attribute.name, e.target.value)}
//                         placeholder={`Enter ${attribute.name}`}
//                         disabled={loading}
//                     />
//                 )
//             case "number":
//                 return (
//                     <Input
//                         className="h-8 text-sm"
//                         type="number"
//                         value={value as number}
//                         onChange={(e) => updateSizeAttribute(variantId, sizeId, attribute.name, Number(e.target.value))}
//                         placeholder={`Enter ${attribute.name}`}
//                         disabled={loading}
//                     />
//                 )
//             case "select":
//                 return (
//                     <Select
//                         value={value as string}
//                         onValueChange={(val) => updateSizeAttribute(variantId, sizeId, attribute.name, val)}
//                         disabled={loading}
//                     >
//                         <SelectTrigger className="h-8 text-sm">
//                             <SelectValue placeholder={`Select ${attribute.name}`} />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {attribute.options.map((option) => (
//                                 <SelectItem key={option} value={option}>
//                                     {option}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 )
//             case "multiselect":
//                 const currentValues = Array.isArray(value) ? value : []
//                 return (
//                     <div className="space-y-1 max-h-32 overflow-y-auto">
//                         {attribute.options.map((option) => (
//                             <div key={option} className="flex items-center space-x-2">
//                                 <Checkbox
//                                     id={`${variantId}-${sizeId}-${attribute.name}-${option}`}
//                                     checked={currentValues.includes(option)}
//                                     onCheckedChange={(checked) => {
//                                         const newValues = checked
//                                             ? [...currentValues, option]
//                                             : currentValues.filter((v) => v !== option)
//                                         updateSizeAttribute(variantId, sizeId, attribute.name, newValues)
//                                     }}
//                                     disabled={loading}
//                                 />
//                                 <label
//                                     className="text-sm truncate cursor-pointer"
//                                     htmlFor={`${variantId}-${sizeId}-${attribute.name}-${option}`}
//                                 >
//                                     {option}
//                                 </label>
//                             </div>
//                         ))}
//                     </div>
//                 )
//             default:
//                 return null
//         }
//     }

//     // Tab render functions
//     const renderBasicTab = () => (
//         <div className="space-y-6">
//             {error && (
//                 <Alert variant="destructive">
//                     <AlertTriangle className="h-4 w-4" />
//                     <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//             )}

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <Card className="shadow-sm">
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <Package className="h-5 w-5" />
//                             Product Details
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="name" className="flex items-center gap-1">
//                                 Product Name
//                                 <span className="text-red-500">*</span>
//                             </Label>
//                             <Input
//                                 id="name"
//                                 {...form.register("name")}
//                                 placeholder="Enter product name"
//                                 disabled={loading}
//                                 className={formErrors.name ? "border-red-500" : ""}
//                             />
//                             {formErrors.name && (
//                                 <p className="text-sm text-red-500 flex items-center gap-1">
//                                     <AlertTriangle className="h-3 w-3" />
//                                     {formErrors.name}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="category">Category</Label>
//                             <Select
//                                 value={form.watch("category") || ""}
//                                 onValueChange={(value) => form.setValue("category", value)}
//                                 disabled={loading}
//                             >
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select category" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {allCategories.map((category) => (
//                                         <SelectItem key={category._id} value={category._id}>
//                                             {category.display_name}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                                 <Label htmlFor="brand">Brand</Label>
//                                 <Input
//                                     id="brand"
//                                     {...form.register("brand")}
//                                     placeholder="Enter brand name"
//                                     disabled={loading}
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="sku">SKU</Label>
//                                 <Input
//                                     id="sku"
//                                     {...form.register("sku")}
//                                     placeholder="Enter product SKU"
//                                     disabled={loading}
//                                 />
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                                 <Label htmlFor="GST">GST (%)</Label>
//                                 <Input
//                                     id="GST"
//                                     {...form.register("GST")}
//                                     placeholder="Enter GST percentage"
//                                     disabled={loading}
//                                     type="number"
//                                     min="0"
//                                     max="100"
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="HSNCode">HSN Code</Label>
//                                 <Input
//                                     id="HSNCode"
//                                     {...form.register("HSNCode")}
//                                     placeholder="Enter HSN code"
//                                     disabled={loading}
//                                 />
//                             </div>
//                         </div>

//                         <RichTextEditor
//                             label="Description"
//                             value={form.watch("description") || ""}
//                             onChange={(value) => form.setValue("description", value)}
//                             placeholder="Describe your product in detail..."
//                             disabled={loading}
//                         />
//                     </CardContent>
//                 </Card>

//                 <Card className="shadow-sm">
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <ImageIcon className="h-5 w-5" />
//                             Product Images
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <ImageUpload
//                             onSelectFiles={handleMainImageSelect}
//                             onRemove={handleMainImageRemove}
//                             onSetPrimary={handleMainSetPrimaryImage}
//                             value={mainImages}
//                             primaryIndex={mainPrimaryIndex}
//                             multiple={true}
//                             showPreview={true}
//                             disabled={loading}
//                             showLocalPreview={true}
//                         />
//                     </CardContent>
//                 </Card>
//             </div>

//             <Card className="shadow-sm">
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <Tag className="h-5 w-5" />
//                         Tags
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="flex gap-2">
//                         <Input
//                             value={newTag}
//                             onChange={(e) => setNewTag(e.target.value)}
//                             placeholder="Add a tag"
//                             onKeyDown={(e) => {
//                                 if (e.key === "Enter") {
//                                     e.preventDefault()
//                                     addTag()
//                                 }
//                             }}
//                             disabled={loading}
//                             className="flex-1"
//                         />
//                         <Button
//                             type="button"
//                             onClick={addTag}
//                             variant="outline"
//                             disabled={loading || !newTag.trim()}
//                         >
//                             <Plus className="h-4 w-4" />
//                         </Button>
//                     </div>
//                     {tags.length > 0 && (
//                         <div className="flex flex-wrap gap-2">
//                             {tags.map((tag, index) => (
//                                 <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
//                                     {tag}
//                                     <Button
//                                         type="button"
//                                         variant="ghost"
//                                         size="sm"
//                                         className="h-auto p-0 ml-2"
//                                         onClick={() => removeTag(tag)}
//                                     >
//                                         <X className="h-3 w-3" />
//                                     </Button>
//                                 </Badge>
//                             ))}
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>

//             <Card className="shadow-sm">
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <Settings className="h-5 w-5" />
//                         Specifications
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="grid grid-cols-2 gap-2">
//                         <Input
//                             value={newSpecification.key}
//                             onChange={(e) => setNewSpecification(prev => ({ ...prev, key: e.target.value }))}
//                             placeholder="Specification name"
//                             disabled={loading}
//                         />
//                         <div className="flex gap-2">
//                             <Input
//                                 value={newSpecification.value}
//                                 onChange={(e) => setNewSpecification(prev => ({ ...prev, value: e.target.value }))}
//                                 placeholder="Specification value"
//                                 disabled={loading}
//                                 className="flex-1"
//                             />
//                             <Button
//                                 type="button"
//                                 onClick={addSpecification}
//                                 variant="outline"
//                                 disabled={loading || !newSpecification.key.trim() || !newSpecification.value.trim()}
//                             >
//                                 <Plus className="h-4 w-4" />
//                             </Button>
//                         </div>
//                     </div>
//                     {specifications.length > 0 && (
//                         <div className="space-y-2">
//                             {specifications.map((spec, index) => (
//                                 <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
//                                     <span className="font-medium">{spec.key}:</span>
//                                     <div className="flex items-center gap-3">
//                                         <span className="text-muted-foreground">{spec.value}</span>
//                                         <Button
//                                             type="button"
//                                             variant="ghost"
//                                             size="sm"
//                                             onClick={() => removeSpecification(index)}
//                                         >
//                                             <X className="h-4 w-4" />
//                                         </Button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     )

//     const renderPricingTab = () => (
//         <Card className="shadow-sm">
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                     <DollarSign className="h-5 w-5" />
//                     Pricing Information
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     <div className="space-y-2">
//                         <Label htmlFor="price" className="flex items-center gap-1">
//                             Selling Price
//                             <span className="text-red-500">*</span>
//                         </Label>
//                         <Input
//                             id="price"
//                             type="number"
//                             step="0.01"
//                             min="0"
//                             value={form.watch("price")}
//                             onChange={(e) => handleNumberChange("price", e.target.value)}
//                             placeholder="0.00"
//                             disabled={loading}
//                             className={formErrors.price ? "border-red-500" : ""}
//                         />
//                         {formErrors.price && (
//                             <p className="text-sm text-red-500 flex items-center gap-1">
//                                 <AlertTriangle className="h-3 w-3" />
//                                 {formErrors.price}
//                             </p>
//                         )}
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="compare_price">Compare At Price</Label>
//                         <Input
//                             id="compare_price"
//                             type="number"
//                             step="0.01"
//                             min="0"
//                             value={form.watch("compare_price") || ""}
//                             onChange={(e) => handleNumberChange("compare_price", e.target.value)}
//                             placeholder="0.00"
//                             disabled={loading}
//                             className={formErrors.compare_price ? "border-red-500" : ""}
//                         />
//                         {formErrors.compare_price && (
//                             <p className="text-sm text-red-500 flex items-center gap-1">
//                                 <AlertTriangle className="h-3 w-3" />
//                                 {formErrors.compare_price}
//                             </p>
//                         )}
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="cost_price">Cost Price</Label>
//                         <Input
//                             id="cost_price"
//                             type="number"
//                             step="0.01"
//                             min="0"
//                             value={form.watch("cost_price") || ""}
//                             onChange={(e) => handleNumberChange("cost_price", e.target.value)}
//                             placeholder="0.00"
//                             disabled={loading}
//                         />
//                     </div>
//                 </div>

//                 {form.watch("price") > 0 && (form.watch("cost_price") ?? 0) > 0 && (
//                     <div className="p-4 bg-muted rounded-lg shadow-inner">
//                         <Label className="text-sm font-medium">Profit Analysis</Label>
//                         <div className="grid grid-cols-2 gap-4 mt-2">
//                             <div>
//                                 <p className="text-sm text-muted-foreground">Profit Margin</p>
//                                 <p className="text-lg font-semibold text-green-600">
//                                     {(((form.watch("price") - (form.watch("cost_price") ?? 0)) / form.watch("price")) * 100).toFixed(1)}%
//                                 </p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-muted-foreground">Profit Amount</p>
//                                 <p className="text-lg font-semibold text-green-600">
//                                     ${(form.watch("price") - (form.watch("cost_price") ?? 0)).toFixed(2)}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     )

//     const renderInventoryTab = () => (
//         <Card className="shadow-sm">
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                     <BarChart3 className="h-5 w-5" />
//                     Inventory Management
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                         <Label htmlFor="quantity">Stock Quantity</Label>
//                         <Input
//                             id="quantity"
//                             type="number"
//                             min="0"
//                             value={form.watch("stock.quantity")}
//                             onChange={(e) => handleNumberChange("stock.quantity", e.target.value)}
//                             placeholder="0"
//                             disabled={loading}
//                         />
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="low_stock_threshold">Low Stock Alert</Label>
//                         <Input
//                             id="low_stock_threshold"
//                             type="number"
//                             min="0"
//                             value={form.watch("stock.low_stock_threshold")}
//                             onChange={(e) => handleNumberChange("stock.low_stock_threshold", e.target.value)}
//                             placeholder="10"
//                             disabled={loading}
//                         />
//                     </div>
//                 </div>

//                 <Separator />

//                 <div className="space-y-4">
//                     <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
//                         <div>
//                             <Label>Track Inventory</Label>
//                             <p className="text-sm text-muted-foreground">Monitor stock levels for this product</p>
//                         </div>
//                         <Switch
//                             checked={form.watch("stock.track_inventory")}
//                             onCheckedChange={(checked) => form.setValue("stock.track_inventory", checked)}
//                             disabled={loading}
//                         />
//                     </div>

//                     <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
//                         <div>
//                             <Label>Allow Backorder</Label>
//                             <p className="text-sm text-muted-foreground">Accept orders when out of stock</p>
//                         </div>
//                         <Switch
//                             checked={form.watch("stock.allow_backorder")}
//                             onCheckedChange={(checked) => form.setValue("stock.allow_backorder", checked)}
//                             disabled={loading}
//                         />
//                     </div>
//                 </div>

//                 <div className="p-4 bg-muted rounded-lg shadow-inner">
//                     <Label className="text-sm font-medium">Stock Summary</Label>
//                     <div className="mt-2 space-y-2">
//                         <div className="flex justify-between items-center">
//                             <span className="text-sm text-muted-foreground">Base Stock:</span>
//                             <span className="font-medium">{form.watch("stock.quantity") || 0}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                             <span className="text-sm text-muted-foreground">Variant Stock:</span>
//                             <span className="font-medium">
//                                 {colorVariants.reduce((total, variant) =>
//                                     total + variant.sizes.reduce((varTotal, size) => varTotal + (size.stock || 0), 0), 0
//                                 )}
//                             </span>
//                         </div>
//                         <Separator className="my-2" />
//                         <div className="flex justify-between items-center">
//                             <span className="text-sm font-medium">Total Available:</span>
//                             <span className="font-bold">
//                                 {(form.watch("stock.quantity") || 0) +
//                                     colorVariants.reduce((total, variant) =>
//                                         total + variant.sizes.reduce((varTotal, size) => varTotal + (size.stock || 0), 0), 0
//                                     )}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )

//     const renderColorVariantsTab = () => (
//         <div className="space-y-6">
//             <Card className="shadow-sm">
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <ImageIcon className="h-5 w-5" />
//                         Color & Size Variants
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                     <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                         <Button
//                             type="button"
//                             onClick={addColorVariant}
//                             className="w-full lg:w-auto"
//                             disabled={loading}
//                         >
//                             <Plus className="h-4 w-4 mr-2" />
//                             Add Color Variant
//                         </Button>

//                         <div className="flex flex-col gap-2 w-full lg:w-auto">
//                             <Label className="text-sm">Global Sizes</Label>
//                             <div className="flex items-center gap-2">
//                                 <div className="flex flex-wrap gap-1">
//                                     {sizeOptions.map(opt => (
//                                         <Badge key={opt} variant="outline" className="px-2 py-1">
//                                             {opt}
//                                         </Badge>
//                                     ))}
//                                 </div>
//                                 <div className="flex items-center gap-2 flex-1 min-w-[200px]">
//                                     <Input
//                                         placeholder="Add custom size"
//                                         value={newSizeOption}
//                                         onChange={(e) => setNewSizeOption(e.target.value)}
//                                         onKeyDown={(e) => {
//                                             if (e.key === "Enter") {
//                                                 e.preventDefault()
//                                                 addNewSizeOption()
//                                             }
//                                         }}
//                                         className="flex-1"
//                                         disabled={loading}
//                                     />
//                                     <Button
//                                         type="button"
//                                         onClick={addNewSizeOption}
//                                         variant="outline"
//                                         size="icon"
//                                         disabled={loading || !newSizeOption.trim()}
//                                     >
//                                         <Plus className="h-4 w-4" />
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="space-y-8">
//                         {colorVariants.length === 0 ? (
//                             <div className="text-center py-12 border rounded-lg bg-muted/20">
//                                 <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//                                 <p className="text-muted-foreground mb-4">No color variants added yet</p>
//                                 <p className="text-sm text-muted-foreground mb-4">
//                                     Add color variants to offer different colors and sizes for your product
//                                 </p>
//                                 <Button
//                                     type="button"
//                                     onClick={addColorVariant}
//                                     variant="secondary"
//                                     disabled={loading}
//                                 >
//                                     Add Your First Color Variant
//                                 </Button>
//                             </div>
//                         ) : (
//                             colorVariants.map((variant, index) => (
//                                 <Card key={variant.id} className="border rounded-lg overflow-hidden shadow-sm">
//                                     <CardHeader className="bg-muted/40 p-4">
//                                         <div className="flex justify-between items-center">
//                                             <div className="flex items-center gap-4">
//                                                 <span className="font-medium">
//                                                     {index + 1}. {variant.color || "Unnamed"} Color Variant
//                                                 </span>
//                                                 {variant.sizes.length > 0 && (
//                                                     <Badge variant="secondary">
//                                                         {variant.sizes.length} size{variant.sizes.length !== 1 ? 's' : ''}
//                                                     </Badge>
//                                                 )}
//                                             </div>
//                                             <Button
//                                                 type="button"
//                                                 variant="destructive"
//                                                 size="sm"
//                                                 onClick={() => removeColorVariant(variant.id)}
//                                                 disabled={loading}
//                                             >
//                                                 <Trash2 className="h-4 w-4 mr-1" />
//                                                 Remove
//                                             </Button>
//                                         </div>
//                                     </CardHeader>
//                                     <CardContent className="p-4 space-y-6">
//                                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                                             <div className="space-y-4">
//                                                 <div className="space-y-2">
//                                                     <Label className="flex items-center gap-1">
//                                                         Color Name
//                                                         <span className="text-red-500">*</span>
//                                                     </Label>
//                                                     <Input
//                                                         value={variant.color}
//                                                         onChange={(e) => updateColorVariant(variant.id, { color: e.target.value })}
//                                                         placeholder="e.g., Red, Blue, Black"
//                                                         disabled={loading}
//                                                     />
//                                                 </div>

//                                                 <div>
//                                                     <Label>Variant Images</Label>
//                                                     <div className="mt-2">
//                                                         <ImageUpload
//                                                             onSelectFiles={(files) => {
//                                                                 const newImages = [...variant.images, ...files]
//                                                                 updateColorVariant(variant.id, { images: newImages })
//                                                             }}
//                                                             onRemove={(index) => {
//                                                                 const newImages = variant.images.filter((_, i) => i !== index)
//                                                                 let newPrimaryIndex = variant.primaryIndex
//                                                                 if (index === variant.primaryIndex) newPrimaryIndex = 0
//                                                                 else if (index < variant.primaryIndex) newPrimaryIndex -= 1
//                                                                 updateColorVariant(variant.id, {
//                                                                     images: newImages,
//                                                                     primaryIndex: newPrimaryIndex
//                                                                 })
//                                                             }}
//                                                             onSetPrimary={(index) => updateColorVariant(variant.id, { primaryIndex: index })}
//                                                             value={variant.images}
//                                                             primaryIndex={variant.primaryIndex}
//                                                             multiple={true}
//                                                             showPreview={true}
//                                                             showLocalPreview={true}
//                                                             disabled={loading}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="space-y-4">
//                                                 <div className="flex items-center justify-between">
//                                                     <Label>Choose Sizes</Label>
//                                                     <p className="text-sm text-muted-foreground">
//                                                         {variant.sizes.length} selected
//                                                     </p>
//                                                 </div>

//                                                 <ScrollArea className="h-48 border rounded-lg p-2">
//                                                     <div className="grid grid-cols-2 gap-2">
//                                                         {sizeOptions.map(opt => {
//                                                             const checked = !!variant.sizes.find(s => s.size === opt)
//                                                             return (
//                                                                 <label
//                                                                     key={opt}
//                                                                     className={`flex items-center gap-2 p-2 border rounded transition-colors cursor-pointer ${checked ? 'border-primary bg-primary/10' : 'hover:bg-muted/50'
//                                                                         }`}
//                                                                 >
//                                                                     <Checkbox
//                                                                         checked={checked}
//                                                                         onCheckedChange={() => toggleSizeSelection(variant.id, opt)}
//                                                                         disabled={loading}
//                                                                     />
//                                                                     <span className="text-sm">{opt}</span>
//                                                                 </label>
//                                                             )
//                                                         })}
//                                                     </div>
//                                                 </ScrollArea>

//                                                 <div>
//                                                     <Label className="text-sm">Custom size for this variant</Label>
//                                                     <div className="flex gap-2 mt-1">
//                                                         <Input
//                                                             placeholder="Enter size and press Enter"
//                                                             onKeyDown={(e) => {
//                                                                 if (e.key === "Enter") {
//                                                                     e.preventDefault()
//                                                                     const txt = (e.target as HTMLInputElement).value.trim()
//                                                                     if (txt) {
//                                                                         if (!sizeOptions.includes(txt)) {
//                                                                             setSizeOptions(prev => [...prev, txt])
//                                                                         }
//                                                                         toggleSizeSelection(variant.id, txt)
//                                                                             ; (e.target as HTMLInputElement).value = ""
//                                                                     }
//                                                                 }
//                                                             }}
//                                                             disabled={loading}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             ))
//                         )}
//                     </div>

//                     {/* Size Matrix Table */}
//                     {colorVariants.length > 0 && (
//                         <Card className="shadow-sm mt-6">
//                             <CardHeader>
//                                 <CardTitle>Size Matrix</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <ScrollArea className="w-full rounded-md border">
//                                     <Table>
//                                         <TableHeader>
//                                             <TableRow>
//                                                 <TableHead className="w-24">Color</TableHead>
//                                                 <TableHead className="w-16">Size</TableHead>
//                                                 <TableHead className="w-32">SKU</TableHead>
//                                                 <TableHead className="w-28">Price +/-</TableHead>
//                                                 <TableHead className="w-24">Final Price</TableHead>
//                                                 <TableHead className="w-20">Stock</TableHead>
//                                                 {categoryAttributes.map((attr) => (
//                                                     <TableHead key={attr.name} className="min-w-[120px]">
//                                                         <div className="flex items-center gap-2">
//                                                             <TooltipProvider>
//                                                                 <Tooltip>
//                                                                     <TooltipTrigger className="truncate max-w-[100px]">
//                                                                         {attr.name}
//                                                                     </TooltipTrigger>
//                                                                     <TooltipContent>
//                                                                         <p>{attr.name}</p>
//                                                                     </TooltipContent>
//                                                                 </Tooltip>
//                                                             </TooltipProvider>
//                                                             {colorVariants[0]?.sizes[0]?.attributes[attr.name] !== undefined && (
//                                                                 <TooltipProvider>
//                                                                     <Tooltip>
//                                                                         <TooltipTrigger asChild>
//                                                                             <Button
//                                                                                 variant="ghost"
//                                                                                 size="icon"
//                                                                                 onClick={() => copyAttributeToAll(attr.name, colorVariants[0].sizes[0].attributes[attr.name])}
//                                                                             >
//                                                                                 <Copy className="h-4 w-4" />
//                                                                             </Button>
//                                                                         </TooltipTrigger>
//                                                                         <TooltipContent>
//                                                                             <p>Copy from first to all</p>
//                                                                         </TooltipContent>
//                                                                     </Tooltip>
//                                                                 </TooltipProvider>
//                                                             )}
//                                                         </div>
//                                                     </TableHead>
//                                                 ))}
//                                                 <TableHead className="w-20 text-center">Actions</TableHead>
//                                             </TableRow>
//                                         </TableHeader>
//                                         <TableBody>
//                                             {colorVariants.map((variant) =>
//                                                 variant.sizes.map((size) => (
//                                                     <TableRow key={`${variant.id}_${size.id}`}>
//                                                         <TableCell className="font-medium">
//                                                             {variant.color || "Unnamed"}
//                                                         </TableCell>
//                                                         <TableCell className="font-medium">
//                                                             {size.size}
//                                                         </TableCell>
//                                                         <TableCell>
//                                                             <Input
//                                                                 className="h-8 text-sm"
//                                                                 value={size.sku || ""}
//                                                                 onChange={(e) =>
//                                                                     updateSizeInVariant(variant.id, size.id, {
//                                                                         sku: e.target.value,
//                                                                     })
//                                                                 }
//                                                                 placeholder="SKU"
//                                                                 disabled={loading}
//                                                             />
//                                                         </TableCell>
//                                                         <TableCell>
//                                                             <Input
//                                                                 className="h-8 text-sm"
//                                                                 type="number"
//                                                                 step="0.01"
//                                                                 value={size.priceModifier || ""}
//                                                                 onChange={(e) =>
//                                                                     updateSizeInVariant(variant.id, size.id, {
//                                                                         priceModifier: parseFloat(e.target.value) || 0,
//                                                                     })
//                                                                 }
//                                                                 placeholder="0.00"
//                                                                 disabled={loading}
//                                                             />
//                                                         </TableCell>
//                                                         <TableCell className="font-medium text-green-600">
//                                                             ${(
//                                                                 (form.watch("price") || 0) +
//                                                                 (size.priceModifier || 0)
//                                                             ).toFixed(2)}
//                                                         </TableCell>
//                                                         <TableCell>
//                                                             <Input
//                                                                 className="h-8 text-sm"
//                                                                 type="number"
//                                                                 min="0"
//                                                                 value={size.stock || ""}
//                                                                 onChange={(e) =>
//                                                                     updateSizeInVariant(variant.id, size.id, {
//                                                                         stock: parseInt(e.target.value) || 0,
//                                                                     })
//                                                                 }
//                                                                 placeholder="0"
//                                                                 disabled={loading}
//                                                             />
//                                                         </TableCell>
//                                                         {categoryAttributes.map((attr) => (
//                                                             <TableCell key={attr.name}>
//                                                                 {renderAttributeInput(variant.id, size.id, attr)}
//                                                             </TableCell>
//                                                         ))}
//                                                         <TableCell className="text-center">
//                                                             <Button
//                                                                 type="button"
//                                                                 variant="destructive"
//                                                                 size="sm"
//                                                                 onClick={() => removeSizeFromVariant(variant.id, size.id)}
//                                                                 disabled={loading}
//                                                             >
//                                                                 <Trash2 className="h-3 w-3" />
//                                                             </Button>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ))
//                                             )}
//                                         </TableBody>
//                                     </Table>
//                                 </ScrollArea>
//                             </CardContent>
//                         </Card>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     )

//     const renderShippingTab = () => (
//         <Card className="shadow-sm">
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                     <Truck className="h-5 w-5" />
//                     Shipping Information
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//                 <div className="space-y-2">
//                     <Label htmlFor="weight">Weight (kg)</Label>
//                     <Input
//                         id="weight"
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         value={form.watch("shipping.weight") || ""}
//                         onChange={(e) => handleNumberChange("shipping.weight", e.target.value)}
//                         placeholder="0.00"
//                         disabled={loading}
//                     />
//                 </div>

//                 <div className="space-y-4">
//                     <Label>Dimensions (cm)</Label>
//                     <div className="grid grid-cols-3 gap-4">
//                         <div className="space-y-2">
//                             <Label className="text-sm">Length</Label>
//                             <Input
//                                 type="number"
//                                 step="0.01"
//                                 min="0"
//                                 value={form.watch("shipping.dimensions.length") || ""}
//                                 onChange={(e) => handleNumberChange("shipping.dimensions.length", e.target.value)}
//                                 placeholder="0.00"
//                                 disabled={loading}
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Label className="text-sm">Width</Label>
//                             <Input
//                                 type="number"
//                                 step="0.01"
//                                 min="0"
//                                 value={form.watch("shipping.dimensions.width") || ""}
//                                 onChange={(e) => handleNumberChange("shipping.dimensions.width", e.target.value)}
//                                 placeholder="0.00"
//                                 disabled={loading}
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Label className="text-sm">Height</Label>
//                             <Input
//                                 type="number"
//                                 step="0.01"
//                                 min="0"
//                                 value={form.watch("shipping.dimensions.height") || ""}
//                                 onChange={(e) => handleNumberChange("shipping.dimensions.height", e.target.value)}
//                                 placeholder="0.00"
//                                 disabled={loading}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {form.watch("shipping.weight") && form.watch("shipping.dimensions.length") &&
//                     form.watch("shipping.dimensions.width") && form.watch("shipping.dimensions.height") && (
//                         <div className="p-4 bg-muted rounded-lg shadow-inner">
//                             <Label className="text-sm font-medium">Package Info</Label>
//                             <div className="grid grid-cols-2 gap-4 mt-2">
//                                 <div>
//                                     <p className="text-sm text-muted-foreground">Total Weight</p>
//                                     <p className="font-medium">{form.watch("shipping.weight")} kg</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-muted-foreground">Dimensions</p>
//                                     <p className="font-medium">
//                                         {form.watch("shipping.dimensions.length")} × {form.watch("shipping.dimensions.width")} × {form.watch("shipping.dimensions.height")} cm
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//             </CardContent>
//         </Card>
//     )

//     const renderSEOTab = () => (
//         <Card className="shadow-sm">
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                     <Search className="h-5 w-5" />
//                     SEO Optimization
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//                 <div className="space-y-2">
//                     <Label htmlFor="seo_title">SEO Title</Label>
//                     <Input
//                         id="seo_title"
//                         {...form.register("seo.title")}
//                         placeholder="Enter SEO title (recommended: 50-60 characters)"
//                         disabled={loading}
//                     />
//                     <p className="text-sm text-muted-foreground">
//                         Current length: {form.watch("seo.title")?.length || 0}/60 characters
//                     </p>
//                 </div>

//                 <div className="space-y-2">
//                     <Label htmlFor="seo_description">SEO Description</Label>
//                     <Textarea
//                         id="seo_description"
//                         {...form.register("seo.description")}
//                         placeholder="Enter SEO meta description (recommended: 150-160 characters)"
//                         rows={3}
//                         disabled={loading}
//                     />
//                     <p className="text-sm text-muted-foreground">
//                         Current length: {form.watch("seo.description")?.length || 0}/160 characters
//                     </p>
//                 </div>

//                 <div className="space-y-4">
//                     <Label>SEO Keywords</Label>
//                     <div className="flex gap-2">
//                         <Input
//                             value={newKeyword}
//                             onChange={(e) => setNewKeyword(e.target.value)}
//                             placeholder="Add keyword"
//                             onKeyDown={(e) => {
//                                 if (e.key === "Enter") {
//                                     e.preventDefault()
//                                     addKeyword()
//                                 }
//                             }}
//                             disabled={loading}
//                             className="flex-1"
//                         />
//                         <Button
//                             type="button"
//                             onClick={addKeyword}
//                             variant="outline"
//                             disabled={loading || !newKeyword.trim()}
//                         >
//                             <Plus className="h-4 w-4" />
//                         </Button>
//                     </div>
//                     {seoKeywords.length > 0 && (
//                         <div className="flex flex-wrap gap-2">
//                             {seoKeywords.map((keyword, index) => (
//                                 <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
//                                     {keyword}
//                                     <Button
//                                         type="button"
//                                         variant="ghost"
//                                         size="sm"
//                                         className="h-auto p-0 ml-2"
//                                         onClick={() => removeKeyword(keyword)}
//                                     >
//                                         <X className="h-3 w-3" />
//                                     </Button>
//                                 </Badge>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 <div className="p-4 border rounded-lg bg-muted/20 shadow-inner">
//                     <Label className="text-sm font-medium">Search Preview</Label>
//                     <div className="mt-2 space-y-1">
//                         <div className="text-blue-600 text-lg font-medium truncate">
//                             {form.watch("seo.title") || form.watch("name") || "Your Product Title"}
//                         </div>
//                         <div className="text-green-600 text-sm">
//                             yoursite.com/products/{form.watch("name")?.toLowerCase().replace(/\s+/g, "-") || "product-name"}
//                         </div>
//                         <div className="text-gray-600 text-sm line-clamp-2">
//                             {form.watch("seo.description") || form.watch("description") || "Product description will appear here..."}
//                         </div>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )

//     const renderAdvancedTab = () => (
//         <div className="space-y-6">
//             <Card className="shadow-sm">
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <Settings className="h-5 w-5" />
//                         Product Settings
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                     <div className="space-y-2">
//                         <Label htmlFor="visibility">Product Visibility</Label>
//                         <Select
//                             value={form.watch("visibility")}
//                             onValueChange={(value) => form.setValue("visibility", value as any)}
//                             disabled={loading}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="public">
//                                     <div className="flex items-center gap-2">
//                                         <Eye className="h-4 w-4" />
//                                         Public - Visible to everyone
//                                     </div>
//                                 </SelectItem>
//                                 <SelectItem value="private">
//                                     <div className="flex items-center gap-2">
//                                         <EyeOff className="h-4 w-4" />
//                                         Private - Only visible to admins
//                                     </div>
//                                 </SelectItem>
//                                 <SelectItem value="hidden">
//                                     <div className="flex items-center gap-2">
//                                         <EyeOff className="h-4 w-4" />
//                                         Hidden - Not visible anywhere
//                                     </div>
//                                 </SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <Separator />

//                     <div className="space-y-4">
//                         <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
//                             <div>
//                                 <Label>Active Status</Label>
//                                 <p className="text-sm text-muted-foreground">Make this product available for purchase</p>
//                             </div>
//                             <Switch
//                                 checked={form.watch("is_active")}
//                                 onCheckedChange={(checked) => form.setValue("is_active", checked)}
//                                 disabled={loading}
//                             />
//                         </div>

//                         <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
//                             <div>
//                                 <Label>Featured Product</Label>
//                                 <p className="text-sm text-muted-foreground">Show this product in featured sections</p>
//                             </div>
//                             <Switch
//                                 checked={form.watch("is_featured")}
//                                 onCheckedChange={(checked) => form.setValue("is_featured", checked)}
//                                 disabled={loading}
//                             />
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>

//             <Card className="shadow-sm">
//                 <CardHeader>
//                     <CardTitle>Product Summary</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label className="text-sm text-muted-foreground">Product Name</Label>
//                             <p className="font-medium truncate">{form.watch("name") || "Not set"}</p>
//                         </div>
//                         <div className="space-y-2">
//                             <Label className="text-sm text-muted-foreground">Category</Label>
//                             <p className="font-medium truncate">
//                                 {allCategories.find(cat => cat._id === form.watch("category"))?.display_name || "Not selected"}
//                             </p>
//                         </div>
//                         <div className="space-y-2">
//                             <Label className="text-sm text-muted-foreground">Price</Label>
//                             <p className="font-medium">${form.watch("price").toFixed(2) || "0.00"}</p>
//                         </div>
//                         <div className="space-y-2">
//                             <Label className="text-sm text-muted-foreground">Stock Quantity</Label>
//                             <p className="font-medium">{form.watch("stock.quantity") || 0}</p>
//                         </div>
//                         <div className="space-y-2">
//                             <Label className="text-sm text-muted-foreground">Variants</Label>
//                             <p className="font-medium">{colorVariants.length} color variants</p>
//                         </div>
//                         <div className="space-y-2">
//                             <Label className="text-sm text-muted-foreground">Images</Label>
//                             <p className="font-medium">{mainImages.length}</p>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     )

//     return (
//         <div className="min-h-screen bg-background">
//             <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
//                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex items-center justify-between h-16">
//                         <div className="flex items-center gap-4">
//                             <h1 className="text-xl font-semibold">{id ? "Edit Product" : "Add Product"}</h1>
//                         </div>
//                         <div className="flex items-center gap-3">
//                             <Button
//                                 variant="outline"
//                                 onClick={() => router.push("/products")}
//                                 disabled={loading}
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 onClick={form.handleSubmit(onSubmit)}
//                                 disabled={loading}
//                                 className="flex items-center gap-2"
//                             >
//                                 {loading && <Loader2 className="h-4 w-4 animate-spin" />}
//                                 <Save className="h-4 w-4" />
//                                 {id ? "Update Product" : "Add Product"}
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
//                 <form
//                     onSubmit={form.handleSubmit(onSubmit)}
//                     className="space-y-8"
//                 >
//                     <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                         <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 bg-muted/50 p-1 rounded-lg">
//                             <TabsTrigger value="basic" className="flex items-center gap-2">
//                                 <Info className="h-4 w-4" />
//                                 <span className="hidden md:inline">Basic</span>
//                             </TabsTrigger>
//                             <TabsTrigger value="color-variants" className="flex items-center gap-2">
//                                 <Tag className="h-4 w-4" />
//                                 <span className="hidden md:inline">Variants</span>
//                             </TabsTrigger>
//                             <TabsTrigger value="pricing" className="flex items-center gap-2">
//                                 <DollarSign className="h-4 w-4" />
//                                 <span className="hidden md:inline">Pricing</span>
//                             </TabsTrigger>
//                             <TabsTrigger value="inventory" className="flex items-center gap-2">
//                                 <BarChart3 className="h-4 w-4" />
//                                 <span className="hidden md:inline">Inventory</span>
//                             </TabsTrigger>
//                             <TabsTrigger value="shipping" className="flex items-center gap-2">
//                                 <Truck className="h-4 w-4" />
//                                 <span className="hidden md:inline">Shipping</span>
//                             </TabsTrigger>
//                             <TabsTrigger value="seo" className="flex items-center gap-2">
//                                 <Search className="h-4 w-4" />
//                                 <span className="hidden md:inline">SEO</span>
//                             </TabsTrigger>
//                             <TabsTrigger value="advanced" className="flex items-center gap-2">
//                                 <Settings className="h-4 w-4" />
//                                 <span className="hidden md:inline">Advanced</span>
//                             </TabsTrigger>
//                         </TabsList>
//                         <div className="mt-8">
//                             <TabsContent value="basic">{renderBasicTab()}</TabsContent>
//                             <TabsContent value="color-variants">{renderColorVariantsTab()}</TabsContent>
//                             <TabsContent value="pricing">{renderPricingTab()}</TabsContent>
//                             <TabsContent value="inventory">{renderInventoryTab()}</TabsContent>
//                             <TabsContent value="shipping">{renderShippingTab()}</TabsContent>
//                             <TabsContent value="seo">{renderSEOTab()}</TabsContent>
//                             <TabsContent value="advanced">{renderAdvancedTab()}</TabsContent>
//                         </div>
//                     </Tabs>
//                 </form>
//             </div>
//         </div>
//     )
// }

