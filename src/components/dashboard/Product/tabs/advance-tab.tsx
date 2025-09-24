// import { useState, useCallback } from "react"
// import { UseFormReturn } from "react-hook-form"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { Switch } from "@/components/ui/switch"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Settings, Plus, X } from 'lucide-react'
// import { iProductFormData } from "@/models/StoreAdmin/product.model"

// interface AdvancedTabProps {
//     form: UseFormReturn<iProductFormData>
//     loading: boolean
//     specifications: Record<string, any>
//     setSpecifications: (specs: Record<string, any>) => void
// }

// export default function AdvancedTab({ form, loading, specifications, setSpecifications }: AdvancedTabProps) {
//     const [newSpecification, setNewSpecification] = useState({ key: "", value: "" })

//     const addSpecification = useCallback(() => {
//         const { key, value } = newSpecification
//         const trimmedKey = key.trim()
//         const trimmedValue = value.trim()
//         if (trimmedKey && trimmedValue) {
//             setSpecifications((prev: any) => ({ ...prev, [trimmedKey]: trimmedValue }))
//             setNewSpecification({ key: "", value: "" })
//         }
//     }, [newSpecification, setSpecifications])

//     const removeSpecification = useCallback((key: string) => {
//         setSpecifications((prev: any) => {
//             const { [key]: _, ...rest } = prev
//             return rest
//         })
//     }, [setSpecifications])

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                     <Settings className="h-5 w-5" />
//                     Product Settings
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//                 <div className="space-y-2">
//                     <Label htmlFor="visibility">Product Visibility</Label>
//                     <Select
//                         value={form.watch("visibility")}
//                         onValueChange={(value: "public" | "private" | "hidden") => form.setValue("visibility", value)}
//                         disabled={loading}
//                     >
//                         <SelectTrigger>
//                             <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="public">Public - Visible to everyone</SelectItem>
//                             <SelectItem value="private">Private - Only visible to admins</SelectItem>
//                             <SelectItem value="hidden">Hidden - Not visible anywhere</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 <Separator />

//                 <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <Label>Active Status</Label>
//                             <p className="text-sm text-muted-foreground">Make this product available for purchase</p>
//                         </div>
//                         <Switch
//                             checked={form.watch("is_active")}
//                             onCheckedChange={(checked) => form.setValue("is_active", checked)}
//                             disabled={loading}
//                         />
//                     </div>
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <Label>Featured Product</Label>
//                             <p className="text-sm text-muted-foreground">Show this product in featured sections</p>
//                         </div>
//                         <Switch
//                             checked={form.watch("is_featured")}
//                             onCheckedChange={(checked) => form.setValue("is_featured", checked)}
//                             disabled={loading}
//                         />
//                     </div>
//                 </div>

//                 <Separator />

//                 <div className="space-y-4">
//                     <Label>Specifications</Label>
//                     <div className="grid grid-cols-5 gap-2">
//                         <Input
//                             value={newSpecification.key}
//                             onChange={(e) => setNewSpecification(prev => ({ ...prev, key: e.target.value }))}
//                             placeholder="Key"
//                             disabled={loading}
//                         />
//                         <Input
//                             value={newSpecification.value}
//                             onChange={(e) => setNewSpecification(prev => ({ ...prev, value: e.target.value }))}
//                             placeholder="Value"
//                             disabled={loading}
//                         />
//                         <Button type="button" onClick={addSpecification} variant="outline" disabled={loading}>
//                             <Plus className="h-4 w-4" />
//                         </Button>
//                     </div>
//                     {Object.keys(specifications).length > 0 && (
//                         <div className="space-y-2">
//                             {Object.entries(specifications).map(([key, value]) => (
//                                 <div key={key} className="flex items-center justify-between p-2 border rounded">
//                                     <span className="font-medium">{key}:</span>
//                                     <div className="flex items-center gap-2">
//                                         <span>{value}</span>
//                                         <X
//                                             className="h-4 w-4 cursor-pointer text-muted-foreground"
//                                             onClick={() => removeSpecification(key)}
//                                         />
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }