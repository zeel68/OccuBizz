'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import apiClient from '@/lib/apiCalling';
import { ApiResponse } from '@/models/api.model';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  ShoppingCart,
  Activity,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Calendar,
  Filter,
  Users,
  Target,
  Zap,
  ChevronRight,
  Heart,
  ShoppingBag,
} from 'lucide-react';

// Types based on the API response
interface MostViewedProduct {
  _id: string;
  totalViews: number;
  avgViewDuration: number;
  avgScrollDepth: number;
  interactions: number;
  lastViewed: string;
  uniqueViewerCount: number;
  engagementRate: number;
  productId: string;
  productName?: string;
  productImage?: string;
  price?: number;
  stock?: number;
  bounceRate: number;
  viewsPerUser: number;
}

interface MostAddedToCart {
  _id: string;
  totalAdds: number;
  uniqueUserCount: number;
  totalQuantity: number;
  totalValue: number;
  avgPrice: number;
  productId: string;
  productName?: string;
  productImage?: string;
  price?: number;
  avgCartValue: number;
  addsPerUser: number;
}

interface MostWishlisted {
  _id: string;
  totalWishlists: number;
  uniqueUserCount: number;
  productId: string;
  productName?: string;
  productImage?: string;
  price?: number;
  wishlistEngagement: number;
  potentialRevenue: number;
}

interface ConversionFunnel {
  _id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
  ratings: {
    average: number;
    count: number;
  };
  viewCount: number;
  cartAddCount: number;
  wishlistCount: number;
  orderCount: number;
  totalRevenue: number;
  viewToCartRate: number;
  cartToOrderRate: number;
  overallConversionRate: number;
}

interface ProductEngagement {
  _id: string;
  avgEngagementTime: number;
  avgScrollDepth: number;
  totalViews: number;
  interactions: number;
  uniqueViewerCount: number;
  engagementScore: number;
  productId: string;
  productName?: string;
  viewsPerUser: number;
}

interface ProductRevenueAnalysis {
  _id: string;
  totalRevenue: number;
  totalQuantitySold: number;
  orderCount: number;
  avgPrice: number;
  maxPrice: number;
  minPrice: number;
  revenuePerUnit: number;
  avgOrderValue: number;
  uniqueCustomerCount: number;
  revenuePerCustomer: number;
  productId: string;
  productName?: string;
  productImage?: string;
  category?: string;
  profitMargin: number;
  currentStock?: number;
}

interface ProductInventoryHealth {
  _id: string;
  monthlyPerformance: {
    month: number;
    quantitySold: number;
    revenue: number;
  }[];
  totalSold: number;
  totalRevenue: number;
  productId: string;
  productName?: string;
  currentStock?: number;
}

interface ProductSeasonality {
  _id: string;
  monthlyPerformance: {
    month: number;
    quantitySold: number;
    revenue: number;
  }[];
  totalSold: number;
  totalRevenue: number;
  productId: string;
  productName?: string;
}

interface ProductCompetitiveAnalysis {
  _id: string;
  categoryRevenue: number;
  avgPrice: number;
  category: string;
  products: {
    productId: string;
    name: string;
    price: number;
    totalRevenue: number;
    viewCount: number;
    cartAddCount: number;
    orderCount: number;
    ratings: {
      average: number;
      count: number;
    };
    stock: number;
    marketShare: number;
    pricePosition: string;
  }[];
  productCount: number;
}

interface ChartsData {
  productPerformance: {
    name: string;
    views: number;
    adds: number;
    wishlists: number;
    revenue: number;
  }[];
  conversionFunnelData: {
    name: string;
    views: number;
    cartAdds: number;
    orders: number;
    conversionRate: number;
  }[];
  inventoryHealth: {
    name: string;
    stock: number;
    health: string;
    urgency: string;
  }[];
}

