// "use client";

// import type React from "react";
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Plus,
//   X,
//   Trash2,
//   Loader2,
//   ArrowLeft,
//   Info,
//   CheckCircle2,
//   AlertCircle,
//   Image as ImageIcon,
//   Settings,
//   Filter,
//   Tag
// } from "lucide-react";

// import ImageUpload from "@/components/shared/image-upload";
// import { useGlobalCategoryStore } from "@/store/SuperAdmin/GlobleCategoryStore";
// import { toast } from "sonner";

// // Interfaces based on Globe Category model
// interface FilterOption {
//   name: string;
//   type: "text" | "number" | "range" | "select" | "multiselect" | "boolean";
//   options: string[];
//   is_required: boolean;
// }

// interface AttributeOption {
//   name: string;
//   type: "text" | "number" | "boolean";
//   is_required: boolean;
//   default_value?: string;
// }

// interface GlobeCategoryFormData {
//   name: string;
//   slug: string;
//   image_url?: string;
//   config: {
//     filters: FilterOption[];
//     attributes: AttributeOption[];
//   };
//   tag_schema: string[];
//   is_active: boolean;
// }

// interface AddEditCategoryPageProps {
//   categoryId?: string;
// }

// export default function AddEditCategoryPage({ categoryId }: AddEditCategoryPageProps) {
//   const router = useRouter();
//   const formRef = useRef<HTMLFormElement>(null);
//   const {
//     createCategory,
//     updateCategory,
//     categories,
//     fetchCategories,
//     loading,
//   } = useGlobalCategoryStore();

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);
//   const [newFilterOption, setNewFilterOption] = useState("");
//   const [activeTab, setActiveTab] = useState("basic");
//   const [imageUploading, setImageUploading] = useState(false);
//   const [newTag, setNewTag] = useState("");

//   const [newFilter, setNewFilter] = useState<FilterOption>({
//     name: "",
//     type: "text",
//     options: [],
//     is_required: false,
//   });

//   const [newAttribute, setNewAttribute] = useState<AttributeOption>({
//     name: "",
//     type: "text",
//     is_required: false,
//     default_value: "",
//   });

//   const [formData, setFormData] = useState<GlobeCategoryFormData>({
//     name: "",
//     slug: "",
//     image_url: "",
//     config: {
//       filters: [],
//       attributes: [],
//     },
//     tag_schema: [],
//     is_active: true,
//   });

//   // Fetch category data if editing
//   useEffect(() => {
//     fetchCategories();
//     if (categoryId) {
//       const category = categories.find(cat => cat._id === categoryId);
//       if (category) {
//         setFormData({
//           name: category.name || "",
//           slug: category.slug || "",
//           image_url: category.image_url || "",
//           config: {
//             filters: category.config?.filters || [],
//             attributes: category.config?.attributes || [],
//           },
//           tag_schema: category.tag_schema || [],
//           is_active: category.is_active !== false,
//         });
//       }
//     }
//   }, [categoryId, fetchCategories, categories]);

//   const uploadToCloudinary = async (file: File): Promise<string> => {
//     setImageUploading(true);
//     try {
//       const formDataUpload = new FormData();
//       formDataUpload.append("file", file);
//       formDataUpload.append(
//         "upload_preset",
//         process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "BizzPocket",
//       );
//       formDataUpload.append("folder", "global_categories");

//       const res = await fetch(
//         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//         {
//           method: "POST",
//           body: formDataUpload,
//         },
//       );

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.error?.message || "Image upload failed");
//       }

//       const data = await res.json();
//       return data.secure_url;
//     } finally {
//       setImageUploading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.name.trim()) {
//       toast.error("Category name is required");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       let uploadedImageUrl = formData.image_url;

//       // Upload image if selected
//       if (selectedImages.length > 0) {
//         toast.info("Uploading category image...");
//         uploadedImageUrl = await uploadToCloudinary(selectedImages[0]);
//         toast.success("Image uploaded successfully");
//       }

//       const categoryData = {
//         name: formData.name.trim(),
//         slug: formData.slug || formData.name.toLowerCase().trim().replace(/\s+/g, '-'),
//         image_url: uploadedImageUrl,
//         config: {
//           filters: formData.config.filters,
//           attributes: formData.config.attributes,
//         },
//         tag_schema: formData.tag_schema,
//         is_active: formData.is_active,
//       };

//       if (categoryId) {
//         await updateCategory(categoryId, categoryData);
//         toast.success("Category updated successfully");
//       } else {
//         await createCategory(categoryData);
//         toast.success("Category created successfully");
//       }

