// import { useCallback, useState } from "react"
// import { UseFormReturn } from "react-hook-form"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Package, ImageIcon, Tag, Plus, X } from 'lucide-react'

// import { RichTextEditor } from "@/components/ui/rich-text-editor"
// import ImageUpload from "@/components/shared/image-upload"
// import { iProductFormData } from "@/models/StoreAdmin/product.model"
// import { iCategory } from "@/models/StoreAdmin/category.model"

// interface BasicTabProps {
//     form: UseFormReturn<iProductFormData>
//     loading: boolean
//     allCategories: iCategory[]
//     mainImages: (File | string)[]
//     mainPrimaryIndex: number
//     tags: string[]
//     setMainImages: (images: (File | string)[]) => void
//     setMainPrimaryIndex: (index: number) => void
//     setTags: (tags: string[]) => void
//     handleNumberChange: (field: string, value: string) => void
// }

// export default function BasicTab({
//     form,
//     loading,
//     allCategories,
//     mainImages,
//     mainPrimaryIndex,
//     tags,
//     setMainImages,
//     setMainPrimaryIndex,
//     setTags,
//     handleNumberChange
// }: BasicTabProps) {
//     const [newTag, setNewTag] = useState("")

//     // Main image handling
//     const handleMainImageSelect = useCallback((files: File[]) => {
//         setMainImages((prev) => [...prev, ...files])
//     }, [setMainImages])

//     const handleMainImageRemove = useCallback((index: number) => {
//         setMainImages((prev) => prev.filter((_, i) => i !== index))
//         setMainPrimaryIndex(prev => (index === prev ? 0 : prev > index ? prev - 1 : prev))
//     }, [setMainImages, setMainPrimaryIndex])

//     const handleMainSetPrimaryImage = useCallback((index: number) => {
//         setMainPrimaryIndex(index)
//     }, [setMainPrimaryIndex])

//     // Tag management
//     const addTag = useCallback(() => {
//         const trimmed = newTag.trim()
//         if (trimmed && !tags.includes(trimmed)) {
//             setTags(prev => [...prev, trimmed])
//             setNewTag("")
//         }
//     }, [newTag, tags, setTags])

//     const removeTag = useCallback((tag: string) => {
//         setTags((prev: any) => prev.filter(t => t !== tag))
//     }, [setTags])

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
//                                 disabled={loading}
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
//                                 <Label htmlFor="GST">GST</Label>
//                                 <Input
//                                     id="GST"
//                                     {...form.register("GST")}
//                                     placeholder="Enter GST %"
//                                     disabled={loading}
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="HSNCode">HSN Code</Label>
//                                 <Input
//                                     id="HSNCode"
//                                     {...form.register("HSNCode")}
//                                     placeholder="Enter product HSN code"
//                                     disabled={loading}
//                                 />
//                             </div>
//                         </div>

//                         <div className="space-y-2">
//                             <RichTextEditor
//                                 label="Description"
//                                 value={form.watch("description") || ""}
//                                 onChange={(value) => form.setValue("description", value)}
//                                 placeholder="Describe your product in detail..."
//                                 disabled={loading}
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
//                             disabled={loading}
//                             showLocalPreview={true}
//                         />
//                     </CardContent>
//                 </Card>
//             </div>

//             <Card>
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
//                             onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
//                             disabled={loading}
//                         />
//                         <Button type="button" onClick={addTag} variant="outline" disabled={loading}>
//                             <Plus className="h-4 w-4" />
//                         </Button>
//                     </div>
//                     {tags.length > 0 && (
//                         <div className="flex flex-wrap gap-2">
//                             {tags.map((tag, index) => (
//                                 <Badge key={index} variant="secondary" className="flex items-center gap-1">
//                                     {tag}
//                                     <X
//                                         className="h-3 w-3 cursor-pointer"
//                                         onClick={() => removeTag(tag)}
//                                     />
//                                 </Badge>
//                             ))}
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }