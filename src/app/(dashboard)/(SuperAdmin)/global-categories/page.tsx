"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Package,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Filter,
  X,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Folder,
  Calendar,
  Settings,
} from "lucide-react";
import { useGlobalCategoryStore } from "@/store/SuperAdmin/GlobleCategoryStore";

type FilterType = "all" | "active" | "inactive";
type SortType = "name-asc" | "name-desc" | "created-asc" | "created-desc";

// Format relative time utility
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Truncate text utility
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

// Category interface based on Globe Category model
interface GlobeCategory {
  _id: string;
  name: string;
  slug: string;
  image_url?: string;
  config?: {
    filters: Array<{
      name: string;
      type: string;
      options: string[];
      is_required: boolean;
    }>;
    attributes: Array<{
      name: string;
      type: string;
      is_required: boolean;
      default_value?: string;
    }>;
  };
  tag_schema: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  stores?: any[]; // Virtual field
  store_count?: number; // Computed field
}

// Categories Table Component
function CategoriesTable({
  categories,
  isLoading,
  onEdit,
  onViewStores,
}: {
  categories: GlobeCategory[];
  isLoading: boolean;
  onEdit?: (category: GlobeCategory) => void;
  onViewStores?: (category: GlobeCategory) => void;
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { deleteCategory, toggleCategoryStatus } = useGlobalCategoryStore();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(categories.map((category) => category._id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, categoryId]);
    } else {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge
        variant="secondary"
        className={`${isActive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"} border-0 font-medium flex items-center gap-1`}
      >
        {isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const handleDelete = async (id: string, name?: string, skipConfirm?: boolean) => {
    if (!skipConfirm) {
      const confirmed = confirm(`Are you sure you want to delete the category "${name}"?`);
      if (!confirmed) return;
    }

    try {
      await deleteCategory(id);
      if (!skipConfirm) toast.success("Category deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const handleMultipleDelete = async () => {
    if (selectedCategories.length === 0) return;

    try {
      await Promise.all(selectedCategories.map((id) => handleDelete(id, "", true)));
      toast.success(`Deleted ${selectedCategories.length} categories`);
      setSelectedCategories([]);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete categories");
    }
  };

  const handleChangeStatus = async (id: string, status: boolean, skipConfirm?: boolean) => {
    if (!skipConfirm) {
      const confirmed = confirm(`Are you sure you want to change the category status?`);
      if (!confirmed) return;
    }

    try {
      await toggleCategoryStatus(id, status);
      if (!skipConfirm) toast.success("Category status changed successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to change category status");
    }
  };

  const handleMultipleStatus = async (status: boolean) => {
    if (selectedCategories.length === 0) return;

    try {
      await Promise.all(selectedCategories.map((id) => handleChangeStatus(id, status, true)));
      toast.success(`Updated status for ${selectedCategories.length} categories`);
      setSelectedCategories([]);
    } catch (error: any) {
      toast.error(error.message || "Failed to change categories status");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stores</TableHead>
              <TableHead>Filters</TableHead>
              <TableHead>Attributes</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stores</TableHead>
              <TableHead>Filters</TableHead>
              <TableHead>Attributes</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex flex-col items-center space-y-2">
                  <Tag className="h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No categories found</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={selectedCategories.length === categories.length && categories.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300"
              />
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Stores</TableHead>
            <TableHead>Filters</TableHead>
            <TableHead>Attributes</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category._id);
            const filterCount = category.config?.filters?.length || 0;
            const attributeCount = category.config?.attributes?.length || 0;

            return (
              <TableRow key={category._id} className={isSelected ? "bg-muted/50" : ""}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleSelectCategory(category._id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                      {category.image_url ? (
                        <img
                          src={category.image_url || "/placeholder.svg"}
                          alt={category.name}
                          className="h-10 w-10 object-cover"
                        />
                      ) : (
                        <Tag className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium leading-none">{category.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {category.slug}
                        </Badge>
                      </div>
                      {category.tag_schema && category.tag_schema.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {category.tag_schema.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                              {typeof tag === 'string' ? tag : 'Tag'}
                            </Badge>
                          ))}
                          {category.tag_schema.length > 2 && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              +{category.tag_schema.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>{getStatusBadge(category.is_active)}</TableCell>

                <TableCell>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{category.store_count || 0}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{filterCount}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{attributeCount}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-2" />
                    <span>{formatRelativeTime(category.created_at)}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(category)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Category
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      {onViewStores && (
                        <DropdownMenuItem onClick={() => onViewStores(category)}>
                          <Package className="mr-2 h-4 w-4" />
                          View Stores
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => handleDelete(category._id, category.name)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Category
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Bulk Actions */}
      {selectedCategories.length > 0 && (
        <div className="border-t bg-muted/50 px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {selectedCategories.length} categor{selectedCategories.length > 1 ? "ies" : "y"} selected
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm">
                Export Selected
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleMultipleStatus(true)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate Selected
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleMultipleStatus(false)}>
                <XCircle className="mr-2 h-4 w-4" />
                Deactivate Selected
              </Button>
              <Button variant="destructive" size="sm" onClick={handleMultipleDelete}>
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Page Component
export default function CategoriesPage() {
  const router = useRouter();
  const { categories, fetchCategories, loading } = useGlobalCategoryStore();

  // State management
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortType, setSortType] = useState<SortType>("name-asc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories(true);
  }, [fetchCategories]);

  // Enhanced filtering and sorting logic
  const filteredAndSortedCategories = useMemo(() => {
    let filtered = categories?.filter((category) => {
      // Search filter
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      let matchesFilter = true;
      switch (filterType) {
        case "active":
          matchesFilter = category.is_active !== false;
          break;
        case "inactive":
          matchesFilter = category.is_active === false;
          break;
        default:
          matchesFilter = true;
      }

      return matchesSearch && matchesFilter;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortType) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "created-asc":
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );
        case "created-desc":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        default: // name-asc
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [categories, searchTerm, filterType, sortType]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setSortType("name-asc");
    toast.success("Filters cleared");
  };

  // Calculate stats
  const stats = useMemo(
    () => ({
      total: categories.length,
      active: categories.filter((cat) => cat.is_active !== false).length,
      inactive: categories.filter((cat) => cat.is_active === false).length,
      totalStores: categories.reduce((acc, cat) => acc + (cat.store_count || 0), 0),
      totalFilters: categories.reduce((acc, cat) => acc + (cat.config?.filters?.length || 0), 0),
    }),
    [categories]
  );

  // Check if any filters are active
  const hasActiveFilters = searchTerm || filterType !== "all" || sortType !== "name-asc";

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await fetchCategories(true);
      toast.success("Categories refreshed successfully", {
        description: `${categories.length} categories loaded`,
      });
    } catch (error) {
      toast.error("Failed to refresh categories", {
        description: "Please try again or check your connection",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateCategory = () => {
    router.push("/global-categories/add");
  };

  const handleEditCategory = (category: GlobeCategory) => {
    router.push(`/global-categories/${category._id}`);
  };

  const handleViewStores = (category: GlobeCategory) => {
    router.push(`/super-admin/stores?category=${category._id}`);
  };

  return (
    <div className="space-y-6 bg-background p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Global Categories
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage global categories for all stores in the platform
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="transition-all duration-200"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            onClick={handleCreateCategory}
            className="bg-primary hover:bg-primary/90 transition-colors duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active • {stats.inactive} inactive
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStores}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Filters</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFilters}</div>
            <p className="text-xs text-muted-foreground">Filter configurations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card with Enhanced Filters */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Categories</CardTitle>
              <CardDescription className="mt-1">
                Manage global categories for the platform
                {filteredAndSortedCategories.length !== categories.length && (
                  <span className="ml-2 text-sm">
                    • Showing {filteredAndSortedCategories.length} of {categories.length}
                  </span>
                )}
              </CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button
                variant="outline"
                size="default"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full sm:w-auto"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
                {showFilters ? (
                  <EyeOff className="ml-2 h-4 w-4" />
                ) : (
                  <Eye className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Enhanced Filter Section */}
          {showFilters && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg border space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filter Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filter by Status</label>
                  <Select
                    value={filterType}
                    onValueChange={(value: FilterType) => setFilterType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort by</label>
                  <Select
                    value={sortType}
                    onValueChange={(value: SortType) => setSortType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name-asc">
                        <div className="flex items-center">
                          <SortAsc className="mr-2 h-4 w-4" />
                          Name A-Z
                        </div>
                      </SelectItem>
                      <SelectItem value="name-desc">
                        <div className="flex items-center">
                          <SortDesc className="mr-2 h-4 w-4" />
                          Name Z-A
                        </div>
                      </SelectItem>
                      <SelectItem value="created-desc">Newest First</SelectItem>
                      <SelectItem value="created-asc">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters & Clear */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Active filters:</span>

                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: "{searchTerm}"
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => setSearchTerm("")}
                      />
                    </Badge>
                  )}

                  {filterType !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Status: {filterType}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => setFilterType("all")}
                      />
                    </Badge>
                  )}

                  {sortType !== "name-asc" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Sort: {sortType.replace("-", " ")}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => setSortType("name-asc")}
                      />
                    </Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 px-2 text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Results Summary */}
          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <div>
              {filteredAndSortedCategories.length === 0 ? (
                <span>No categories found</span>
              ) : (
                <span>
                  Showing {filteredAndSortedCategories.length}
                  {filteredAndSortedCategories.length !== categories.length &&
                    ` of ${categories.length}`}{" "}
                  categories
                </span>
              )}
            </div>

            {filteredAndSortedCategories.length === 0 && hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>

          <CategoriesTable
            categories={filteredAndSortedCategories as any}
            isLoading={loading}
            onEdit={handleEditCategory}
            onViewStores={handleViewStores}
          />
        </CardContent>
      </Card>
    </div>
  );
}