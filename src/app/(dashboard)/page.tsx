"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAnalyticsStore } from "@/store/StoreAdmin/analyticsStore"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    ComposedChart,
    Legend
} from "recharts"
import { TrendingUp, TrendingDown, Users, ShoppingCart, Package, DollarSign, AlertTriangle, Eye, RefreshCw, Calendar, Download, ArrowUpRight, ArrowDownRight, Target, Clock, Star, Heart, ShoppingBag, Truck, CheckCircle, XCircle, AlertCircle, Info, BarChart3, ChevronRight, Search, Filter } from 'lucide-react'
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6']

// Enhanced Tooltip with consistent styling
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
                <p className="font-semibold mb-1 text-sm">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                        <span className="font-medium">{entry.name}:</span>
                        <span className="ml-auto">
                            {entry.name.toLowerCase().includes('revenue') || entry.name.toLowerCase().includes('price')
                                ? formatCurrency(entry.value)
                                : formatNumber(entry.value)}
                        </span>
                    </p>
                ))}
            </div>
        )
    }
    return null
}

// Improved Metric Card with consistent visual hierarchy
const MetricCard = ({
    title,
    value,
    icon: Icon,
    growth,
    description,
    color = "default",
    isLoading = false
}: {
    title: string
    value: string | number
    icon: any
    growth?: { value: number; isPositive: boolean; formatted: string }
    description?: string
    color?: "default" | "success" | "warning" | "danger"
    isLoading?: boolean
}) => {
    const colorClasses = {
        success: "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background",
        warning: "border-amber-200 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-background",
        danger: "border-rose-200 bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-background",
        default: "hover:border-primary/30 hover:shadow-md"
    }
    const iconColors = {
        success: "text-emerald-600 dark:text-emerald-400",
        warning: "text-amber-600 dark:text-amber-400",
        danger: "text-rose-600 dark:text-rose-400",
        default: "text-muted-foreground"
    }
    const valueColor = color !== "default" ? iconColors[color] : "text-foreground";

    return (
        <Card className={`transition-all duration-300 ${colorClasses[color]}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${color === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                    color === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' :
                        color === 'danger' ? 'bg-rose-100 dark:bg-rose-900/30' :
                            'bg-muted'}`}>
                    <Icon className={`h-4 w-4 ${iconColors[color]}`} />
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <>
                        <Skeleton className="h-8 w-32 mb-2" />
                        <Skeleton className="h-4 w-40" />
                    </>
                ) : (
                    <>
                        <div className={`text-2xl font-bold tracking-tight ${valueColor}`}>{value}</div>
                        {growth && (
                            <div className="flex items-center space-x-1 mt-2">
                                <div className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${growth.isPositive
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                    }`}>
                                    {growth.isPositive ? (
                                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 mr-0.5" />
                                    )}
                                    {growth.formatted}
                                </div>
                                <span className="text-xs text-muted-foreground">vs last period</span>
                            </div>
                        )}
                        {description && (
                            <p className="text-xs text-muted-foreground mt-1">{description}</p>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}

// Improved Data Card with consistent layout
const DataCard = ({
    title,
    description,
    icon: Icon,
    children,
    className = "",
    isLoading = false,
    action
}: {
    title: string;
    description?: string;
    icon?: any;
    children: React.ReactNode;
    className?: string;
    isLoading?: boolean;
    action?: React.ReactNode;
}) => (
    <Card className={`hover:shadow-lg transition-shadow duration-300 ${className}`}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                    {Icon && <Icon className="h-5 w-5 text-primary" />}
                    {title}
                </CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </div>
            {action && <div className="flex items-center gap-2">{action}</div>}
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-80 w-full" /> : children}
        </CardContent>
    </Card>
)

export default function AnalyticsPage() {
    const {
        dashboardData,
        salesAnalytics,
        topSellingProducts,
        customerAnalytics,
        inventoryAnalytics,
        loading,
        error,
        fetchDashboardData,
        fetchSalesAnalytics,
        fetchTopSellingProducts,
        fetchCustomerAnalytics,
        fetchInventoryAnalytics,
        clearError,
    } = useAnalyticsStore()
    const [selectedPeriod, setSelectedPeriod] = useState("30")
    const [activeTab, setActiveTab] = useState("overview")
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        loadAnalyticsData()
    }, [selectedPeriod])

    const loadAnalyticsData = async () => {
        setIsRefreshing(true)
        try {
            await Promise.all([
                fetchDashboardData(),
                fetchSalesAnalytics({ period: selectedPeriod }),
                fetchTopSellingProducts({ period: selectedPeriod, limit: 10 }),
                fetchCustomerAnalytics({ period: selectedPeriod }),
                fetchInventoryAnalytics(),
            ])
        } catch (err) {
            console.error("Failed to load analytics data:", err)
            toast.error("Failed to load analytics data")
        } finally {
            setIsRefreshing(false)
        }
    }

    const handleRefresh = () => {
        clearError()
        loadAnalyticsData()
        toast.info("Refreshing analytics data")
    }

    const handleExport = () => {
        toast.success("Exporting analytics data", {
            description: "Your report will be ready shortly."
        })
    }

    const getGrowthData = (current: number, previous: number = current * 0.85) => {
        const growth = ((current - previous) / previous) * 100
        return {
            value: growth,
            isPositive: growth >= 0,
            formatted: `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`
        }
    }

    const revenueGrowth = getGrowthData(dashboardData?.overview?.monthlyRevenue || 0)
    const ordersGrowth = getGrowthData(dashboardData?.overview?.totalOrders || 0)
    const customersGrowth = getGrowthData(dashboardData?.overview?.totalCustomers || 0)
    const productsGrowth = getGrowthData(dashboardData?.overview?.totalProducts || 0)

    if (error) {
        return (
            <div className="flex h-full items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Error Loading Analytics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{String(error)}</p>
                        <Button onClick={handleRefresh} className="w-full">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            {/* Enhanced Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Store Analytics
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Track performance, analyze trends, and make data-driven decisions
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                            <SelectTrigger className="w-40">
                                <Calendar className="mr-2 h-4 w-4" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Last 7 days</SelectItem>
                                <SelectItem value="30">Last 30 days</SelectItem>
                                <SelectItem value="90">Last 90 days</SelectItem>
                                <SelectItem value="365">Last year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                        <Button onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-muted/50">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-background">Overview</TabsTrigger>
                    <TabsTrigger value="sales" className="data-[state=active]:bg-background">Sales</TabsTrigger>
                    <TabsTrigger value="customers" className="data-[state=active]:bg-background">Customers</TabsTrigger>
                    <TabsTrigger value="products" className="data-[state=active]:bg-background">Products</TabsTrigger>
                    <TabsTrigger value="inventory" className="data-[state=active]:bg-background">Inventory</TabsTrigger>
                    <TabsTrigger value="insights" className="data-[state=active]:bg-background">Insights</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <MetricCard
                            title="Total Revenue"
                            value={formatCurrency(dashboardData?.overview?.monthlyRevenue || 0)}
                            icon={DollarSign}
                            growth={revenueGrowth}
                            description="Monthly revenue"
                            color="success"
                            isLoading={loading}
                        />
                        <MetricCard
                            title="Total Orders"
                            value={formatNumber(dashboardData?.overview?.totalOrders || 0)}
                            icon={ShoppingCart}
                            growth={ordersGrowth}
                            description="All time orders"
                            isLoading={loading}
                        />
                        <MetricCard
                            title="Total Customers"
                            value={formatNumber(dashboardData?.overview?.totalCustomers || 0)}
                            icon={Users}
                            growth={customersGrowth}
                            description="Registered customers"
                            isLoading={loading}
                        />
                        <MetricCard
                            title="Total Products"
                            value={formatNumber(dashboardData?.overview?.totalProducts || 0)}
                            icon={Package}
                            growth={productsGrowth}
                            description="Active products"
                            isLoading={loading}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <MetricCard
                            title="Pending Orders"
                            value={formatNumber(dashboardData?.overview?.pendingOrders || 0)}
                            icon={Clock}
                            description="Awaiting processing"
                            color={(dashboardData?.overview?.pendingOrders || 0) > 10 ? "warning" : "default"}
                            isLoading={loading}
                        />
                        <MetricCard
                            title="Low Stock Items"
                            value={formatNumber(dashboardData?.inventory?.lowStockCount || 0)}
                            icon={AlertTriangle}
                            description="Need restocking"
                            color={(dashboardData?.inventory?.lowStockCount || 0) > 5 ? "warning" : "default"}
                            isLoading={loading}
                        />
                        <MetricCard
                            title="Out of Stock"
                            value={formatNumber(dashboardData?.inventory?.outOfStockCount || 0)}
                            icon={XCircle}
                            description="Unavailable products"
                            color={(dashboardData?.inventory?.outOfStockCount || 0) > 0 ? "danger" : "success"}
                            isLoading={loading}
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <DataCard
                            title="Sales Trend"
                            description="Daily revenue over the selected period"
                            icon={TrendingUp}
                            isLoading={loading}
                        >
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={salesAnalytics?.salesTrend || []}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="_id" style={{ fontSize: '12px' }} />
                                    <YAxis style={{ fontSize: '12px' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </DataCard>
                        <DataCard
                            title="Order Status Distribution"
                            description="Breakdown of orders by status"
                            icon={Target}
                            isLoading={loading}
                        >
                            <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                    <Pie
                                        data={salesAnalytics?.orderStats || []}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${((percent as any) * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="_id"
                                    >
                                        {(salesAnalytics?.orderStats || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </DataCard>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShoppingBag className="h-5 w-5 text-primary" />
                                        Recent Orders
                                    </CardTitle>
                                    <CardDescription>Latest customer purchases</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs h-8">
                                    View all <ChevronRight className="ml-1 h-3 w-3" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="space-y-3">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="space-y-2 flex-1">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-24" />
                                                </div>
                                                <Skeleton className="h-4 w-16" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {dashboardData?.recentActivity?.recentOrders?.slice(0, 5).map((order) => (
                                            <div key={order._id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                        <ShoppingCart className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{order.user_id?.name || 'Unknown'}</p>
                                                        <p className="text-xs text-muted-foreground">{order.user_id?.email || 'No email'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold">{formatCurrency(order.total_amount)}</p>
                                                    <Badge variant={
                                                        order.status === 'completed' ? 'default' :
                                                            order.status === 'pending' ? 'secondary' :
                                                                order.status === 'cancelled' ? 'destructive' : 'outline'
                                                    } className="text-xs mt-1">
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        )) || <p className="text-sm text-muted-foreground text-center py-8">No recent orders</p>}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Star className="h-5 w-5 text-primary" />
                                        Top Rated Products
                                    </CardTitle>
                                    <CardDescription>Best performing by customer rating</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs h-8">
                                    View all <ChevronRight className="ml-1 h-3 w-3" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="space-y-3">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                                                <Skeleton className="h-10 w-10 rounded" />
                                                <div className="space-y-2 flex-1">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-24" />
                                                </div>
                                                <Skeleton className="h-4 w-16" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {dashboardData?.recentActivity?.topProducts?.slice(0, 5).map((product) => (
                                            <div key={product._id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded overflow-hidden bg-muted flex items-center justify-center">
                                                        {product.images?.[0] ? (
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                className="h-10 w-10 object-cover"
                                                            />
                                                        ) : (
                                                            <Package className="h-5 w-5 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-3 w-3 ${i < Math.floor(product.ratings?.average || 0)
                                                                        ? "text-yellow-400 fill-current"
                                                                        : "text-gray-300"
                                                                        }`}
                                                                />
                                                            ))}
                                                            <span className="text-xs text-muted-foreground ml-1">
                                                                ({product.ratings?.count || 0})
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-semibold">{formatCurrency(product.price)}</p>
                                            </div>
                                        )) || <p className="text-sm text-muted-foreground text-center py-8">No products available</p>}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {dashboardData?.inventory && (
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                                    Inventory Status Overview
                                </CardTitle>
                                <CardDescription>Current stock levels across all products</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-background">
                                        <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                                            <XCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                                            <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">
                                                {dashboardData.inventory.outOfStockCount}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-background">
                                        <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                                            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                                {dashboardData.inventory.lowStockCount}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background">
                                        <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                            <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">In Stock</p>
                                            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                                {(dashboardData.inventory.totalProducts || 0) -
                                                    (dashboardData.inventory.outOfStockCount || 0) -
                                                    (dashboardData.inventory.lowStockCount || 0)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Sales Tab */}
                <TabsContent value="sales" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        <MetricCard
                            title="Total Revenue"
                            value={formatCurrency(salesAnalytics?.summary?.totalRevenue || 0)}
                            icon={DollarSign}
                            description="All time revenue"
                            color="success"
                            isLoading={loading}
                        />
                        <MetricCard
                            title="Total Orders"
                            value={formatNumber(salesAnalytics?.summary?.totalOrders || 0)}
                            icon={ShoppingCart}
                            description="All time orders"
                            isLoading={loading}
                        />
                        <MetricCard
                            title="Average Order Value"
                            value={formatCurrency(salesAnalytics?.summary?.averageOrderValue || 0)}
                            icon={Target}
                            description="Per order average"
                            isLoading={loading}
                        />
                        <MetricCard
                            title="Conversion Rate"
                            value="2.4%"
                            icon={TrendingUp}
                            description="Visitors to customers"
                            isLoading={loading}
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <DataCard
                            title="Revenue Trend"
                            description="Daily revenue and order volume"
                            isLoading={loading}
                        >
                            <ResponsiveContainer width="100%" height={320}>
                                <ComposedChart data={salesAnalytics?.salesTrend || []}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="_id" style={{ fontSize: '12px' }} />
                                    <YAxis yAxisId="left" style={{ fontSize: '12px' }} />
                                    <YAxis yAxisId="right" orientation="right" style={{ fontSize: '12px' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar yAxisId="left" dataKey="orders" fill="#3b82f6" name="Orders" radius={[4, 4, 0, 0]} />
                                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                                    <Legend />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </DataCard>
                        <DataCard
                            title="Payment Methods"
                            description="Revenue distribution by payment type"
                            isLoading={loading}
                        >
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={salesAnalytics?.paymentStats || []}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="_id" style={{ fontSize: '12px' }} />
                                    <YAxis style={{ fontSize: '12px' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" radius={[4, 4, 0, 0]} />
                                    <Legend />
                                </BarChart>
                            </ResponsiveContainer>
                        </DataCard>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <DataCard
                            title="Sales by Category"
                            description="Revenue distribution across product categories"
                            isLoading={loading}
                        >
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={salesAnalytics?.categoryStats || []}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="_id" style={{ fontSize: '12px' }} />
                                    <YAxis style={{ fontSize: '12px' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="revenue" fill="#f59e0b" name="Revenue" radius={[4, 4, 0, 0]} />
                                    <Legend />
                                </BarChart>
                            </ResponsiveContainer>
                        </DataCard>
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>Sales Performance Metrics</CardTitle>
                                <CardDescription>Key performance indicators breakdown</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {[
                                    { label: "Online Sales", value: 65, color: "bg-blue-500" },
                                    { label: "In-Store Sales", value: 35, color: "bg-green-500" },
                                    { label: "Mobile Sales", value: 45, color: "bg-purple-500" },
                                ].map((item, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">{item.label}</span>
                                            <span className="text-sm font-semibold">{item.value}%</span>
                                        </div>
                                        <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`absolute top-0 left-0 h-full ${item.color} transition-all duration-500`}
                                                style={{ width: `${item.value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Customers Tab */}
                <TabsContent value="customers" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        <MetricCard
                            title="Total Customers"
                            value={formatNumber(customerAnalytics?.stats?.totalCustomers || 0)}
                            icon={Users}
                            description="All registered users"
                            isLoading={loading}
                        />
                        <MetricCard
                            title="Active Customers"
                            value={formatNumber(customerAnalytics?.stats?.activeCustomers || 0)}
                            icon={Eye}
                            description="Active in last 30 days"
                            isLoading={loading}
                        />
                        <MetricCard
                            title="Repeat Customers"
                            value={formatNumber(customerAnalytics?.retention?.repeatCustomers || 0)}
                            icon={Heart}
                            description="Multiple purchases"
                            isLoading={loading}
                        />
                        <MetricCard
                            title="Retention Rate"
                            value={formatPercentage(customerAnalytics?.retention?.retentionRate || 0)}
                            icon={Target}
                            description="Customer retention"
                            color="success"
                            isLoading={loading}
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <DataCard
                            title="Customer Growth"
                            description="New customer registrations over time"
                            isLoading={loading}
                        >
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={customerAnalytics?.customerGrowth || []}>
                                    <defs>
                                        <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="_id" style={{ fontSize: '12px' }} />
                                    <YAxis style={{ fontSize: '12px' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="newCustomers"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorCustomers)"
                                        name="New Customers"
                                    />
                                    <Legend />
                                </AreaChart>
                            </ResponsiveContainer>
                        </DataCard>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div>
                                    <CardTitle>Top Customers</CardTitle>
                                    <CardDescription>Highest spending customers</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" className="h-8">
                                    <Filter className="h-4 w-4 mr-1" />
                                    Filter
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="space-y-3">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="space-y-2 flex-1">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-24" />
                                                </div>
                                                <Skeleton className="h-4 w-16" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {customerAnalytics?.topCustomers?.slice(0, 5).map((customer, index) => (
                                            <div key={customer.customerId} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                                                        #{index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{customer.customerName}</p>
                                                        <p className="text-xs text-muted-foreground">{customer.customerEmail}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold">{formatCurrency(customer.totalSpent)}</p>
                                                    <p className="text-xs text-muted-foreground">{customer.orderCount} orders</p>
                                                </div>
                                            </div>
                                        )) || <p className="text-sm text-muted-foreground text-center py-8">No customer data available</p>}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Customer Demographics</CardTitle>
                            <CardDescription>Geographic and device usage breakdown</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 lg:grid-cols-2">
                                <div>
                                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-primary"></span>
                                        By Location
                                    </h3>
                                    {loading ? (
                                        <Skeleton className="h-64 w-full" />
                                    ) : (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={[
                                                { name: 'United States', value: 400 },
                                                { name: 'United Kingdom', value: 300 },
                                                { name: 'Canada', value: 200 },
                                                { name: 'Australia', value: 150 },
                                                { name: 'Germany', value: 100 },
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                                <XAxis dataKey="name" style={{ fontSize: '11px' }} />
                                                <YAxis style={{ fontSize: '12px' }} />
                                                <Tooltip />
                                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-primary"></span>
                                        By Device
                                    </h3>
                                    {loading ? (
                                        <Skeleton className="h-64 w-full" />
                                    ) : (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'Mobile', value: 45 },
                                                        { name: 'Desktop', value: 35 },
                                                        { name: 'Tablet', value: 20 },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name} ${((percent as any) * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    <Cell fill="#3b82f6" />
                                                    <Cell fill="#10b981" />
                                                    <Cell fill="#f59e0b" />
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Products Tab */}
                <TabsContent value="products" className="space-y-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <div>
                                <CardTitle>Top Selling Products</CardTitle>
                                <CardDescription>Best performing products by sales volume</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search products..." className="pl-9 w-48 h-9" />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-9">
                                            <Filter className="h-4 w-4 mr-1" />
                                            Filter
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>All Products</DropdownMenuItem>
                                        <DropdownMenuItem>In Stock</DropdownMenuItem>
                                        <DropdownMenuItem>Out of Stock</DropdownMenuItem>
                                        <DropdownMenuItem>Low Stock</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="space-y-3">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                                            <Skeleton className="h-12 w-12 rounded" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-48" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <></>
                                // <div className="space-y-2">
                                //     {topSellingProducts?.map((product, index) => (
                                //         <div key={product.productId} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                //             <div className="flex items-center gap-4">
                                //                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
                                //                     #{index + 1}
                                //                 </div>
                                //                 <div className="h-12 w-12 rounded overflow-hidden bg-muted flex items-center justify-center">
                                //                     {product.productImage ? (
                                //                         <img
                                //                             src={product.productImage}
                                //                             alt={product.productName}
                                //                             className="h-12 w-12 object-cover"
                                //                         />
                                //                     ) : (
                                //                         <Package className="h-6 w-6 text-muted-foreground" />
                                //                     )}
                                //                 </div>
                                //                 <div>
                                //                     <p className="text-sm font-medium">{product.productName}</p>
                                //                     <p className="text-xs text-muted-foreground">
                                //                         {formatCurrency(product.price)} â  ¢ {product.orderCount} orders
                                //                     </p>
                                //                 </div>
                                //             </div>
                                //             <div className="text-right">
                                //                 <p className="text-sm font-semibold">{formatNumber(product.totalSold)} sold</p>
                                //                 <p className="text-xs text-muted-foreground">{formatCurrency(product.totalRevenue)} revenue</p>
                                //             </div>
                                //         </div>
                                //     )) || <p className="text-sm text-muted-foreground text-center py-8">No product data available</p>}
                                // </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <DataCard
                            title="Product Categories"
                            description="Revenue by product category"
                            isLoading={loading}
                        >
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={[
                                    { name: 'Electronics', revenue: 4000 },
                                    { name: 'Clothing', revenue: 3000 },
                                    { name: 'Home & Kitchen', revenue: 2000 },
                                    { name: 'Books', revenue: 1500 },
                                    { name: 'Beauty', revenue: 1000 },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                                    <YAxis style={{ fontSize: '12px' }} />
                                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                                    <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </DataCard>

                        <DataCard
                            title="Product Ratings"
                            description="Distribution of product ratings"
                            isLoading={loading}
                        >
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={[
                                    { rating: '5 stars', count: 45 },
                                    { rating: '4 stars', count: 30 },
                                    { rating: '3 stars', count: 15 },
                                    { rating: '2 stars', count: 7 },
                                    { rating: '1 star', count: 3 },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="rating" style={{ fontSize: '12px' }} />
                                    <YAxis style={{ fontSize: '12px' }} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </DataCard>
                    </div>
                </TabsContent>

                {/* Inventory Tab */}
                <TabsContent value="inventory" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        <MetricCard
                            title="Total Products"
                            value={formatNumber(inventoryAnalytics?.summary?.totalProducts || 0)}
                            icon={Package}
                            description="All products"
                            isLoading={loading}
                        />
                        <MetricCard
                            title="Total Stock"
                            value={formatNumber(inventoryAnalytics?.summary?.totalStock || 0)}
                            icon={BarChart3}
                            description="Units in inventory"
                            isLoading={loading}
                        />
                        <MetricCard
                            title="Inventory Value"
                            value={formatCurrency(inventoryAnalytics?.summary?.totalValue || 0)}
                            icon={DollarSign}
                            description="Total inventory worth"
                            color="success"
                            isLoading={loading}
                        />
                        <MetricCard
                            title="Average Price"
                            value={formatCurrency(inventoryAnalytics?.summary?.averagePrice || 0)}
                            icon={Target}
                            description="Per product average"
                            isLoading={loading}
                        />
                    </div>

                    <DataCard
                        title="Products by Category"
                        description="Inventory distribution across categories"
                        isLoading={loading}
                    >
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={inventoryAnalytics?.categoryBreakdown || []}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="_id" style={{ fontSize: '12px' }} />
                                <YAxis style={{ fontSize: '12px' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="productCount" fill="#8b5cf6" name="Products" radius={[4, 4, 0, 0]} />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                    </DataCard>

                    <Card className="border-2 border-amber-200 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                Low Stock Alert
                            </CardTitle>
                            <CardDescription>Products that need restocking soon</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="space-y-3">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 rounded-lg border">
                                            <Skeleton className="h-12 w-12 rounded" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                            <Skeleton className="h-9 w-20" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {[
                                        { name: "Wireless Headphones", stock: 3, threshold: 10 },
                                        { name: "Smart Watch", stock: 5, threshold: 15 },
                                        { name: "Bluetooth Speaker", stock: 2, threshold: 8 },
                                        { name: "Phone Case", stock: 7, threshold: 20 },
                                    ].map((product, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 rounded-lg border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white dark:from-amber-950/20 dark:to-background">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                                    <Package className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{product.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Only <span className="font-semibold text-amber-600 dark:text-amber-400">{product.stock}</span> left in stock
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="h-9">
                                                <Truck className="h-4 w-4 mr-1" />
                                                Restock
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Insights Tab */}
                <TabsContent value="insights" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="h-5 w-5 text-primary" />
                                    Key Insights
                                </CardTitle>
                                <CardDescription>Important highlights from your analytics</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                                    <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <AlertTitle className="text-blue-800 dark:text-blue-300">Revenue Growth</AlertTitle>
                                    <AlertDescription className="text-blue-700 dark:text-blue-400">
                                        Revenue is up {revenueGrowth.formatted} compared to last period. Keep up the great work!
                                    </AlertDescription>
                                </Alert>
                                {(dashboardData?.inventory?.lowStockCount || 0) > 0 && (
                                    <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        <AlertTitle className="text-amber-800 dark:text-amber-300">Inventory Alert</AlertTitle>
                                        <AlertDescription className="text-amber-700 dark:text-amber-400">
                                            You have {dashboardData?.inventory?.lowStockCount} products running low on stock. Consider restocking soon.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                <Alert className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
                                    <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    <AlertTitle className="text-emerald-800 dark:text-emerald-300">Customer Retention</AlertTitle>
                                    <AlertDescription className="text-emerald-700 dark:text-emerald-400">
                                        Customer retention rate is {formatPercentage(customerAnalytics?.retention?.retentionRate || 0)}.
                                        Focus on customer satisfaction to improve retention.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-primary" />
                                    Recommendations
                                </CardTitle>
                                <CardDescription>Actionable insights for growth</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background border border-emerald-200 dark:border-emerald-800">
                                    <div className="mt-0.5">
                                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">Optimize Top Products</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Focus marketing efforts on your best-selling products to maximize revenue.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-white dark:from-amber-950/20 dark:to-background border border-amber-200 dark:border-amber-800">
                                    <div className="mt-0.5">
                                        <AlertCircle className="h-5 w-5 text-amber-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">Inventory Management</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Set up automated reorder points to prevent stockouts and maintain optimal inventory levels.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/20 dark:to-background border border-blue-200 dark:border-blue-800">
                                    <div className="mt-0.5">
                                        <Info className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">Customer Engagement</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Implement loyalty programs and personalized marketing to increase customer retention.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Performance Summary</CardTitle>
                            <CardDescription>Key metrics compared to previous period</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    { label: "Revenue", current: 12540, previous: 10890, icon: DollarSign },
                                    { label: "Orders", current: 245, previous: 210, icon: ShoppingCart },
                                    { label: "Customers", current: 156, previous: 130, icon: Users },
                                    { label: "Conversion", current: 2.8, previous: 2.3, icon: TrendingUp, isPercent: true },
                                ].map((metric, index) => {
                                    const growth = ((metric.current - metric.previous) / metric.previous) * 100
                                    const isPositive = growth >= 0
                                    return (
                                        <div key={index} className="flex flex-col items-center justify-center p-5 rounded-lg border-2 hover:border-primary/50 transition-all bg-gradient-to-br from-muted/50 to-background">
                                            <div className={`p-3 rounded-full mb-3 ${isPositive ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-rose-100 dark:bg-rose-900/30'}`}>
                                                <metric.icon className={`h-6 w-6 ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-1">
                                                {metric.isPercent ? `${metric.current}%` : metric.label === "Revenue" ? formatCurrency(metric.current) : formatNumber(metric.current)}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                                            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${isPositive
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                                }`}>
                                                {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                                {`${isPositive ? '+' : ''}${growth.toFixed(1)}%`}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-primary" />
                                    Sales Velocity
                                </CardTitle>
                                <CardDescription>Daily sales performance trends</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={salesAnalytics?.salesTrend?.slice(-14) || []}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis dataKey="_id" style={{ fontSize: '11px' }} />
                                        <YAxis style={{ fontSize: '12px' }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="orders"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{ fill: '#3b82f6', r: 4 }}
                                            name="Orders"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-primary" />
                                    Goal Progress
                                </CardTitle>
                                <CardDescription>Monthly targets and achievements</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {[
                                    { label: "Revenue Goal", current: 12540, target: 15000, color: "bg-blue-500" },
                                    { label: "Order Goal", current: 245, target: 300, color: "bg-green-500" },
                                    { label: "Customer Goal", current: 156, target: 200, color: "bg-purple-500" },
                                ].map((goal, index) => {
                                    const progress = (goal.current / goal.target) * 100
                                    return (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">{goal.label}</span>
                                                <div className="text-right">
                                                    <span className="text-sm font-semibold">
                                                        {goal.label.includes("Revenue") ? formatCurrency(goal.current) : formatNumber(goal.current)}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground"> / {goal.label.includes("Revenue") ? formatCurrency(goal.target) : formatNumber(goal.target)}</span>
                                                </div>
                                            </div>
                                            <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`absolute top-0 left-0 h-full ${goal.color} transition-all duration-500`}
                                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {progress.toFixed(1)}% complete
                                            </p>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}