interface AnalyticsData {
  mostViewedProducts: MostViewedProduct[];
  mostAddedToCart: MostAddedToCart[];
  mostWishlisted: MostWishlisted[];
  conversionFunnel: ConversionFunnel[];
  productEngagement: ProductEngagement[];
  abandonedCartProducts: ProductRevenueAnalysis[];
  productRevenueAnalysis: ProductRevenueAnalysis[];
  productInventoryHealth: ProductInventoryHealth[];
  productSeasonality: ProductSeasonality[];
  productCompetitiveAnalysis: ProductCompetitiveAnalysis[];
  charts: ChartsData;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-4">
      <p className="font-semibold text-sm mb-3">{label}</p>
      <div className="space-y-2">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
            </div>
            <span className="font-semibold">
              {typeof entry.value === 'number'
                ? entry.value.toLocaleString()
                : entry.value
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Metric card component
const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  loading = false
}: any) => {
  const colorClasses = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent text-accent-foreground',
    muted: 'bg-muted text-muted-foreground',
  };

  if (loading) {
    return (
      <Card className="border">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-40" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${trend >= 0
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
              {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold mb-1">{value}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Product card component
const ProductCard = ({ product, index, value, subtitle, trend, onClick }: any) => (
  <div
    className="group p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-all cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
          {index + 1}
        </div>
        <div>
          <p className="font-semibold text-sm line-clamp-1">{product.productName || 'Unknown Product'}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold">{value}</span>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
          {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(trend).toFixed(1)}%
        </div>
      )}
    </div>
  </div>
);

// Inventory health badge component
const InventoryHealthBadge = ({ stock }: { stock: number }) => {
  if (stock === 0) {
    return (
      <Badge variant="destructive">Out of Stock</Badge>
    );
  } else if (stock <= 10) {
    return (
      <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300">
        Low Stock
      </Badge>
    );
  } else if (stock <= 50) {
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300">
        Medium Stock
      </Badge>
    );
  } else {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300">
        Healthy Stock
      </Badge>
    );
  }
};

export default function ProductPerformanceAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('period', period);
      if (startDate) params.append('start', startDate.toISOString());
      if (endDate) params.append('end', endDate.toISOString());

      const response = await apiClient.get(`/store-admin/reports/productperformance`) as ApiResponse<any>;

      if (!response.success) {
        throw new Error('Failed to fetch analytics data');
      }

      const result = response.data as any;
      setData(result.data);
    } catch (err) {
      setError('An error occurred while fetching analytics data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const mostViewedProducts = data?.mostViewedProducts || [];
  const mostAddedToCart = data?.mostAddedToCart || [];
  const mostWishlisted = data?.mostWishlisted || [];
  const conversionFunnel = data?.conversionFunnel || [];
  const productEngagement = data?.productEngagement || [];
  const abandonedCartProducts = data?.abandonedCartProducts || [];
  const productRevenueAnalysis = data?.productRevenueAnalysis || [];
  const productInventoryHealth = data?.productInventoryHealth || [];
  const productSeasonality = data?.productSeasonality || [];
  const productCompetitiveAnalysis = data?.productCompetitiveAnalysis || [];
  const chartsData = data?.charts || {
    productPerformance: [],
    conversionFunnelData: [],
    inventoryHealth: []
  };

  // Calculate total metrics
  const totalViews = mostViewedProducts.reduce((sum, product) => sum + product.totalViews, 0);
  const totalRevenue = productRevenueAnalysis.reduce((sum, product) => sum + product.totalRevenue, 0);
  const totalOrders = conversionFunnel.reduce((sum, product) => sum + product.orderCount, 0);
  const avgConversionRate = conversionFunnel.length > 0
    ? conversionFunnel.reduce((sum, product) => sum + product.overallConversionRate, 0) / conversionFunnel.length
    : 0;

  // Get top products by revenue
  const topRevenueProducts = [...productRevenueAnalysis]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  // Get low stock products
  const lowStockProducts = productInventoryHealth
    .filter(product => (product.currentStock || 0) <= 10)
    .slice(0, 5);

  // Process seasonality data for charts
  const seasonalityChartData = productSeasonality.map(product => {
    const monthlyData: any = { name: product.productName || 'Unknown' };

    product?.monthlyPerformance?.forEach(month => {
      monthlyData[monthNames[month.month - 1]] = month.quantitySold;
    });

    return monthlyData;
  });

  // Process competitive analysis data
  const competitiveChartData = productCompetitiveAnalysis.map(category => ({
    name: category.category || 'Uncategorized',
    revenue: category.categoryRevenue,
    avgPrice: category.avgPrice,
    productCount: category.productCount
  }));

  const exportData = () => {
    console.log('Exporting data...');
    // Implement export functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="space-y-4">
              <Skeleton className="h-10 w-80" />
              <Skeleton className="h-5 w-96" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Metrics Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <MetricCard key={i} loading />
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Failed to Load Data</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={fetchData}
                  className="bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  size="lg"
                >
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-xl">
                <Package className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Product Analytics</h1>
                <p className="text-muted-foreground text-lg">
                  Real-time insights into product performance and customer behavior
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>

            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={fetchData}
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Product Views"
            value={totalViews.toLocaleString()}
            subtitle={`Across ${mostViewedProducts.length} products`}
            icon={<Eye className="h-6 w-6" />}
            trend={8.5}
            color="primary"
          />
          <MetricCard
            title="Total Revenue"
            value={`$${(totalRevenue / 1000).toFixed(1)}K`}
            subtitle={`From ${totalOrders} orders`}
            icon={<DollarSign className="h-6 w-6" />}
            trend={12.3}
            color="secondary"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${avgConversionRate.toFixed(1)}%`}
            subtitle="Average product conversion"
            icon={<Target className="h-6 w-6" />}
            trend={5.7}
            color="accent"
          />
          <MetricCard
            title="Active Products"
            value={productRevenueAnalysis.length.toLocaleString()}
            subtitle="In catalog with sales"
            icon={<ShoppingBag className="h-6 w-6" />}
            trend={15.2}
            color="muted"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-card border p-1">
            {[
              { value: 'overview', label: 'Overview', icon: Activity },
              { value: 'engagement', label: 'Engagement', icon: Eye },
              { value: 'conversion', label: 'Conversion', icon: TrendingUp },
              { value: 'inventory', label: 'Inventory', icon: Package },
              { value: 'insights', label: 'Insights', icon: Sparkles },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Performance Chart */}
              <Card className="border">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Product Performance</CardTitle>
                      <CardDescription>
                        Views, cart adds, wishlists, and revenue comparison
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={chartsData.productPerformance.slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis
                        dataKey="name"
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="views"
                        fill="var(--chart-1)"
                        name="Views"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="adds"
                        fill="var(--chart-2)"
                        name="Cart Adds"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="wishlists"
                        fill="var(--chart-3)"
                        name="Wishlists"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="var(--chart-4)"
                        name="Revenue"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card className="border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Top Revenue Products</CardTitle>
                  <CardDescription>
                    Products generating the most revenue this period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topRevenueProducts.map((product, idx) => (
                      <ProductCard
                        key={idx}
                        product={product}
                        index={idx}
                        value={`$${product?.totalRevenue?.toLocaleString()}`}
                        subtitle={`${product.totalQuantitySold} sold • ${product.orderCount} orders`}
                        trend={12.5}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Users className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Most Viewed</p>
                      <p className="text-2xl font-bold">
                        {mostViewedProducts[0]?.totalViews?.toLocaleString() || '0'}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {mostViewedProducts[0]?.productName || 'No data'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Target className="h-6 w-6 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Best Converter</p>
                      <p className="text-2xl font-bold">
                        {conversionFunnel.sort((a, b) => b.overallConversionRate - a.overallConversionRate)[0]?.overallConversionRate.toFixed(1) || '0'}%
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {conversionFunnel.sort((a, b) => b.overallConversionRate - a.overallConversionRate)[0]?.name || 'No data'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-100 rounded-xl">
                      <Zap className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Fastest Mover</p>
                      <p className="text-2xl font-bold">
                        +{15.2}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Sales growth this month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Viewed Products */}
              <Card className="border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Most Viewed Products</CardTitle>
                  <CardDescription>
                    Products with highest engagement and view counts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mostViewedProducts.slice(0, 6).map((product, idx) => (
                      <ProductCard
                        key={idx}
                        product={product}
                        index={idx}
                        value={product.totalViews.toLocaleString()}
                        subtitle={`${product.uniqueViewerCount} unique viewers • ${product.bounceRate.toFixed(1)}% bounce`}
                        trend={8.5}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Metrics Chart */}
              <Card className="border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Engagement Score Distribution</CardTitle>
                  <CardDescription>
                    How products perform across engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={productEngagement.slice(0, 8)}
                      layout="vertical"
                      margin={{ left: 100 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis
                        dataKey="productName"
                        type="category"
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="engagementScore"
                        fill="var(--secondary)"
                        radius={[0, 4, 4, 0]}
                        name="Engagement Score"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Engagement Details Table */}
            <Card className="border">
              <CardHeader>
                <CardTitle>Engagement Details</CardTitle>
                <CardDescription>Detailed engagement metrics for top products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Product</th>
                        <th className="text-right p-3 font-semibold">Views</th>
                        <th className="text-right p-3 font-semibold">Avg. Duration</th>
                        <th className="text-right p-3 font-semibold">Scroll Depth</th>
                        <th className="text-right p-3 font-semibold">Interactions</th>
                        <th className="text-right p-3 font-semibold">Engagement Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productEngagement.slice(0, 10).map((product, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-3 font-medium">{product.productName || 'Unknown Product'}</td>
                          <td className="p-3 text-right">{product.totalViews}</td>
                          <td className="p-3 text-right">{product.avgEngagementTime.toFixed(2)}s</td>
                          <td className="p-3 text-right">{product.avgScrollDepth.toFixed(1)}%</td>
                          <td className="p-3 text-right">{product.interactions}</td>
                          <td className="p-3 text-right font-semibold">{product.engagementScore.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversion Tab */}
          <TabsContent value="conversion" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversion Rates */}
              <Card className="border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Conversion Rates</CardTitle>
                  <CardDescription>Products with highest conversion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={conversionFunnel.slice(0, 10).sort((a, b) => b.overallConversionRate - a.overallConversionRate)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="overallConversionRate" fill="var(--chart-1)" radius={[8, 8, 0, 0]} name="Conversion Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue Analysis */}
              <Card className="border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Revenue Distribution</CardTitle>
                  <CardDescription>Revenue share across top products</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={topRevenueProducts as any}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ percent }) => `${((percent as any) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="totalRevenue"
                      >
                        {topRevenueProducts.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`var(--chart-${(index % 5) + 1})`}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={<CustomTooltip />}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Conversion Funnel Details */}
            <Card className="border">
              <CardHeader>
                <CardTitle>Conversion Funnel Details</CardTitle>
                <CardDescription>Detailed conversion metrics for all products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Product</th>
                        <th className="text-right p-3 font-semibold">Views</th>
                        <th className="text-right p-3 font-semibold">Cart Adds</th>
                        <th className="text-right p-3 font-semibold">Orders</th>
                        <th className="text-right p-3 font-semibold">View to Cart %</th>
                        <th className="text-right p-3 font-semibold">Cart to Order %</th>
                        <th className="text-right p-3 font-semibold">Overall %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversionFunnel.slice(0, 10).map((product, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-3 font-medium">{product.name}</td>
                          <td className="p-3 text-right">{product.viewCount}</td>
                          <td className="p-3 text-right">{product.cartAddCount}</td>
                          <td className="p-3 text-right">{product.orderCount}</td>
                          <td className="p-3 text-right">{product.viewToCartRate.toFixed(2)}%</td>
                          <td className="p-3 text-right">{product.cartToOrderRate.toFixed(2)}%</td>
                          <td className="p-3 text-right font-semibold">{product.overallConversionRate.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inventory Health */}
              <Card className="border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Inventory Health</CardTitle>
                  <CardDescription>Current stock levels and health status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productInventoryHealth.slice(0, 8).map((product, idx) => {
                      const stockLevel = product.currentStock || 0;

                      return (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{product.productName || 'Unknown Product'}</p>
                              <p className="text-xs text-muted-foreground">{product.totalSold} sold</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">{stockLevel} in stock</p>
                            <InventoryHealthBadge stock={stockLevel} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Low Stock Alert */}
              <Card className="border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Low Stock Alert</CardTitle>
                  <CardDescription>Products that need immediate restocking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lowStockProducts.length > 0 ? (
                      lowStockProducts.map((product, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            <div>
                              <p className="font-semibold text-sm">{product.productName || 'Unknown Product'}</p>
                              <p className="text-xs text-muted-foreground">{product.totalSold} sold</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm text-destructive">{product.currentStock} left</p>
                            <Button size="sm" variant="outline" className="text-xs mt-2">
                              Restock
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">All products have healthy stock levels</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Seasonality Analysis */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-xl">Seasonality Analysis</CardTitle>
                <CardDescription>Monthly sales performance throughout the year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={seasonalityChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {monthNames.slice(0, 6).map((month, idx) => (
                      <Line
                        key={month}
                        type="monotone"
                        dataKey={month}
                        stroke={`var(--chart-${(idx % 5) + 1})`}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name={month}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      icon: <TrendingUp className="h-4 w-4" />,
                      title: 'Revenue Champion',
                      desc: `${topRevenueProducts[0]?.productName || 'N/A'} leads with $${topRevenueProducts[0]?.totalRevenue?.toLocaleString() || '0'} revenue`,
                      metric: `$${topRevenueProducts[0]?.totalRevenue?.toLocaleString() || '0'}`
                    },
                    {
                      icon: <Eye className="h-4 w-4" />,
                      title: 'Engagement Star',
                      desc: `${mostViewedProducts[0]?.productName || 'N/A'} has ${mostViewedProducts[0]?.totalViews || '0'} views with high engagement`,
                      metric: `${mostViewedProducts[0]?.engagementRate?.toFixed(1) || '0'}% rate`
                    },
                    {
                      icon: <Target className="h-4 w-4" />,
                      title: 'Conversion Leader',
                      desc: `${conversionFunnel.sort((a, b) => b.overallConversionRate - a.overallConversionRate)[0]?.name || 'N/A'} converts at ${conversionFunnel.sort((a, b) => b.overallConversionRate - a.overallConversionRate)[0]?.overallConversionRate.toFixed(1) || '0'}%`,
                      metric: `${conversionFunnel.sort((a, b) => b.overallConversionRate - a.overallConversionRate)[0]?.overallConversionRate.toFixed(1) || '0'}%`
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-4 bg-card rounded-lg border">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-600 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm">{item.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {item.metric}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      icon: <TrendingDown className="h-4 w-4" />,
                      title: 'Low Conversion Products',
                      desc: `${conversionFunnel.filter(p => p.overallConversionRate < 1).length} products have conversion rates below 1%`,
                      count: conversionFunnel.filter(p => p.overallConversionRate < 1).length
                    },
                    {
                      icon: <Package className="h-4 w-4" />,
                      title: 'Inventory Alerts',
                      desc: `${lowStockProducts.length} products need immediate restocking attention`,
                      count: lowStockProducts.length
                    },
                    {
                      icon: <Eye className="h-4 w-4" />,
                      title: 'Low Engagement',
                      desc: `${productEngagement.filter(p => p.engagementScore < 1).length} products show poor engagement metrics`,
                      count: productEngagement.filter(p => p.engagementScore < 1).length
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-4 bg-card rounded-lg border">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm">{item.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {item.count} items
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Actionable Recommendations */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Recommended Actions
                </CardTitle>
                <CardDescription>
                  Data-driven strategies to optimize product performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      priority: 'high',
                      title: 'Optimize Low Converters',
                      desc: 'Improve product pages for items with conversion rates below 1%',
                      impact: 'High Impact',
                      effort: 'Medium',
                      actions: ['A/B test product images', 'Add customer reviews', 'Optimize product descriptions']
                    },
                    {
                      priority: 'high',
                      title: 'Restock Critical Items',
                      desc: 'Immediately restock products with inventory levels below 10 units',
                      impact: 'High Impact',
                      effort: 'Low',
                      actions: ['Contact suppliers', 'Update inventory system', 'Set up auto-restock alerts']
                    },
                    {
                      priority: 'medium',
                      title: 'Promote High Engagement',
                      desc: 'Create marketing campaigns for products with high engagement but low sales',
                      impact: 'Medium Impact',
                      effort: 'Low',
                      actions: ['Social media promotion', 'Email campaigns', 'Featured product placement']
                    }
                  ].map((action, idx) => (
                    <div key={idx} className="p-4 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant={action.priority === 'high' ? 'default' : 'secondary'} className="text-xs">
                          {action.priority} Priority
                        </Badge>
                      </div>
                      <h4 className="font-semibold mb-2">{action.title}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{action.desc}</p>
                      <div className="space-y-1 mb-3">
                        {action.actions.map((act, actIdx) => (
                          <div key={actIdx} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1 h-1 rounded-full bg-primary" />
                            {act}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">{action.impact}</Badge>
                        <Badge variant="outline" className="text-xs">{action.effort} Effort</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}