//       router.push("/super-admin/categories");
//       router.refresh();

//     } catch (error: any) {
//       toast.error(
//         error.message ||
//         (categoryId
//           ? "Failed to update category"
//           : "Failed to create category"),
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAddFilterOption = () => {
//     if (
//       newFilterOption.trim() &&
//       !newFilter.options.includes(newFilterOption.trim())
//     ) {
//       setNewFilter((prev) => ({
//         ...prev,
//         options: [...prev.options, newFilterOption.trim()],
//       }));
//       setNewFilterOption("");
//     }
//   };

//   const handleRemoveFilterOption = (option: string) => {
//     setNewFilter((prev) => ({
//       ...prev,
//       options: prev.options.filter((o) => o !== option),
//     }));
//   };

//   const handleAddFilter = () => {
//     if (newFilter.name.trim()) {
//       setFormData((prev) => ({
//         ...prev,
//         config: {
//           ...prev.config,
//           filters: [...prev.config.filters, { ...newFilter }],
//         },
//       }));
//       setNewFilter({
//         name: "",
//         type: "text",
//         options: [],
//         is_required: false,
//       });
//       toast.success("Filter added successfully");
//     }
//   };

//   const handleRemoveFilter = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       config: {
//         ...prev.config,
//         filters: prev.config.filters.filter((_, i) => i !== index),
//       },
//     }));
//     toast.info("Filter removed");
//   };

//   const handleAddAttribute = () => {
//     if (newAttribute.name.trim()) {
//       setFormData((prev) => ({
//         ...prev,
//         config: {
//           ...prev.config,
//           attributes: [...prev.config.attributes, { ...newAttribute }],
//         },
//       }));
//       setNewAttribute({
//         name: "",
//         type: "text",
//         is_required: false,
//         default_value: "",
//       });
//       toast.success("Attribute added successfully");
//     }
//   };

//   const handleRemoveAttribute = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       config: {
//         ...prev.config,
//         attributes: prev.config.attributes.filter((_, i) => i !== index),
//       },
//     }));
//     toast.info("Attribute removed");
//   };

//   const handleAddTag = () => {
//     if (newTag.trim() && !formData.tag_schema.includes(newTag.trim())) {
//       setFormData((prev) => ({
//         ...prev,
//         tag_schema: [...prev.tag_schema, newTag.trim()],
//       }));
//       setNewTag("");
//       toast.success("Tag added successfully");
//     }
//   };

//   const handleRemoveTag = (tag: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       tag_schema: prev.tag_schema.filter((t) => t !== tag),
//     }));
//     toast.info("Tag removed");
//   };

//   const handleImageSelect = (files: File[]) => {
//     setSelectedImages(files.slice(0, 1)); // Only allow one image for categories
//   };

//   const handleImageRemove = () => {
//     setSelectedImages([]);
//     setFormData((prev) => ({ ...prev, image_url: "" }));
//   };

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       <div className="flex items-center justify-between gap-4">
//         <div className="flex items-center gap-4">
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => router.push("/super-admin/categories")}
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <h1 className="text-3xl font-bold tracking-tight">
//             {categoryId ? "Edit Category" : "Create New Category"}
//           </h1>
//         </div>
//         <Button
//           onClick={() => formRef.current?.requestSubmit()}
//           disabled={isSubmitting || loading}
//           size="lg"
//           className="min-w-[180px]"
//         >
//           {isSubmitting ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               {categoryId ? "Updating..." : "Creating..."}
//             </>
//           ) : categoryId ? "Update Category" : "Create Category"}
//         </Button>
//       </div>

//       <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-4 mb-6">
//             <TabsTrigger value="basic" className="flex items-center gap-2">
//               <Info className="h-4 w-4" />
//               Basic Info
//             </TabsTrigger>
//             <TabsTrigger value="tags" className="flex items-center gap-2">
//               <Tag className="h-4 w-4" />
//               Tags
//             </TabsTrigger>
//             <TabsTrigger value="filters" className="flex items-center gap-2">
//               <Filter className="h-4 w-4" />
//               Filters
//             </TabsTrigger>
//             <TabsTrigger value="attributes" className="flex items-center gap-2">
//               <Settings className="h-4 w-4" />
//               Attributes
//             </TabsTrigger>
//           </TabsList>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Main content */}
//             <div className="lg:col-span-2 space-y-6">
//               <TabsContent value="basic" className="m-0 space-y-6">
//                 <Card>
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-xl">Basic Information</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="name">
//                           Category Name <span className="text-red-500">*</span>
//                         </Label>
//                         <Input
//                           id="name"
//                           value={formData.name}
//                           onChange={(e) =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               name: e.target.value,
//                               slug: e.target.value.toLowerCase().trim().replace(/\s+/g, '-') || formData.slug,
//                             }))
//                           }
//                           placeholder="Enter category name"
//                           required
//                           disabled={loading}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="slug">Slug</Label>
//                         <Input
//                           id="slug"
//                           value={formData.slug}
//                           onChange={(e) =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               slug: e.target.value,
//                             }))
//                           }
//                           placeholder="Auto-generated from name"
//                           disabled={loading}
//                         />
//                         <p className="text-xs text-muted-foreground">
//                           URL-friendly identifier for the category
//                         </p>
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <Label>Category Image</Label>
//                         {imageUploading && (
//                           <div className="flex items-center text-sm text-muted-foreground">
//                             <Loader2 className="h-3 w-3 animate-spin mr-1" />
//                             Uploading...
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex flex-col gap-3">
//                         <ImageUpload
//                           value={selectedImages}
//                           onSelectFiles={handleImageSelect}
//                           onRemove={handleImageRemove}
//                           disabled={isSubmitting || loading}
//                           multiple={false}
//                           showPreview={true}
//                           showLocalPreview={true}
//                         />
//                         {formData.image_url && selectedImages.length === 0 && (
//                           <div className="flex flex-col gap-2">
//                             <p className="text-xs text-muted-foreground">
//                               Current image:
//                             </p>
//                             <div className="flex items-center gap-3">
//                               <img
//                                 src={formData.image_url}
//                                 alt="Current category image"
//                                 className="h-16 w-16 rounded object-cover border"
//                               />
//                               <Button
//                                 type="button"
//                                 variant="destructive"
//                                 size="sm"
//                                 onClick={handleImageRemove}
//                                 disabled={loading}
//                               >
//                                 Remove Image
//                               </Button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="tags" className="m-0">
//                 <Card>
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-xl">Category Tags</CardTitle>
//                     <p className="text-sm text-muted-foreground">
//                       Add tags to categorize and organize your categories
//                     </p>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {formData.tag_schema.length > 0 ? (
//                       <div className="flex flex-wrap gap-2">
//                         {formData.tag_schema.map((tag, index) => (
//                           <Badge
//                             key={index}
//                             variant="secondary"
//                             className="px-3 py-1 flex items-center gap-1 cursor-pointer"
//                             onClick={() => handleRemoveTag(tag)}
//                           >
//                             {tag}
//                             <X className="h-3 w-3" />
//                           </Badge>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-8 border rounded-lg bg-muted/10">
//                         <Tag className="h-10 w-10 mx-auto text-muted-foreground" />
//                         <p className="text-muted-foreground mt-2">
//                           No tags added yet
//                         </p>
//                         <p className="text-sm text-muted-foreground mt-1">
//                           Add tags to categorize and organize your categories
//                         </p>
//                       </div>
//                     )}

//                     <Separator className="my-6" />

//                     <div className="space-y-4 border rounded-lg p-4 bg-muted/5">
//                       <h4 className="font-medium">Add New Tag</h4>
//                       <div className="flex gap-2">
//                         <Input
//                           value={newTag}
//                           onChange={(e) => setNewTag(e.target.value)}
//                           placeholder="Enter tag name"
//                           onKeyDown={(e) =>
//                             e.key === "Enter" &&
//                             (e.preventDefault(), handleAddTag())
//                           }
//                           disabled={loading}
//                         />
//                         <Button
//                           type="button"
//                           onClick={handleAddTag}
//                           disabled={!newTag.trim() || loading}
//                         >
//                           Add Tag
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="filters" className="m-0">
//                 <Card>
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-xl">Category Filters</CardTitle>
//                     <p className="text-sm text-muted-foreground">
//                       Add filters to help customers narrow down stores in this category
//                     </p>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {formData.config.filters.length > 0 ? (
//                       <ScrollArea className="h-[300px] pr-4">
//                         <div className="space-y-3">
//                           {formData.config.filters.map((filter, index) => (
//                             <div key={index} className="border rounded-lg p-4 bg-muted/5">
//                               <div className="flex items-center justify-between mb-2">
//                                 <h4 className="font-medium">{filter.name}</h4>
//                                 <div className="flex items-center gap-2">
//                                   <Badge variant="outline">{filter.type}</Badge>
//                                   {filter.is_required && (
//                                     <Badge variant="secondary">Required</Badge>
//                                   )}
//                                   <Button
//                                     type="button"
//                                     variant="ghost"
//                                     size="icon"
//                                     className="h-8 w-8"
//                                     onClick={() => handleRemoveFilter(index)}
//                                     disabled={loading}
//                                   >
//                                     <Trash2 className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               </div>
//                               {filter.options.length > 0 && (
//                                 <div className="flex flex-wrap gap-1 mt-2">
//                                   {filter.options.map((option, optIndex) => (
//                                     <Badge
//                                       key={optIndex}
//                                       variant="outline"
//                                       className="text-xs"
//                                     >
//                                       {option}
//                                     </Badge>
//                                   ))}
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </ScrollArea>
//                     ) : (
//                       <div className="text-center py-8 border rounded-lg bg-muted/10">
//                         <Filter className="h-10 w-10 mx-auto text-muted-foreground" />
//                         <p className="text-muted-foreground mt-2">
//                           No filters added yet
//                         </p>
//                         <p className="text-sm text-muted-foreground mt-1">
//                           Add filters to help customers narrow down stores in this category
//                         </p>
//                       </div>
//                     )}

