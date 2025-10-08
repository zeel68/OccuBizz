"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
    Plus, Edit, Trash2, Loader2, Star, Package, Search,
    GripVertical, Eye, EyeOff, X, AlertCircle, Move,
    ChevronLeft, ChevronRight, ShoppingCart, TrendingUp,
    Sparkles, ArrowRight, Check, Grid3x3, List
} from 'lucide-react'
import { useHomepageStore } from "@/store/StoreAdmin/homepageStore"
import { useProductStore } from "@/store/StoreAdmin/productStore"
import { iTrendingProduct } from "@/models/StoreAdmin/homepage.model"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface TrendingProductFormData {
    product_id: string
    display_order: number
}

interface DragItem {
    index: number
    id: string
}

export function TrendingProductsManager() {
    const {
        trendingProducts,
        addTrendingProduct,
        updateTrendingProduct,
        removeTrendingProduct,
        loading
    } = useHomepageStore()
    const { productInfo, fetchProducts } = useProductStore()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<iTrendingProduct | null>(null)
    const [previewMode, setPreviewMode] = useState(false)
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")
    const [draggedItem, setDraggedItem] = useState<DragItem | null>(null)
    const [dragOverItem, setDragOverItem] = useState<number | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<string | null>(null)
    const [selectedProductId, setSelectedProductId] = useState("")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    const [formData, setFormData] = useState<TrendingProductFormData>({
        product_id: "",
        display_order: 1,
    })

    const productSelectRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!productInfo || productInfo.products.length === 0) {
            fetchProducts({ limit: 100 })
        }
    }, [productInfo, fetchProducts])

    // Filter available products based on search query
    const availableProducts =
        productInfo?.products?.filter(product => {
            const isAlreadyTrending = Array.isArray(trendingProducts) &&
                trendingProducts.some(
                    trending => String(trending.product_id) === String(product._id)
                );

            const matchesSearch = searchQuery === "" ||
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase());

            return !isAlreadyTrending && matchesSearch;
        }) || [];

    const handleOpenDialog = (trendingProduct?: iTrendingProduct) => {
        if (trendingProduct) {
            setEditingProduct(trendingProduct)
            setFormData({
                product_id: trendingProduct.product_id,
                display_order: trendingProduct.display_order,
            })
            setSelectedProductId(trendingProduct.product_id)
        } else {
            setEditingProduct(null)
            setFormData({
                product_id: "",
                display_order: trendingProducts.length + 1,
            })
            setSelectedProductId("")
        }
        setSearchQuery("")
        setIsDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
        setEditingProduct(null)
        setSelectedProductId("")
        setSearchQuery("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.product_id) {
            toast.error("Please select a product")
            return
        }

        try {
            if (editingProduct) {
                await updateTrendingProduct(editingProduct._id, formData.display_order)
                toast.success("Trending product updated successfully")
            } else {
                await addTrendingProduct(formData.product_id, formData.display_order)
                toast.success("Trending product added successfully")
            }

            handleCloseDialog()
        } catch (error: any) {
            toast.error(error.message || "Failed to save trending product")
        }
    }

    const handleDeleteClick = (trendingId: string) => {
        setProductToDelete(trendingId)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return

        try {
            await removeTrendingProduct(productToDelete)
            toast.success("Trending product removed successfully")
            setDeleteDialogOpen(false)
            setProductToDelete(null)
        } catch (error: any) {
            toast.error(error.message || "Failed to remove trending product")
        }
    }

    const getProductInfo = (productId: string) => {
        return productInfo?.products?.find(product => product._id === productId)
    }

    const handleDragStart = (e: React.DragEvent, index: number, id: string) => {
        setDraggedItem({ index, id })
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setDragOverItem(index)
    }

    const handleDragLeave = () => {
        setDragOverItem(null)
    }

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault()
        setDragOverItem(null)

        if (!draggedItem) return

        const draggedIndex = draggedItem.index
        if (draggedIndex === dropIndex) return

        toast.success("Product order updated")
        setDraggedItem(null)
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
        setDragOverItem(null)
    }

    const handlePrevPreview = () => {
        setCurrentPreviewIndex((prev) =>
            prev === 0 ? trendingProducts.length - 1 : prev - 1
        )
    }

    const handleNextPreview = () => {
        setCurrentPreviewIndex((prev) =>
            prev === trendingProducts.length - 1 ? 0 : prev + 1
        )
    }

    const handleProductSelect = (productId: string) => {
        setFormData(prev => ({ ...prev, product_id: productId }))
        setSelectedProductId(productId)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Trending Products
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Manage products featured in your trending section
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="flex items-center gap-2"
                        disabled={trendingProducts.length === 0}
                    >
                        {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {previewMode ? "Exit Preview" : "Preview"}
                    </Button>
                    <Button
                        onClick={() => handleOpenDialog()}
                        className="flex items-center gap-2"
                        disabled={availableProducts.length === 0}
                    >
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                </div>
            </div>

            {availableProducts.length === 0 && trendingProducts.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Package className="h-12 w-12 text-muted-foreground mb-3" />
                        <h4 className="text-base font-medium mb-1">No products available</h4>
                        <p className="text-muted-foreground text-center text-sm max-w-md">
                            Create products first to feature them as trending items on your homepage.
                        </p>
                    </CardContent>
                </Card>
            )}

            {trendingProducts.length === 0 && availableProducts.length > 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Star className="h-12 w-12 text-muted-foreground mb-3" />
                        <h4 className="text-base font-medium mb-1">No trending products set</h4>
                        <p className="text-muted-foreground text-center text-sm max-w-md mb-4">
                            Add products to feature them in the trending section of your homepage.
                        </p>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Trending Product
                        </Button>
                    </CardContent>
                </Card>
            )}

            {trendingProducts.length > 0 && (
                <>
                    {previewMode ? (
                        <div className="bg-secondary rounded-lg p-6">
                            <div className="max-w-6xl mx-auto">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium mb-3">
                                        <Sparkles className="h-3 w-3" />
                                        Trending Now
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground mb-2">
                                        Hot Picks This Week
                                    </h2>
                                    <p className="text-muted-foreground text-sm">
                                        Discover our most popular products that customers are loving right now
                                    </p>
                                </div>

                                <div className="relative">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {trendingProducts
                                            .sort((a, b) => a.display_order - b.display_order)
                                            .map((trendingProduct, index) => {
                                                const productInfo = trendingProduct.product_id as any
                                                const isActive = index === currentPreviewIndex

                                                return (
                                                    <div
                                                        key={trendingProduct._id}
                                                        className={cn(
                                                            "relative group transition-all duration-300",
                                                            isActive ? "scale-105 z-10" : "scale-95 opacity-70"
                                                        )}
                                                    >
                                                        <Card className="overflow-hidden">
                                                            <div className="relative">
                                                                <div className="aspect-square overflow-hidden bg-muted">
                                                                    <img
                                                                        src={productInfo.images?.[0] || "/placeholder.svg"}
                                                                        alt={productInfo?.name || "Product"}
                                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    />
                                                                </div>
                                                                {isActive && (
                                                                    <div className="absolute top-2 left-2">
                                                                        <Badge className="bg-primary text-primary-foreground">
                                                                            #{trendingProduct.display_order}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <CardContent className="p-3">
                                                                <h4 className="font-medium text-sm mb-1 line-clamp-2">
                                                                    {productInfo?.name || "Unknown Product"}
                                                                </h4>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-base font-bold text-foreground">
                                                                            ${productInfo?.price || 0}
                                                                        </span>
                                                                        {productInfo?.original_price && (
                                                                            <span className="text-xs text-muted-foreground line-through">
                                                                                ${productInfo.original_price}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <Badge
                                                                        variant={productInfo?.stock?.quantity > 0 ? "default" : "destructive"}
                                                                        className="text-xs"
                                                                    >
                                                                        {productInfo?.stock?.quantity > 0 ? "In Stock" : "Out of Stock"}
                                                                    </Badge>
                                                                </div>
                                                                <Button
                                                                    className="w-full"
                                                                    size="sm"
                                                                >
                                                                    <ShoppingCart className="h-3 w-3 mr-1" />
                                                                    View Product
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                )
                                            })}
                                    </div>

                                    {trendingProducts.length > 1 && (
                                        <>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background"
                                                onClick={handlePrevPreview}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background"
                                                onClick={handleNextPreview}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-center gap-1 mt-4">
                                    {trendingProducts.map((_, index) => (
                                        <button
                                            key={index}
                                            className={cn(
                                                "h-1.5 rounded-full transition-all duration-300",
                                                index === currentPreviewIndex
                                                    ? "w-6 bg-primary"
                                                    : "w-1.5 bg-muted-foreground/30"
                                            )}
                                            onClick={() => setCurrentPreviewIndex(index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {trendingProducts
                                .sort((a, b) => a.display_order - b.display_order)
                                .map((trendingProduct, index) => {
                                    const productInfo = trendingProduct.product_id as any
                                    return (
                                        <Card
                                            key={trendingProduct._id}
                                            className={cn(
                                                "overflow-hidden transition-all duration-200 hover:shadow-md group",
                                                draggedItem?.id === trendingProduct._id && "opacity-50",
                                                dragOverItem === index && "ring-1 ring-primary"
                                            )}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index, trendingProduct._id)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, index)}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <div className="relative">
                                                <div className="aspect-square relative">
                                                    <img
                                                        src={productInfo.images?.[0] || "/placeholder.svg"}
                                                        alt={productInfo?.name || "Product"}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                    <div className="absolute top-2 right-2">
                                                        <Badge className="bg-primary text-primary-foreground text-xs">
                                                            #{trendingProduct.display_order}
                                                        </Badge>
                                                    </div>
                                                    <div className="absolute top-2 left-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="bg-foreground/70 text-background p-1 rounded-sm">
                                                            <GripVertical className="h-3 w-3" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2">
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => handleOpenDialog(trendingProduct)}
                                                            className="h-7 w-7 p-0"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(trendingProduct._id)}
                                                            className="h-7 w-7 p-0"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <CardContent className="p-3">
                                                <h4 className="font-medium text-sm truncate">
                                                    {productInfo?.name || "Unknown Product"}
                                                </h4>
                                                {productInfo?.description && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                        {productInfo.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="font-bold text-base">
                                                        ${productInfo?.price || 0}
                                                    </span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        Stock: {productInfo?.stock?.quantity || 0}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                                    <Move className="h-3 w-3 mr-1" />
                                                    Drag to reorder
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                        </div>
                    )}
                </>
            )}

            {/* Enhanced Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
                    <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle className="text-lg flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                                {editingProduct ? <Edit className="h-4 w-4 text-primary-foreground" /> : <Plus className="h-4 w-4 text-primary-foreground" />}
                            </div>
                            <div>
                                <div>{editingProduct ? "Edit Trending Product" : "Add Trending Product"}</div>
                                <div className="text-sm font-normal text-muted-foreground">
                                    {editingProduct ? "Update the details of this trending product" : "Select a product to feature in your trending section"}
                                </div>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Product Selection Panel */}
                        <div className="w-1/2 border-r p-4 flex flex-col">
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-sm font-medium">Select Product</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Choose a product to feature in the trending section
                                    </p>
                                </div>

                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                    <Input
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-7 text-sm h-9"
                                    />
                                    {searchQuery && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 p-0"
                                            onClick={() => setSearchQuery("")}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>

                                <div className="flex items-center gap-1">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                        className="h-8 text-xs"
                                    >
                                        <Grid3x3 className="h-3 w-3 mr-1" />
                                        Grid
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                        className="h-8 text-xs"
                                    >
                                        <List className="h-3 w-3 mr-1" />
                                        List
                                    </Button>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 mt-3">
                                {availableProducts.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground text-sm">
                                            {searchQuery ? "No products match your search" : "No available products"}
                                        </p>
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "pr-3",
                                        viewMode === "grid" ? "grid grid-cols-2 gap-2" : "space-y-2"
                                    )}>
                                        {availableProducts.map((product) => {
                                            const isSelected = selectedProductId === product._id
                                            return (
                                                <div
                                                    key={product._id}
                                                    className={cn(
                                                        "cursor-pointer rounded-md border transition-all duration-150",
                                                        isSelected
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border hover:border-primary/50 hover:bg-muted/30"
                                                    )}
                                                    onClick={() => handleProductSelect(product._id)}
                                                >
                                                    {viewMode === "grid" ? (
                                                        <div className="p-2">
                                                            <div className="aspect-square rounded-sm overflow-hidden mb-1">
                                                                <img
                                                                    src={product.images?.[0] || "/placeholder.svg"}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <p className="font-medium text-xs line-clamp-2">{product.name}</p>
                                                            <p className="text-xs font-bold text-primary mt-0.5">${product.price}</p>
                                                            {isSelected && (
                                                                <div className="absolute top-1 right-1">
                                                                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                                                        <Check className="h-3 w-3 text-primary-foreground" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center p-2">
                                                            <div className="w-12 h-12 rounded-sm overflow-hidden mr-2 flex-shrink-0">
                                                                <img
                                                                    src={product.images?.[0] || "/placeholder.svg"}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-sm truncate">{product.name}</p>
                                                                <p className="text-xs text-muted-foreground">${product.price}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Stock: {product.stock?.quantity || 0}
                                                                </p>
                                                            </div>
                                                            {isSelected && (
                                                                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                                                    <Check className="h-3 w-3 text-primary-foreground" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>

                        {/* Product Details & Settings Panel */}
                        <div className="w-1/2 p-4 flex flex-col">
                            {selectedProductId ? (
                                <>
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-sm font-medium">Selected Product</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Review and configure the selected product
                                            </p>
                                        </div>

                                        <Card>
                                            <div className="aspect-video relative">
                                                <img
                                                    src={getProductInfo(selectedProductId)?.images?.[0] || "/placeholder.svg"}
                                                    alt={getProductInfo(selectedProductId)?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <CardContent className="p-3">
                                                <h4 className="font-semibold text-sm mb-1">
                                                    {getProductInfo(selectedProductId)?.name}
                                                </h4>
                                                {getProductInfo(selectedProductId)?.description && (
                                                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                                        {getProductInfo(selectedProductId)?.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-bold text-primary">
                                                        ${getProductInfo(selectedProductId)?.price || 0}
                                                    </span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        Stock: {getProductInfo(selectedProductId)?.stock?.quantity || 0}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Separator />

                                        <div className="space-y-3">
                                            <div>
                                                <Label htmlFor="display_order" className="text-sm font-medium">
                                                    Display Order
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Lower numbers appear first in the trending section
                                                </p>
                                                <Input
                                                    id="display_order"
                                                    type="number"
                                                    min="1"
                                                    value={formData.display_order}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: Number(e.target.value) }))}
                                                    className="mt-1.5 h-9"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center mx-auto mb-2">
                                            <Package className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <h4 className="text-sm font-medium mb-1">No Product Selected</h4>
                                        <p className="text-muted-foreground text-xs max-w-xs">
                                            Select a product from the left panel to add it to your trending section
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 border-t bg-background">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseDialog}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading || !selectedProductId}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingProduct ? "Update Product" : "Add to Trending"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Removal</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm">Are you sure you want to remove this product from the trending section?</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}