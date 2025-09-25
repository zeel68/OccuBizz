// tabs/SEOTab.tsx
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, X } from 'lucide-react'
import { UseFormReturn } from "react-hook-form"
import { ProductFormData } from "@/types/product.types"

interface SEOTabProps {
    form: UseFormReturn<ProductFormData>
    loading: boolean
    formErrors: Record<string, string>
    seoKeywords: string[]
    setSeoKeywords: (keywords: string[]) => void
}

export function SEOTab({ form, loading, seoKeywords, setSeoKeywords }: SEOTabProps) {
    const [newKeyword, setNewKeyword] = useState("")

    const addKeyword = () => {
        const trimmed = newKeyword.trim().toLowerCase()
        if (trimmed && !seoKeywords.some(keyword => keyword.toLowerCase() === trimmed)) {
            setSeoKeywords([...seoKeywords, trimmed])
            setNewKeyword("")
        }
    }

    const removeKeyword = (keywordToRemove: string) => {
        setSeoKeywords(seoKeywords.filter(keyword => keyword !== keywordToRemove))
    }

    const seoTitle = form.watch("seo.title") || form.watch("name") || ""
    const seoDescription = form.watch("seo.description") || form.watch("description") || ""
    const productName = form.watch("name") || "product-name"

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
    }

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    SEO Optimization
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <Input
                        id="seo_title"
                        {...form.register("seo.title")}
                        placeholder="Enter SEO title (recommended: 50-60 characters)"
                        disabled={loading}
                        maxLength={60}
                    />
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            Recommended: 50-60 characters
                        </p>
                        <p className={`text-sm ${seoTitle.length > 60 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {seoTitle.length}/60 characters
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="seo_description">SEO Description</Label>
                    <Textarea
                        id="seo_description"
                        {...form.register("seo.description")}
                        placeholder="Enter SEO meta description (recommended: 150-160 characters)"
                        rows={3}
                        disabled={loading}
                        maxLength={160}
                    />
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            Recommended: 150-160 characters
                        </p>
                        <p className={`text-sm ${seoDescription.length > 160 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {seoDescription.length}/160 characters
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <Label>SEO Keywords</Label>
                    <div className="flex gap-2">
                        <Input
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            placeholder="Add keyword"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    addKeyword()
                                }
                            }}
                            disabled={loading}
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            onClick={addKeyword}
                            variant="outline"
                            disabled={loading || !newKeyword.trim()}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    {seoKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {seoKeywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                                    {keyword}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 ml-2"
                                        onClick={() => removeKeyword(keyword)}
                                        disabled={loading}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border rounded-lg bg-muted/20 shadow-inner">
                    <Label className="text-sm font-medium">Search Preview</Label>
                    <div className="mt-2 space-y-1">
                        <div className="text-blue-600 text-lg font-medium truncate">
                            {seoTitle || "Your Product Title"}
                        </div>
                        <div className="text-green-600 text-sm">
                            example.com/products/{generateSlug(productName)}
                        </div>
                        <div className="text-gray-600 text-sm line-clamp-2">
                            {seoDescription || "Product description will appear here..."}
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">SEO Tips</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Include your primary keyword in the title and description</li>
                        <li>• Keep titles under 60 characters for optimal display</li>
                        <li>• Write compelling descriptions that encourage clicks</li>
                        <li>• Use relevant keywords naturally throughout your content</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}