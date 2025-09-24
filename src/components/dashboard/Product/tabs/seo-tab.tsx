// import { useState, useCallback } from "react"
// import { UseFormReturn } from "react-hook-form"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Search, Plus, X } from 'lucide-react'
// import { iProductFormData } from "@/models/StoreAdmin/product.model"

// interface SEOTabProps {
//     form: UseFormReturn<iProductFormData>
//     loading: boolean
//     seoKeywords: string[]
//     setSeoKeywords: (keywords: string[]) => void
// }

// export default function SEOTab({ form, loading, seoKeywords, setSeoKeywords }: SEOTabProps) {
//     const [newKeyword, setNewKeyword] = useState("")

//     const addKeyword = useCallback(() => {
//         const trimmed = newKeyword.trim()
//         if (trimmed && !seoKeywords.includes(trimmed)) {
//             setSeoKeywords(prev => [...prev, trimmed])
//             setNewKeyword("")
//         }
//     }, [newKeyword, seoKeywords, setSeoKeywords])

//     const removeKeyword = useCallback((keyword: string) => {
//         setSeoKeywords(prev => prev.filter(k => k !== keyword))
//     }, [setSeoKeywords])

//     return (
//         <Card>
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
//                         placeholder="Enter SEO title"
//                         disabled={loading}
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <Label htmlFor="seo_description">SEO Description</Label>
//                     <Textarea
//                         id="seo_description"
//                         {...form.register("seo.description")}
//                         placeholder="Enter SEO meta description"
//                         rows={3}
//                         disabled={loading}
//                     />
//                 </div>
//                 <div className="space-y-4">
//                     <Label>SEO Keywords</Label>
//                     <div className="flex gap-2">
//                         <Input
//                             value={newKeyword}
//                             onChange={(e) => setNewKeyword(e.target.value)}
//                             placeholder="Add keyword"
//                             onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
//                             disabled={loading}
//                         />
//                         <Button type="button" onClick={addKeyword} variant="outline" disabled={loading}>
//                             <Plus className="h-4 w-4" />
//                         </Button>
//                     </div>
//                     {seoKeywords.length > 0 && (
//                         <div className="flex flex-wrap gap-2">
//                             {seoKeywords.map((keyword, index) => (
//                                 <Badge key={index} variant="secondary" className="flex items-center gap-1">
//                                     {keyword}
//                                     <X
//                                         className="h-3 w-3 cursor-pointer"
//                                         onClick={() => removeKeyword(keyword)}
//                                     />
//                                 </Badge>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }