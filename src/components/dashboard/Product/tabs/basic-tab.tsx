// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { RichTextEditor } from "@/components/ui/rich-text-editor"
// import ImageUpload from "@/components/shared/image-upload"
// import { Package, ImageIcon, Tag } from 'lucide-react'
// import { UseFormReturn } from "react-hook-form"
// import { iProductFormData } from "@/models/StoreAdmin/product.model"
// import { iCategory, iStoreCategory } from "@/models/StoreAdmin/category.model"
// import TagsSection from "../sections/TagsSection"
// import { useCallback, useState } from "react"

// interface BasicTabProps {
//     form: UseFormReturn<iProductFormData>
//     allCategories: iStoreCategory[]
//     loading: boolean
//     isSubmitting: boolean
// }

// export default function BasicTab({ form, allCategories, loading, isSubmitting }: BasicTabProps) {
//     const [mainImages, setMainImages] = useState<(File | string)[]>([])
//     const [mainPrimaryIndex, setMainPrimaryIndex] = useState(0)

//     // Handle image uploads
//     const handleMainImageSelect = useCallback((files: File[]) => {
//         setMainImages(prev => [...prev, ...files])
//     }, [])

//     const handleMainImageRemove = useCallback((index: number) => {
//         setMainImages(prev => prev.filter((_, i) => i !== index))
//         setMainPrimaryIndex(prev => (index === prev ? 0 : prev > index ? prev - 1 : prev))
//     }, [])

//     const handleMainSetPrimaryImage = useCallback((index: number) => {
//         setMainPrimaryIndex(index)
//     }, [])

//     return (
//         <div className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <Package className="h-5 w-5" />
//                             Product Details
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="name">Product Name *</Label>
//                             <Input
//                                 id="name"
//                                 {...form.register("name", { required: "Product name is required" })}
//                                 placeholder="Enter product name"
//                                 disabled={loading || isSubmitting}
//                             />
//                             {form.formState.errors.name && (
//                                 <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="category">Category</Label>
//                             <Select
//                                 value={form.watch("category") || ""}
//                                 onValueChange={(value) => form.setValue("category", value)}
//                                 disabled={loading || isSubmitting}
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
//                                     disabled={loading || isSubmitting}
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="sku">SKU</Label>
//                                 <Input
//                                     id="sku"
//                                     {...form.register("sku")}
//                                     placeholder="Enter product SKU"
//                                     disabled={loading || isSubmitting}
//                                 />
//                             </div>
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                                 <Label htmlFor="GST">GST</Label>
//                                 <Input
//                                     id="GST"
//                                     {...form.register("GST")}
//                                     placeholder="Enter GST %"
//                                     disabled={loading || isSubmitting}
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="HSNCode">HSN Code</Label>
//                                 <Input
//                                     id="HSNCode"
//                                     {...form.register("HSNCode")}
//                                     placeholder="Enter product HSN code"
//                                     disabled={loading || isSubmitting}
//                                 />
//                             </div>
//                         </div>

//                         <div className="space-y-2">
//                             <RichTextEditor
//                                 label="Description"
//                                 value={form.watch("description") || ""}
//                                 onChange={(value) => form.setValue("description", value)}
//                                 placeholder="Describe your product in detail..."
//                                 disabled={loading || isSubmitting}
//                             />
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card>
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
//                             disabled={loading || isSubmitting}
//                             showLocalPreview={true}
//                         />
//                     </CardContent>
//                 </Card>
//             </div>

//             <TagsSection
//                 form={form}
//                 loading={loading}
//                 isSubmitting={isSubmitting}
//             />
//         </div>
//     )
// }