//                     <Separator className="my-6" />

//                     <div className="space-y-4 border rounded-lg p-4 bg-muted/5">
//                       <h4 className="font-medium">Add New Filter</h4>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label>Filter Name</Label>
//                           <Input
//                             value={newFilter.name}
//                             onChange={(e) =>
//                               setNewFilter((prev) => ({
//                                 ...prev,
//                                 name: e.target.value,
//                               }))
//                             }
//                             placeholder="e.g., Price Range, Location"
//                             disabled={loading}
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label>Filter Type</Label>
//                           <Select
//                             value={newFilter.type}
//                             onValueChange={(value) =>
//                               setNewFilter((prev) => ({
//                                 ...prev,
//                                 type: value as FilterOption["type"]
//                               }))
//                             }
//                             disabled={loading}
//                           >
//                             <SelectTrigger>
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="text">Text</SelectItem>
//                               <SelectItem value="number">Number</SelectItem>
//                               <SelectItem value="range">Range</SelectItem>
//                               <SelectItem value="select">Select</SelectItem>
//                               <SelectItem value="multiselect">Multi-Select</SelectItem>
//                               <SelectItem value="boolean">Boolean</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>

//                       {(newFilter.type === "select" ||
//                         newFilter.type === "multiselect") && (
//                           <div className="space-y-2">
//                             <Label>Filter Options</Label>
//                             <div className="flex gap-2">
//                               <Input
//                                 value={newFilterOption}
//                                 onChange={(e) =>
//                                   setNewFilterOption(e.target.value)
//                                 }
//                                 placeholder="Add option"
//                                 onKeyDown={(e) =>
//                                   e.key === "Enter" &&
//                                   (e.preventDefault(), handleAddFilterOption())
//                                 }
//                                 disabled={loading}
//                               />
//                               <Button
//                                 type="button"
//                                 size="icon"
//                                 onClick={handleAddFilterOption}
//                                 disabled={loading || !newFilterOption.trim()}
//                               >
//                                 <Plus className="h-4 w-4" />
//                               </Button>
//                             </div>
//                             {newFilter.options.length > 0 && (
//                               <div className="flex flex-wrap gap-1 mt-2">
//                                 {newFilter.options.map((option, index) => (
//                                   <Badge
//                                     key={index}
//                                     variant="secondary"
//                                     className="cursor-pointer px-2 py-1 flex items-center gap-1"
//                                     onClick={() => handleRemoveFilterOption(option)}
//                                   >
//                                     <span className="max-w-[100px] truncate">
//                                       {option}
//                                     </span>
//                                     <X className="h-3 w-3" />
//                                   </Badge>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         )}

