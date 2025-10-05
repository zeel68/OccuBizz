// // app/stores/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Search, Filter, Store, Package, ShoppingCart, Users, Globe, Mail, Phone, Calendar, ChevronLeft, ChevronRight, Eye, Edit, MoreVertical, Plus, Download, Upload } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import Link from "next/link";

// // Mock API response
// const mockApiResponse = {
//   "statusCode": 200,
//   "data": {
//     "stores": [
//       {
//         "_id": "68bd6b50df60e95ab4f5aceb",
//         "name": "Dhaneri",
//         "domain": "newstore.example.com",
//         "category_id": {
//           "_id": "68bd6b43df60e95ab4f5ace5",
//           "name": "Fashion",
//           "id": "68bd6b43df60e95ab4f5ace5"
//         },
//         "config": {
//           "enabledCategory": "Fashion",
//           "contact_info": {
//             "email": "dhaneri16@gmail.com",
//             "phone": "000000000",
//             "website": "https://dhaneri.com"
//           },
//           "address": {
//             "street": "",
//             "city": "",
//             "state": "",
//             "country": "",
//             "postal_code": ""
//           },
//           "social_media": {
//             "facebook": "",
//             "twitter": "",
//             "instagram": "",
//             "linkedin": ""
//           }
//         },
//         "is_active": true,
//         "theme": {
//           "_id": "68bd6174df60e95ab4f5ac87",
//           "primary_color": "#4f46e5",
//           "secondary_color": "#f43f5e",
//           "font_family": "'Inter', sans-serif",
//           "id": "68bd6174df60e95ab4f5ac87"
//         },
//         "features": [],
//         "attributes": [],
//         "created_at": "2025-09-07T11:24:00.844Z",
//         "updated_at": "2025-09-09T09:28:41.243Z",
//         "id": "68bd6b50df60e95ab4f5aceb",
//         "stats": {
//           "products": 34,
//           "orders": 14,
//           "customers": 0
//         }
//       }
//     ],
//     "pagination": {
//       "page": 1,
//       "limit": 20,
//       "total": 1,
//       "totalPages": 1
//     }
//   },
//   "message": "Stores fetched successfully",
//   "success": true
// };

// // Additional mock stores for demonstration
// const additionalMockStores = [
//   {
//     "_id": "68bd6b50df60e95ab4f5acec",
//     "name": "TechWorld",
//     "domain": "techworld.example.com",
//     "category_id": {
//       "_id": "68bd6b43df60e95ab4f5ace6",
//       "name": "Electronics",
//       "id": "68bd6b43df60e95ab4f5ace6"
//     },
//     "config": {
//       "enabledCategory": "Electronics",
//       "contact_info": {
//         "email": "contact@techworld.com",
//         "phone": "1234567890",
//         "website": "https://techworld.com"
//       },
//       "address": {
//         "street": "123 Tech Street",
//         "city": "San Francisco",
//         "state": "CA",
//         "country": "USA",
//         "postal_code": "94105"
//       },
//       "social_media": {
//         "facebook": "techworld",
//         "twitter": "techworld",
//         "instagram": "techworld",
//         "linkedin": "techworld"
//       }
//     },
//     "is_active": true,
//     "theme": {
//       "_id": "68bd6174df60e95ab4f5ac88",
//       "primary_color": "#3b82f6",
//       "secondary_color": "#10b981",
//       "font_family": "'Roboto', sans-serif",
//       "id": "68bd6174df60e95ab4f5ac88"
//     },
//     "features": [],
//     "attributes": [],
//     "created_at": "2025-08-15T10:30:00.000Z",
//     "updated_at": "2025-09-05T14:20:30.000Z",
//     "id": "68bd6b50df60e95ab4f5acec",
//     "stats": {
//       "products": 120,
//       "orders": 87,
//       "customers": 45
//     }
//   },
//   {
//     "_id": "68bd6b50df60e95ab4f5aced",
//     "name": "HomeDecor",
//     "domain": "homedecor.example.com",
//     "category_id": {
//       "_id": "68bd6b43df60e95ab4f5ace7",
//       "name": "Home & Garden",
//       "id": "68bd6b43df60e95ab4f5ace7"
//     },
//     "config": {
//       "enabledCategory": "Home & Garden",
//       "contact_info": {
//         "email": "info@homedecor.com",
//         "phone": "9876543210",
//         "website": "https://homedecor.com"
//       },
//       "address": {
//         "street": "456 Garden Ave",
//         "city": "Portland",
//         "state": "OR",
//         "country": "USA",
//         "postal_code": "97201"
//       },
//       "social_media": {
//         "facebook": "homedecor",
//         "twitter": "",
//         "instagram": "homedecor",
//         "linkedin": ""
//       }
//     },
//     "is_active": false,
//     "theme": {
//       "_id": "68bd6174df60e95ab4f5ac89",
//       "primary_color": "#8b5cf6",
//       "secondary_color": "#ec4899",
//       "font_family": "'Playfair Display', serif",
//       "id": "68bd6174df60e95ab4f5ac89"
//     },
//     "features": [],
//     "attributes": [],
//     "created_at": "2025-07-22T16:45:00.000Z",
//     "updated_at": "2025-08-30T11:15:20.000Z",
//     "id": "68bd6b50df60e95ab4f5aced",
//     "stats": {
//       "products": 68,
//       "orders": 32,
//       "customers": 18
//     }
//   }
// ];

// // Combine the mock data
// const storesData = [...mockApiResponse.data.stores, ...additionalMockStores];

// // Get unique categories from stores
// const getUniqueCategories = (stores: any) => {
//   const categories = stores.map((store: any) => store.category_id.name);
//   return [...new Set(categories)];
// };

// export default function StoresPage() {
//   const [stores, setStores] = useState(storesData);
//   const [filteredStores, setFilteredStores] = useState(storesData);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [activeOnly, setActiveOnly] = useState(false);
//   const [sortBy, setSortBy] = useState("name");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(6);
//   const [isLoading, setIsLoading] = useState(false);
//   const [viewMode, setViewMode] = useState("grid");

//   const categories = getUniqueCategories(stores);

//   // Calculate summary stats
//   const summaryStats = {
//     totalStores: stores.length,
//     activeStores: stores.filter(store => store.is_active).length,
//     totalProducts: stores.reduce((sum, store) => sum + store.stats.products, 0),
//     totalOrders: stores.reduce((sum, store) => sum + store.stats.orders, 0),
//   };

//   // Simulate loading
//   useEffect(() => {
//     setIsLoading(true);
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 800);
//     return () => clearTimeout(timer);
//   }, [searchTerm, selectedCategory, activeOnly, sortBy]);

//   // Apply filters
//   useEffect(() => {
//     let result = stores;

//     // Filter by search term
//     if (searchTerm) {
//       result = result.filter(store =>
//         store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         store.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         store.config.contact_info.email.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Filter by category
//     if (selectedCategory !== "all") {
//       result = result.filter(store => store.category_id.name === selectedCategory);
//     }

//     // Filter by active status
//     if (activeOnly) {
//       result = result.filter(store => store.is_active);
//     }

//     // Sort
//     result = [...result].sort((a, b) => {
//       switch (sortBy) {
//         case "name":
//           return a.name.localeCompare(b.name);
//         case "products":
//           return b.stats.products - a.stats.products;
//         case "orders":
//           return b.stats.orders - a.stats.orders;
//         case "customers":
//           return b.stats.customers - a.stats.customers;
//         case "created":
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         default:
//           return 0;
//       }
//     });

//     setFilteredStores(result);
//     setCurrentPage(1); // Reset to first page when filters change
//   }, [stores, searchTerm, selectedCategory, activeOnly, sortBy]);

//   // Calculate pagination
//   const totalPages = Math.ceil(filteredStores.length / itemsPerPage);
//   const paginatedStores = filteredStores.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const formatDate = (dateString: any) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const handleExportStores = () => {
//     // Simulate export functionality
//     console.log("Exporting stores data...");
//   };

//   const handleImportStores = () => {
//     // Simulate import functionality
//     console.log("Importing stores data...");
//   };

//   return (
//     <div className="container mx-auto py-8 px-4 md:px-6">
//       <div className="flex flex-col space-y-8">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <div className="p-2 bg-muted rounded-lg">
//                 <Store className="h-6 w-6 text-foreground" />
//               </div>
//               <h1 className="text-3xl font-bold tracking-tight">Stores</h1>
//             </div>
//             <p className="text-muted-foreground">Manage and view all your stores in one place</p>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-2">
//             <Button variant="outline" onClick={handleExportStores}>
//               <Download className="mr-2 h-4 w-4" />
//               Export
//             </Button>
//             <Button variant="outline" onClick={handleImportStores}>
//               <Upload className="mr-2 h-4 w-4" />
//               Import
//             </Button>
//             <Link href="/stores/add-edit">
//               <Button>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add Store
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* Summary Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Total Stores</p>
//                   <h3 className="text-2xl font-bold">{summaryStats.totalStores}</h3>
//                 </div>
//                 <div className="p-3 bg-muted rounded-full">
//                   <Store className="h-6 w-6" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Active Stores</p>
//                   <h3 className="text-2xl font-bold">{summaryStats.activeStores}</h3>
//                 </div>
//                 <div className="p-3 bg-muted rounded-full">
//                   <div className="h-6 w-6 rounded-full bg-green-500" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Total Products</p>
//                   <h3 className="text-2xl font-bold">{summaryStats.totalProducts}</h3>
//                 </div>
//                 <div className="p-3 bg-muted rounded-full">
//                   <Package className="h-6 w-6" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
//                   <h3 className="text-2xl font-bold">{summaryStats.totalOrders}</h3>
//                 </div>
//                 <div className="p-3 bg-muted rounded-full">
//                   <ShoppingCart className="h-6 w-6" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Filters and Controls */}
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
//               <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
//                 <div className="relative flex-1 sm:flex-none sm:w-64">
//                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     type="search"
//                     placeholder="Search stores..."
//                     className="pl-8 w-full"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>

//                 <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//                   <SelectTrigger className="w-full sm:w-40">
//                     <SelectValue placeholder="Category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Categories</SelectItem>
//                     {categories.map((category) => (
//                       <SelectItem key={category as any} value={category as any}>
//                         {category as any}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Select value={sortBy} onValueChange={setSortBy}>
//                   <SelectTrigger className="w-full sm:w-40">
//                     <SelectValue placeholder="Sort by" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="name">Name</SelectItem>
//                     <SelectItem value="products">Products</SelectItem>
//                     <SelectItem value="orders">Orders</SelectItem>
//                     <SelectItem value="customers">Customers</SelectItem>
//                     <SelectItem value="created">Created Date</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex items-center gap-2 w-full lg:w-auto">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="active-only"
//                     checked={activeOnly}
//                     onCheckedChange={(checked) => setActiveOnly(checked === true)}
//                   />
//                   <Label htmlFor="active-only" className="text-sm">Active only</Label>
//                 </div>

//                 <Separator orientation="vertical" className="h-6" />

//                 <div className="flex rounded-lg border overflow-hidden">
//                   <Button
//                     variant={viewMode === "grid" ? "default" : "ghost"}
//                     size="sm"
//                     className="h-9 px-3"
//                     onClick={() => setViewMode("grid")}
//                   >
//                     <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
//                       <div className={cn("rounded-sm", viewMode === "grid" ? "bg-primary-foreground" : "bg-muted-foreground")}></div>
//                       <div className={cn("rounded-sm", viewMode === "grid" ? "bg-primary-foreground" : "bg-muted-foreground")}></div>
//                       <div className={cn("rounded-sm", viewMode === "grid" ? "bg-primary-foreground" : "bg-muted-foreground")}></div>
//                       <div className={cn("rounded-sm", viewMode === "grid" ? "bg-primary-foreground" : "bg-muted-foreground")}></div>
//                     </div>
//                   </Button>
//                   <Button
//                     variant={viewMode === "list" ? "default" : "ghost"}
//                     size="sm"
//                     className="h-9 px-3"
//                     onClick={() => setViewMode("list")}
//                   >
//                     <div className="flex flex-col gap-0.5 w-4 h-4">
//                       <div className={cn("h-1 w-full rounded-sm", viewMode === "list" ? "bg-primary-foreground" : "bg-muted-foreground")}></div>
//                       <div className={cn("h-1 w-full rounded-sm", viewMode === "list" ? "bg-primary-foreground" : "bg-muted-foreground")}></div>
//                       <div className={cn("h-1 w-full rounded-sm", viewMode === "list" ? "bg-primary-foreground" : "bg-muted-foreground")}></div>
//                     </div>
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Stores Content */}
//         <div>
//           {isLoading ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[...Array(itemsPerPage)].map((_, i) => (
//                 <StoreCardSkeleton key={i} />
//               ))}
//             </div>
//           ) : (
//             <>
//               {viewMode === "grid" ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {paginatedStores.map((store) => (
//                     <StoreCard key={store.id} store={store} formatDate={formatDate} />
//                   ))}
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {paginatedStores.map((store) => (
//                     <StoreListItem key={store.id} store={store} formatDate={formatDate} />
//                   ))}
//                 </div>
//               )}

//               {paginatedStores.length === 0 && (
//                 <div className="flex flex-col items-center justify-center py-16 text-center">
//                   <Store className="h-16 w-16 text-muted-foreground/50 mb-4" />
//                   <h3 className="text-xl font-medium mb-2">No stores found</h3>
//                   <p className="text-muted-foreground mb-6 max-w-md">
//                     {searchTerm || selectedCategory !== "all" || activeOnly
//                       ? "Try adjusting your search or filter criteria to find what you're looking for."
//                       : "You haven't created any stores yet. Get started by adding your first store."}
//                   </p>
//                   <Link href="/stores/add-edit">
//                     <Button>
//                       <Plus className="mr-2 h-4 w-4" />
//                       Add Your First Store
//                     </Button>
//                   </Link>
//                 </div>
//               )}
//             </>
//           )}

//           {/* Pagination */}
//           {!isLoading && filteredStores.length > 0 && totalPages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
//               <div className="text-sm text-muted-foreground">
//                 Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
//                 <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredStores.length)}</span> of{" "}
//                 <span className="font-medium">{filteredStores.length}</span> stores
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                   Previous
//                 </Button>
//                 <div className="flex items-center space-x-1">
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                     <Button
//                       key={page}
//                       variant={currentPage === page ? "default" : "outline"}
//                       size="sm"
//                       className="w-8 h-8 p-0"
//                       onClick={() => setCurrentPage(page)}
//                     >
//                       {page}
//                     </Button>
//                   ))}
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                 >
//                   Next
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Store Card Component for Grid View
// function StoreCard({ store, formatDate }) {
//   return (
//     <Card className="overflow-hidden transition-all hover:shadow-md group">
//       <div
//         className="h-2"
//         style={{ backgroundColor: store.theme.primary_color }}
//       />
//       <CardHeader className="pb-3">
//         <div className="flex items-start justify-between">
//           <div className="flex items-start space-x-3">
//             <div
//               className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium text-sm mt-1"
//               style={{ backgroundColor: store.theme.primary_color }}
//             >
//               {store.name.charAt(0)}
//             </div>
//             <div>
//               <CardTitle className="text-lg group-hover:text-primary transition-colors">{store.name}</CardTitle>
//               <CardDescription className="flex items-center mt-1">
//                 <Globe className="h-3 w-3 mr-1" />
//                 {store.domain}
//               </CardDescription>
//             </div>
//           </div>
//           <div className="flex items-center space-x-1">
//             <Badge variant={store.is_active ? "default" : "secondary"}>
//               {store.is_active ? "Active" : "Inactive"}
//             </Badge>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <MoreVertical className="h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem>
//                   <Eye className="h-4 w-4 mr-2" />
//                   View Store
//                 </DropdownMenuItem>
//                 <Link href={`/stores/add-edit?id=${store.id}`}>
//                   <DropdownMenuItem>
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit Store
//                   </DropdownMenuItem>
//                 </Link>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="pb-3">
//         <div className="space-y-3">
//           <div className="flex items-center text-sm text-muted-foreground">
//             <Mail className="h-4 w-4 mr-2" />
//             <span className="truncate">{store.config.contact_info.email}</span>
//           </div>
//           <div className="flex items-center text-sm text-muted-foreground">
//             <Phone className="h-4 w-4 mr-2" />
//             {store.config.contact_info.phone || "Not provided"}
//           </div>
//           <div className="flex items-center text-sm text-muted-foreground">
//             <Calendar className="h-4 w-4 mr-2" />
//             Created: {formatDate(store.created_at)}
//           </div>
//           <div className="pt-2">
//             <Badge variant="outline" className="mr-2 mb-2">
//               {store.category_id.name}
//             </Badge>
//           </div>
//         </div>
//       </CardContent>
//       <Separator />
//       <CardFooter className="pt-3">
//         <div className="flex justify-between w-full text-sm">
//           <div className="flex flex-col items-center">
//             <div className="flex items-center">
//               <Package className="h-4 w-4 mr-1 text-muted-foreground" />
//               <span className="font-medium">{store.stats.products}</span>
//             </div>
//             <span className="text-muted-foreground text-xs">Products</span>
//           </div>
//           <div className="flex flex-col items-center">
//             <div className="flex items-center">
//               <ShoppingCart className="h-4 w-4 mr-1 text-muted-foreground" />
//               <span className="font-medium">{store.stats.orders}</span>
//             </div>
//             <span className="text-muted-foreground text-xs">Orders</span>
//           </div>
//           <div className="flex flex-col items-center">
//             <div className="flex items-center">
//               <Users className="h-4 w-4 mr-1 text-muted-foreground" />
//               <span className="font-medium">{store.stats.customers}</span>
//             </div>
//             <span className="text-muted-foreground text-xs">Customers</span>
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

// // Store List Item Component for List View
// function StoreListItem({ store, formatDate }) {
//   return (
//     <Card className="overflow-hidden transition-all hover:shadow-md group">
//       <div className="flex">
//         <div
//           className="w-2 flex-shrink-0"
//           style={{ backgroundColor: store.theme.primary_color }}
//         />
//         <div className="flex-1 p-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="flex items-start space-x-4 flex-1">
//               <div
//                 className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-medium text-sm flex-shrink-0"
//                 style={{ backgroundColor: store.theme.primary_color }}
//               >
//                 {store.name.charAt(0)}
//               </div>
//               <div className="space-y-2 flex-1 min-w-0">
//                 <div className="flex items-center gap-2">
//                   <h3 className="text-xl font-semibold group-hover:text-primary transition-colors truncate">{store.name}</h3>
//                   <Badge variant={store.is_active ? "default" : "secondary"}>
//                     {store.is_active ? "Active" : "Inactive"}
//                   </Badge>
//                   <Badge variant="outline">
//                     {store.category_id.name}
//                   </Badge>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
//                   <div className="flex items-center">
//                     <Globe className="h-4 w-4 mr-1" />
//                     <span className="truncate">{store.domain}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Mail className="h-4 w-4 mr-1" />
//                     <span className="truncate">{store.config.contact_info.email}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Calendar className="h-4 w-4 mr-1" />
//                     {formatDate(store.created_at)}
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-6">
//               <div className="flex flex-col items-center">
//                 <div className="flex items-center">
//                   <Package className="h-4 w-4 mr-1 text-muted-foreground" />
//                   <span className="font-medium">{store.stats.products}</span>
//                 </div>
//                 <span className="text-muted-foreground text-xs">Products</span>
//               </div>
//               <div className="flex flex-col items-center">
//                 <div className="flex items-center">
//                   <ShoppingCart className="h-4 w-4 mr-1 text-muted-foreground" />
//                   <span className="font-medium">{store.stats.orders}</span>
//                 </div>
//                 <span className="text-muted-foreground text-xs">Orders</span>
//               </div>
//               <div className="flex flex-col items-center">
//                 <div className="flex items-center">
//                   <Users className="h-4 w-4 mr-1 text-muted-foreground" />
//                   <span className="font-medium">{store.stats.customers}</span>
//                 </div>
//                 <span className="text-muted-foreground text-xs">Customers</span>
//               </div>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem>
//                     <Eye className="h-4 w-4 mr-2" />
//                     View Store
//                   </DropdownMenuItem>
//                   <Link href={`/stores/add-edit?id=${store.id}`}>
//                     <DropdownMenuItem>
//                       <Edit className="h-4 w-4 mr-2" />
//                       Edit Store
//                     </DropdownMenuItem>
//                   </Link>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }

// // Skeleton component for loading state
// function StoreCardSkeleton() {
//   return (
//     <Card className="overflow-hidden border shadow-sm animate-pulse">
//       <div className="h-2 bg-muted" />
//       <CardHeader className="pb-3">
//         <div className="flex items-start justify-between">
//           <div className="flex items-start space-x-3">
//             <div className="w-10 h-10 rounded-lg bg-muted" />
//             <div className="space-y-2">
//               <div className="h-5 w-32 bg-muted rounded" />
//               <div className="h-4 w-24 bg-muted rounded" />
//             </div>
//           </div>
//           <div className="h-6 w-16 bg-muted rounded-full" />
//         </div>
//       </CardHeader>
//       <CardContent className="pb-3">
//         <div className="space-y-3">
//           <div className="h-4 w-full bg-muted rounded" />
//           <div className="h-4 w-3/4 bg-muted rounded" />
//           <div className="h-4 w-2/3 bg-muted rounded" />
//           <div className="pt-2">
//             <div className="h-6 w-20 bg-muted rounded-full" />
//           </div>
//         </div>
//       </CardContent>
//       <Separator />
//       <CardFooter className="pt-3">
//         <div className="flex justify-between w-full">
//           <div className="flex flex-col items-center space-y-1">
//             <div className="h-4 w-8 bg-muted rounded" />
//             <div className="h-3 w-12 bg-muted rounded" />
//           </div>
//           <div className="flex flex-col items-center space-y-1">
//             <div className="h-4 w-8 bg-muted rounded" />
//             <div className="h-3 w-12 bg-muted rounded" />
//           </div>
//           <div className="flex flex-col items-center space-y-1">
//             <div className="h-4 w-8 bg-muted rounded" />
//             <div className="h-3 w-12 bg-muted rounded" />
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }


import React from 'react'

export default function page() {
  return (
    <div>page</div>
  )
}
