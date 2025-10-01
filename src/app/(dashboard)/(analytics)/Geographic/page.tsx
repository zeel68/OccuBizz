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
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  ZAxis,
  ReferenceLine,
  FunnelChart,
  Funnel,
  LabelList,
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
  Filter,
  RefreshCw,
  BarChart3,
  PieChartIcon,
  Map,
  Monitor,
  Target,
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Crown,
  Heart,
  Clock,
  MapPin,
  Smartphone,
  Globe,
  Sparkles,
  Eye,
  EyeOff,
  Star,
  TrendingUp as TrendingIcon,
  PackageOpen,
  AlertTriangle,
  DollarSign as MoneyIcon,
  ShoppingCart as CartIcon,
  Package as PackageIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  Globe as GlobeIcon,
  MapPin as MapPinIcon,
  Truck,
  Navigation,
  Users,
  Monitor as DeviceIcon,
  Tablet,
  Smartphone as PhoneIcon,
} from 'lucide-react';

// Types based on the API response
interface CountryAnalytics {
  country: string;
  totalOrders: number;
  totalRevenue: number;
  uniqueCustomerCount: number;
  avgOrderValue: number;
  revenuePerCustomer: number;
}

interface CityAnalytics {
  country: string;
  state: string;
  city: string;
  totalOrders: number;
  totalRevenue: number;
  uniqueCustomerCount: number;
  avgOrderValue: number;
  revenuePerCustomer: number;
}

interface TrafficSources {
  country: string;
  source: string;
  medium: string;
  sessions: number;
  uniqueUserCount: number;
  avgSessionDuration: number;
  conversions: number;
  conversionRate: number;
}

interface DeviceByLocation {
  country: string;
  deviceType: string;
  sessions: number;
  uniqueUserCount: number;
  avgSessionDuration: number;
  avgPagesPerSession: number;
  conversionRate: number;
  conversions: any;
}

interface ConversionByLocation {
  country: string;
  totalConversions: number;
  totalRevenue: number;
  avgOrderValue: number;
  uniqueCustomerCount: number;
  revenuePerCustomer: number;
}

interface RegionalPerformance {
  country: string;
  weeklyPerformance: {
    week: number;
    revenue: number;
    orders: number;
    customers: number;
  }[];
  totalRevenue: number;
  totalOrders: number;
}

interface ShippingAnalysis {
  country: string;
  totalOrders: number;
  avgShippingCost: number;
  deliverySuccessRate: number;
}

interface ChartsData {
  worldMap: {
    country: string;
    revenue: number;
    orders: number;
    customers: number;
  }[];
  regionalBreakdown: {
    country: string;
    state: string;
    city: string;
    revenue: number;
    orders: number;
  }[];
  trafficSourcesChart: {
    country: string;
    source: string;
    medium: string;
    sessions: number;
    conversionRate: number;
  }[];
}

interface AnalyticsData {
  countryAnalytics: CountryAnalytics[];
  cityAnalytics: CityAnalytics[];
  trafficSources: TrafficSources[];
  deviceByLocation: DeviceByLocation[];
  conversionByLocation: ConversionByLocation[];
  regionalPerformance: RegionalPerformance[];
  shippingAnalysis: ShippingAnalysis[];
  charts: ChartsData;
}

const weekNames = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'];

export default function GeographicAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('period', period);
      if (startDate) params.append('start', startDate.toISOString());
      if (endDate) params.append('end', endDate.toISOString());

      const response = await apiClient.get(`/store-admin/reports/geographic`) as ApiResponse<any>;

      if (!response.success) {
        throw new Error('Failed to fetch analytics data');
      }

      const result = response.data as any;
      setData(result.data);
    } catch (err) {
      setError('An error occurred while fetching analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const countryAnalytics = data?.countryAnalytics || [];
  const cityAnalytics = data?.cityAnalytics || [];
  const trafficSources = data?.trafficSources || [];
  const deviceByLocation = data?.deviceByLocation || [];
  const conversionByLocation = data?.conversionByLocation || [];
  const regionalPerformance = data?.regionalPerformance || [];
  const shippingAnalysis = data?.shippingAnalysis || [];
  const chartsData = data?.charts || {
    worldMap: [],
    regionalBreakdown: [],
    trafficSourcesChart: []
  };

  // Calculate total metrics
  const totalRevenue = countryAnalytics.reduce((sum, country) => sum + country.totalRevenue, 0);
  const totalOrders = countryAnalytics.reduce((sum, country) => sum + country.totalOrders, 0);
  const totalCustomers = countryAnalytics.reduce((sum, country) => sum + country.uniqueCustomerCount, 0);
  const avgOrderValue = countryAnalytics.length > 0
    ? countryAnalytics.reduce((sum, country) => sum + country.avgOrderValue, 0) / countryAnalytics.length
    : 0;

  // Get top countries by revenue
  const topCountries = [...countryAnalytics]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  // Get top cities by revenue
  const topCities = [...cityAnalytics]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  // Process regional performance data for charts
  const regionalChartData = regionalPerformance.map(region => {
    const weeklyData: any = { name: region.country };

    region.weeklyPerformance.forEach(week => {
      weeklyData[weekNames[week.week - 1]] = week.revenue;
    });

    return weeklyData;
  });

  // Process device data for charts
  const deviceChartData = deviceByLocation.reduce((acc, item) => {
    const existing = acc.find(d => d.deviceType === item.deviceType);
    if (existing) {
      existing.sessions += item.sessions;
      existing.conversions += item.conversions;
      existing.avgSessionDuration = (existing.avgSessionDuration + item.avgSessionDuration) / 2;
    } else {
      acc.push({
        deviceType: item.deviceType,
        sessions: item.sessions,
        conversions: item.conversions,
        avgSessionDuration: item.avgSessionDuration
      });
    }
    return acc;
  }, [] as any[]);

  // Process traffic sources data for charts
  const trafficSourceChartData = trafficSources.reduce((acc, item) => {
    const existing = acc.find(s => s.source === item.source);
    if (existing) {
      existing.sessions += item.sessions;
      existing.conversions += item.conversions;
    } else {
      acc.push({
        source: item.source,
        sessions: item.sessions,
        conversions: item.conversions
      });
    }
    return acc;
  }, [] as any[]);

  const exportData = () => {
    console.log('Exporting data...');
  };

  const MetricCard = ({
    title,
    value,
    subtitle,
    icon,
    trend,
    color = 'primary'
  }: any) => {
    const colorClasses = {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      accent: 'bg-accent text-accent-foreground',
      muted: 'bg-muted text-muted-foreground',
    };

    return (
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="h-1 bg-primary" />
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
              {icon}
            </div>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${trend >= 0 ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span className="text-xs font-semibold">{Math.abs(trend).toFixed(1)}%</span>
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      case 'mobile':
      case 'smartphone':
        return <PhoneIcon className="h-4 w-4" />;
      default:
        return <DeviceIcon className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40" />)}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Failed to Load Data</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={fetchData} className="bg-primary">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary rounded-xl">
                <Globe className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                Geographic Analytics
              </h1>
            </div>
            <p className="text-muted-foreground ml-14">
              Comprehensive insights into geographic distribution and regional performance
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={exportData} className="shadow-sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[160px] shadow-sm">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchData} className="shadow-sm bg-primary">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`$${(totalRevenue / 1000).toFixed(1)}K`}
            subtitle={`From ${totalOrders} orders`}
            icon={<DollarSign className="h-6 w-6" />}
            trend={8.5}
            color="primary"
          />
          <MetricCard
            title="Total Orders"
            value={totalOrders.toLocaleString()}
            subtitle={`From ${countryAnalytics.length} countries`}
            icon={<ShoppingCart className="h-6 w-6" />}
            trend={12.3}
            color="secondary"
          />
          <MetricCard
            title="Total Customers"
            value={totalCustomers.toLocaleString()}
            subtitle={`Across all regions`}
            icon={<Users className="h-6 w-6" />}
            trend={5.7}
            color="accent"
          />
          <MetricCard
            title="Avg Order Value"
            value={`$${avgOrderValue.toFixed(0)}`}
            subtitle={`Per order average`}
            icon={<TrendingUp className="h-6 w-6" />}
            trend={15.2}
            color="muted"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-card shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Globe className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="regions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              Regions
            </TabsTrigger>
            <TabsTrigger value="traffic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Navigation className="h-4 w-4 mr-2" />
              Traffic
            </TabsTrigger>
            <TabsTrigger value="devices" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Monitor className="h-4 w-4 mr-2" />
              Devices
            </TabsTrigger>
            <TabsTrigger value="shipping" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Truck className="h-4 w-4 mr-2" />
              Shipping
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* World Map Placeholder */}
              <Card className="shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        Revenue by Country
                      </CardTitle>
                      <CardDescription>Geographic distribution of revenue</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={countryAnalytics.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="country" stroke="var(--muted-foreground)" fontSize={12} angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="totalRevenue" fill="var(--chart-1)" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Countries */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary" />
                    Top Countries by Revenue
                  </CardTitle>
                  <CardDescription>Countries generating the most revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topCountries.map((country, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{country.country}</p>
                            <p className="text-xs text-muted-foreground">{country.totalOrders} orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">${country.totalRevenue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{country.uniqueCustomerCount} customers</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Regional Performance */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Regional Performance
                </CardTitle>
                <CardDescription>Weekly revenue trends by region</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={regionalChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {weekNames.slice(0, 8).map((week, idx) => (
                      <Line
                        key={week}
                        type="monotone"
                        dataKey={week}
                        stroke={`var(--chart-${(idx % 5) + 1})`}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name={week}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regions Tab */}
          <TabsContent value="regions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Cities */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Top Cities by Revenue
                  </CardTitle>
                  <CardDescription>Cities generating the most revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topCities.map((city, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{city.city}, {city.state}</p>
                            <p className="text-xs text-muted-foreground">{city.country}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">${city.totalRevenue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{city.totalOrders} orders</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Conversion by Location */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                    Conversion by Location
                  </CardTitle>
                  <CardDescription>Conversion rates by country</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={conversionByLocation.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="country" stroke="var(--muted-foreground)" fontSize={12} angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="totalConversions" fill="var(--chart-2)" name="Conversions" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Regional Breakdown */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Regional Breakdown</CardTitle>
                <CardDescription>Detailed performance metrics by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Country</th>
                        <th className="text-left p-2">State</th>
                        <th className="text-left p-2">City</th>
                        <th className="text-right p-2">Orders</th>
                        <th className="text-right p-2">Revenue</th>
                        <th className="text-right p-2">Customers</th>
                        <th className="text-right p-2">Avg Order Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cityAnalytics.slice(0, 10).map((city, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-medium">{city.country}</td>
                          <td className="p-2">{city.state}</td>
                          <td className="p-2">{city.city}</td>
                          <td className="p-2 text-right">{city.totalOrders}</td>
                          <td className="p-2 text-right">${city.totalRevenue.toLocaleString()}</td>
                          <td className="p-2 text-right">{city.uniqueCustomerCount}</td>
                          <td className="p-2 text-right">${city.avgOrderValue.toFixed(0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traffic Tab */}
          <TabsContent value="traffic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-primary" />
                    Traffic Sources
                  </CardTitle>
                  <CardDescription>Traffic sources by country</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={trafficSourceChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ source, percent }) => `${source}: ${((percent as number) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="sessions"
                      >
                        {trafficSourceChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 5) + 1})`} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Traffic Sources by Country */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-secondary" />
                    Traffic by Country
                  </CardTitle>
                  <CardDescription>Traffic distribution by country</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trafficSources.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="country" stroke="var(--muted-foreground)" fontSize={12} angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="sessions" fill="var(--chart-3)" name="Sessions" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Traffic Sources Details */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Traffic Sources Details</CardTitle>
                <CardDescription>Detailed traffic metrics by source and location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Country</th>
                        <th className="text-left p-2">Source</th>
                        <th className="text-left p-2">Medium</th>
                        <th className="text-right p-2">Sessions</th>
                        <th className="text-right p-2">Users</th>
                        <th className="text-right p-2">Avg Duration</th>
                        <th className="text-right p-2">Conversions</th>
                        <th className="text-right p-2">Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trafficSources.slice(0, 10).map((source, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-medium">{source.country}</td>
                          <td className="p-2">{source.source}</td>
                          <td className="p-2">{source.medium}</td>
                          <td className="p-2 text-right">{source.sessions}</td>
                          <td className="p-2 text-right">{source.uniqueUserCount}</td>
                          <td className="p-2 text-right">{source.avgSessionDuration.toFixed(1)}s</td>
                          <td className="p-2 text-right">{source.conversions}</td>
                          <td className="p-2 text-right">{source.conversionRate.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Usage by Location */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-primary" />
                    Device Usage
                  </CardTitle>
                  <CardDescription>Device types by usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={deviceChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ deviceType, percent }) => `${deviceType}: ${((percent as any) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="sessions"
                      >
                        {deviceChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 5) + 1})`} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Device Performance */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                    Device Performance
                  </CardTitle>
                  <CardDescription>Conversion rates by device type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={deviceChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="deviceType" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="conversionRate" fill="var(--chart-4)" name="Conversion Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Device Details */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Device Details by Location</CardTitle>
                <CardDescription>Detailed device metrics by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Country</th>
                        <th className="text-left p-2">Device Type</th>
                        <th className="text-right p-2">Sessions</th>
                        <th className="text-right p-2">Users</th>
                        <th className="text-right p-2">Avg Duration</th>
                        <th className="text-right p-2">Pages/Session</th>
                        <th className="text-right p-2">Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deviceByLocation.slice(0, 10).map((device, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-medium">{device.country}</td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(device.deviceType)}
                              {device.deviceType}
                            </div>
                          </td>
                          <td className="p-2 text-right">{device.sessions}</td>
                          <td className="p-2 text-right">{device.uniqueUserCount}</td>
                          <td className="p-2 text-right">{device.avgSessionDuration.toFixed(1)}s</td>
                          <td className="p-2 text-right">{device.avgPagesPerSession.toFixed(1)}</td>
                          <td className="p-2 text-right">{device.conversionRate.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shipping Analysis */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Shipping Analysis
                  </CardTitle>
                  <CardDescription>Shipping metrics by country</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={shippingAnalysis.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="country" stroke="var(--muted-foreground)" fontSize={12} angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="totalOrders" fill="var(--chart-1)" name="Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Delivery Success Rate */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary" />
                    Delivery Success Rate
                  </CardTitle>
                  <CardDescription>Success rates by country</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={shippingAnalysis.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="country" stroke="var(--muted-foreground)" fontSize={12} angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="deliverySuccessRate" fill="var(--chart-2)" name="Success Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Shipping Details */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Shipping Details</CardTitle>
                <CardDescription>Detailed shipping metrics by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Country</th>
                        <th className="text-right p-2">Total Orders</th>
                        <th className="text-right p-2">Avg Shipping Cost</th>
                        <th className="text-right p-2">Delivery Success Rate</th>
                        <th className="text-right p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shippingAnalysis.slice(0, 10).map((shipping, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-medium">{shipping.country}</td>
                          <td className="p-2 text-right">{shipping.totalOrders}</td>
                          <td className="p-2 text-right">${shipping.avgShippingCost?.toFixed(2)}</td>
                          <td className="p-2 text-right">{shipping.deliverySuccessRate.toFixed(2)}%</td>
                          <td className="p-2 text-right">
                            <Badge className={
                              shipping.deliverySuccessRate >= 95 ? 'bg-green-100 text-green-800' :
                                shipping.deliverySuccessRate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                            }>
                              {shipping.deliverySuccessRate >= 95 ? 'Excellent' :
                                shipping.deliverySuccessRate >= 80 ? 'Good' : 'Needs Improvement'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}