//                       <div className="flex items-center justify-between pt-2">
//                         <div className="flex items-center gap-2">
//                           <Switch
//                             checked={newFilter.is_required}
//                             onCheckedChange={(checked) =>
//                               setNewFilter((prev) => ({
//                                 ...prev,
//                                 is_required: checked,
//                               }))
//                             }
//                             disabled={loading}
//                           />
//                           <Label>Required Filter</Label>
//                         </div>
//                         <Button
//                           type="button"
//                           onClick={handleAddFilter}
//                           disabled={!newFilter.name.trim() || loading}
//                         >
//                           Add Filter
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="attributes" className="m-0">
//                 <Card>
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-xl">Category Attributes</CardTitle>
//                     <p className="text-sm text-muted-foreground">
//                       Add attributes to define store characteristics in this category
//                     </p>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {formData.config.attributes.length > 0 ? (
//                       <ScrollArea className="h-[300px] pr-4">
//                         <div className="space-y-3">
//                           {formData.config.attributes.map((attr, index) => (
//                             <div key={index} className="border rounded-lg p-4 bg-muted/5">
//                               <div className="flex items-center justify-between mb-2">
//                                 <h4 className="font-medium">{attr.name}</h4>
//                                 <div className="flex items-center gap-2">
//                                   <Badge variant="outline">{attr.type}</Badge>
//                                   {attr.is_required && (
//                                     <Badge variant="secondary">Required</Badge>
//                                   )}
//                                   <Button
//                                     type="button"
//                                     variant="ghost"
//                                     size="icon"
//                                     className="h-8 w-8"
//                                     onClick={() => handleRemoveAttribute(index)}
//                                     disabled={loading}
//                                   >
//                                     <Trash2 className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               </div>
//                               {attr.default_value && (
//                                 <p className="text-sm text-muted-foreground mt-1">
//                                   Default: {attr.default_value}
//                                 </p>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </ScrollArea>
//                     ) : (
//                       <div className="text-center py-8 border rounded-lg bg-muted/10">
//                         <Settings className="h-10 w-10 mx-auto text-muted-foreground" />
//                         <p className="text-muted-foreground mt-2">
//                           No attributes added yet
//                         </p>
//                         <p className="text-sm text-muted-foreground mt-1">
//                           Add attributes to define store characteristics in this category
//                         </p>
//                       </div>
//                     )}

//                     <Separator className="my-6" />

//                     <div className="space-y-4 border rounded-lg p-4 bg-muted/5">
//                       <h4 className="font-medium">Add New Attribute</h4>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label>Attribute Name</Label>
//                           <Input
//                             value={newAttribute.name}
//                             onChange={(e) =>
//                               setNewAttribute((prev) => ({
//                                 ...prev,
//                                 name: e.target.value,
//                               }))
//                             }
//                             placeholder="e.g., Opening Hours, Service Type"
//                             disabled={loading}
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label>Attribute Type</Label>
//                           <Select
//                             value={newAttribute.type}
//                             onValueChange={(value) =>
//                               setNewAttribute((prev) => ({
//                                 ...prev,
//                                 type: value as AttributeOption["type"]
//                               }))
//                             }
//                             disabled={loading}
//                           >
//                             <SelectTrigger>
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="text">Text</SelectItem>
//                               <SelectItem value="number">Number</SelectItem>
//                               <SelectItem value="boolean">Boolean</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label>Default Value (Optional)</Label>
//                         <Input
//                           value={newAttribute.default_value}
//                           onChange={(e) =>
//                             setNewAttribute((prev) => ({
//                               ...prev,
//                               default_value: e.target.value,
//                             }))
//                           }
//                           placeholder="Enter default value"
//                           disabled={loading}
//                         />
//                       </div>

//                       <div className="flex items-center justify-between pt-2">
//                         <div className="flex items-center gap-2">
//                           <Switch
//                             checked={newAttribute.is_required}
//                             onCheckedChange={(checked) =>
//                               setNewAttribute((prev) => ({
//                                 ...prev,
//                                 is_required: checked,
//                               }))
//                             }
//                             disabled={loading}
//                           />
//                           <Label>Required Attribute</Label>
//                         </div>
//                         <Button
//                           type="button"
//                           onClick={handleAddAttribute}
//                           disabled={!newAttribute.name.trim() || loading}
//                         >
//                           Add Attribute
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             </div>

//             {/* Sidebar */}
//             <div className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Status</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div className="space-y-0.5">
//                       <Label htmlFor="is_active">Active Status</Label>
//                       <p className="text-xs text-muted-foreground">
//                         Make this category visible to stores
//                       </p>
//                     </div>
//                     <Switch
//                       id="is_active"
//                       checked={formData.is_active}
//                       onCheckedChange={(checked) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           is_active: checked,
//                         }))
//                       }
//                       disabled={loading}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Summary Card */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Summary</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-muted-foreground">Tags</span>
//                     <span className="font-medium">{formData.tag_schema.length}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-muted-foreground">Filters</span>
//                     <span className="font-medium">{formData.config.filters.length}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-muted-foreground">Attributes</span>
//                     <span className="font-medium">{formData.config.attributes.length}</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </Tabs>
//       </form>
//     </div>
//   );
// }

import React from 'react'

export default function page() {
  return (
    <div>page</div>
  )
}
