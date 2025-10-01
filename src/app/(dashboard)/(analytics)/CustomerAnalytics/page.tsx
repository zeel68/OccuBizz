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
} from 'recharts';
import apiClient from '@/lib/apiCalling';
import { ApiResponse } from '@/models/api.model';
import {
    Download,
    TrendingUp,
    TrendingDown,
    Users,
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
} from 'lucide-react';

// Types remain the same
interface CustomerSegmentation {
    segment: string;
    activity: string;
    count: number;
    totalRevenue: number;
    avgOrderValue: number;
    avgOrderCount: number;
    avgDaysSinceLastOrder: number;
}

interface CustomerLifetimeValue {
    avgLifetimeValue: number;
    medianLifetimeValue: number;
    avgOrderFrequency: number;
    avgCustomerLifespan: number;
    totalCustomers: number;
    totalRevenue: number;
    maxLifetimeValue: number;
    topDecileValue: number;
    revenuePerCustomer: number;
}

interface CustomerRetention {
    month: string;
    totalCustomers: number;
    totalRevenue: number;
    repeatCustomers: number;
    retentionRate: number;
    avgRevenuePerCustomer: number;
}

interface CustomerGeography {
    country: string;
    state: string;
    city: string;
    totalOrders: number;
    totalRevenue: number;
    uniqueCustomerCount: number;
    avgOrderValue: number;
    revenuePerCustomer: number;
}

interface CustomerDevice {
    deviceType: string;
    browser: string;
    os: string;
    sessions: number;
    uniqueUserCount: number;
    avgSessionDuration: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
    bounceRate: number;
    revenuePerSession: number;
}

interface CustomerJourney {
    source: string;
    medium: string;
    campaign: string;
    sessions: number;
    uniqueUserCount: number;
    avgSessionDuration: number;
    avgPagesPerSession: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
    revenuePerSession: number;
}

interface TopCustomer {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    totalSpent: number;
    orderCount: number;
    lastOrderDate: string;
    firstOrderDate: string;
    avgOrderValue: number;
    daysSinceLastOrder: number | null;
    customerSince: string;
    lifetimeValue: number;
    segment: string;
}

interface CustomerActivity {
    _id: {
        hour: number;
        dayOfWeek: number;
    };
    sessions: number;
    uniqueUserCount: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
    avgSessionDuration: number;
    revenuePerSession: number;
}

interface CustomerAcquisitionCost {
    source: string;
    campaign: string;
    sessions: number;
    newUsers: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
    costPerAcquisition: number;
    returnOnAdSpend: number;
}

interface ChurnAnalysis {
    _id: string;
    customerCount: number;
    avgOrderCount: number;
    avgLifetimeValue: number;
    totalRevenueAtRisk: number;
}

interface LoyaltyMetrics {
    totalCustomers: number;
    activeCustomers: number;
    avgOrdersPerCustomer: number;
    avgSessionPerCustomer: number;
    avgSessionDuration: number | null;
    repeatPurchaseRate: number;
}

interface AnalyticsData {
    customerSegmentation: CustomerSegmentation[];
    customerLifetimeValue: CustomerLifetimeValue;
    customerRetention: CustomerRetention[];
    customerGeography: CustomerGeography[];
    customerDevices: CustomerDevice[];
    customerJourney: CustomerJourney[];
    topCustomers: TopCustomer[];
    customerActivity: CustomerActivity[];
    customerAcquisitionCost: CustomerAcquisitionCost[];
    churnAnalysis: ChurnAnalysis[];
    loyaltyMetrics: LoyaltyMetrics;
    charts: {
        customerSegmentationChart: any[];
        retentionTrend: any[];
        geographyHeatmap: any[];
        deviceBreakdown: any[];
    };
}

// Use chart colors from global CSS
const getChartColors = () => [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)'
];

// Map segments to chart colors
const getSegmentColor = (segment: string) => {
    const segmentColors: Record<string, string> = {
        'VIP': 'var(--chart-1)',
        'Loyal': 'var(--chart-2)',
        'Regular': 'var(--chart-3)',
        'One-time': 'var(--chart-4)',
        'New': 'var(--chart-5)'
    };
    return segmentColors[segment] || 'var(--chart-1)';
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CustomerBehaviorAnalytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [period, setPeriod] = useState('30');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            params.append('period', period);
            if (startDate) params.append('start', startDate.toISOString());
            if (endDate) params.append('end', endDate.toISOString());

            const response = await apiClient.get(`/store-admin/reports/customerbehavior`) as ApiResponse<any>;

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

    const segmentationData = data?.customerSegmentation || [];
    const retentionData = data?.customerRetention || [];
    const geographyData = data?.customerGeography || [];
    const deviceData = data?.customerDevices || [];
    const journeyData = data?.customerJourney || [];
    const topCustomersData = data?.topCustomers || [];
    const activityData = data?.customerActivity || [];
    const churnData = data?.churnAnalysis || [];
    const acquisitionData = data?.customerAcquisitionCost || [];

    // Process activity data for heatmap
    const activityHeatmapData = Array.from({ length: 7 }, (_, dayIndex) => {
        const hourData: any = { day: dayNames[dayIndex], dayIndex };
        Array.from({ length: 24 }, (_, hourIndex) => {
            const activity = activityData.find(
                a => a._id.dayOfWeek === dayIndex + 1 && a._id.hour === hourIndex
            );
            hourData[`h${hourIndex}`] = activity?.sessions || 0;
        });
        return hourData;
    });

    // Aggregate segmentation by segment only
    const segmentTotals = segmentationData.reduce((acc, item) => {
        const existing = acc.find(a => a.segment === item.segment);
        if (existing) {
            existing.count += item.count;
            existing.totalRevenue += item.totalRevenue;
        } else {
            acc.push({
                segment: item.segment,
                count: item.count,
                totalRevenue: item.totalRevenue,
                avgOrderValue: item.avgOrderValue
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
        trendLabel,
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
                                <BarChart3 className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <h1 className="text-4xl font-bold text-foreground">
                                Customer Analytics
                            </h1>
                        </div>
                        <p className="text-muted-foreground ml-14">
                            Comprehensive insights into customer behavior and engagement
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
                        title="Total Customers"
                        value={data?.customerLifetimeValue.totalCustomers.toLocaleString() || "0"}
                        subtitle={`${data?.loyaltyMetrics.activeCustomers || 0} active this month`}
                        icon={<Users className="h-6 w-6" />}
                        trend={8.5}
                        color="primary"
                    />
                    <MetricCard
                        title="Avg Lifetime Value"
                        value={`$${data?.customerLifetimeValue.avgLifetimeValue.toFixed(0) || "0"}`}
                        subtitle={`$${data?.customerLifetimeValue.medianLifetimeValue.toFixed(0) || "0"} median`}
                        icon={<DollarSign className="h-6 w-6" />}
                        trend={12.3}
                        color="secondary"
                    />
                    <MetricCard
                        title="Retention Rate"
                        value={`${data?.loyaltyMetrics.repeatPurchaseRate.toFixed(1) || "0"}%`}
                        subtitle="Repeat purchase rate"
                        icon={<Heart className="h-6 w-6" />}
                        trend={5.7}
                        color="accent"
                    />
                    <MetricCard
                        title="Total Revenue"
                        value={`$${(data?.customerLifetimeValue.totalRevenue ?? 1 / 1000).toFixed(1) || "0"}K`}
                        subtitle="All time revenue"
                        icon={<TrendingUp className="h-6 w-6" />}
                        trend={15.2}
                        color="muted"
                    />
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 h-12 bg-card shadow-sm">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <Activity className="h-4 w-4 mr-2" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="segments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <Users className="h-4 w-4 mr-2" />
                            Segments
                        </TabsTrigger>
                        <TabsTrigger value="retention" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <Heart className="h-4 w-4 mr-2" />
                            Retention
                        </TabsTrigger>
                        <TabsTrigger value="journey" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            Journey
                        </TabsTrigger>
                        <TabsTrigger value="insights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Insights
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Retention Trend */}
                            <Card className="shadow-md">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                                Retention Trend
                                            </CardTitle>
                                            <CardDescription>Monthly customer retention and growth</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={retentionData}>
                                            <defs>
                                                <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                                            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="retentionRate"
                                                stroke="var(--primary)"
                                                strokeWidth={3}
                                                fill="url(#colorRetention)"
                                                name="Retention Rate %"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Customer Segmentation */}
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-secondary" />
                                        Customer Segments
                                    </CardTitle>
                                    <CardDescription>Distribution by customer value</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={segmentTotals}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="count"
                                            >
                                                {segmentTotals.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={getSegmentColor(entry.segment)}
                                                        opacity={selectedSegment === null || selectedSegment === entry.segment ? 1 : 0.3}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        {segmentTotals.map((seg, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer transition"
                                                onClick={() => setSelectedSegment(seg.segment === selectedSegment ? null : seg.segment)}
                                            >
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: getSegmentColor(seg.segment) }}
                                                />
                                                <div>
                                                    <p className="text-xs font-medium">{seg.segment}</p>
                                                    <p className="text-xs text-muted-foreground">{seg.count} customers</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Geography and Devices */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Locations */}
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-primary" />
                                        Top Locations
                                    </CardTitle>
                                    <CardDescription>Revenue by geographic location</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {geographyData.slice(0, 6).map((geo, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{geo.city}, {geo.state}</p>
                                                        <p className="text-xs text-muted-foreground">{geo.uniqueCustomerCount} customers</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-sm">${geo.totalRevenue.toLocaleString()}</p>
                                                    <p className="text-xs text-muted-foreground">{geo.totalOrders} orders</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Device Analytics */}
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Monitor className="h-5 w-5 text-secondary" />
                                        Device Performance
                                    </CardTitle>
                                    <CardDescription>Conversion rates by device type</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={deviceData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                                            <YAxis dataKey="deviceType" type="category" stroke="var(--muted-foreground)" fontSize={12} width={80} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="conversionRate" fill="var(--secondary)" radius={[0, 8, 8, 0]} name="Conversion Rate %" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Activity Heatmap */}
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-accent-foreground" />
                                    Customer Activity Heatmap
                                </CardTitle>
                                <CardDescription>Session distribution by day and hour</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <div className="inline-block min-w-full">
                                        <div className="grid grid-cols-25 gap-1 text-xs">
                                            <div className="col-span-1" />
                                            {Array.from({ length: 24 }).map((_, h) => (
                                                <div key={h} className="text-center text-muted-foreground font-medium">
                                                    {h}
                                                </div>
                                            ))}
                                            {activityHeatmapData.map((day, dayIdx) => (
                                                <React.Fragment key={dayIdx}>
                                                    <div className="font-medium text-muted-foreground flex items-center">
                                                        {day.day}
                                                    </div>
                                                    {Array.from({ length: 24 }).map((_, h) => {
                                                        const value = day[`h${h}`] || 0;
                                                        const maxValue = Math.max(...activityHeatmapData.flatMap(d =>
                                                            Array.from({ length: 24 }, (_, i) => d[`h${i}`] || 0)
                                                        ));
                                                        const intensity = maxValue > 0 ? (value / maxValue) : 0;

                                                        return (
                                                            <div
                                                                key={h}
                                                                className="aspect-square rounded flex items-center justify-center text-xs font-medium transition-all hover:scale-110 cursor-pointer"
                                                                style={{
                                                                    backgroundColor: value > 0
                                                                        ? `var(--primary)`
                                                                        : 'var(--muted)',
                                                                    opacity: value > 0 ? 0.1 + intensity * 0.9 : 1,
                                                                    color: intensity > 0.5 ? 'var(--primary-foreground)' : 'var(--muted-foreground)'
                                                                }}
                                                                title={`${day.day} ${h}:00 - ${value} sessions`}
                                                            >
                                                                {value > 0 ? value : ''}
                                                            </div>
                                                        );
                                                    })}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Segments Tab */}
                    <TabsContent value="segments" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {segmentTotals.map((seg, idx) => (
                                <Card key={idx} className="shadow-md hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                {seg.segment === 'VIP' && <Crown className="h-5 w-5 text-primary" />}
                                                {seg.segment === 'Loyal' && <Heart className="h-5 w-5 text-secondary" />}
                                                {seg.segment === 'Regular' && <Users className="h-5 w-5 text-accent-foreground" />}
                                                {seg.segment}
                                            </CardTitle>
                                            <Badge
                                                className="text-xs"
                                                style={{
                                                    backgroundColor: getSegmentColor(seg.segment),
                                                    color: 'white'
                                                }}
                                            >
                                                {seg.count}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-muted-foreground">Revenue</span>
                                                    <span className="font-bold">${seg.totalRevenue.toLocaleString()}</span>
                                                </div>
                                                <Progress
                                                    value={(seg.totalRevenue / Math.max(...segmentTotals.map(s => s.totalRevenue))) * 100}
                                                    className="h-2"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Avg Order</p>
                                                    <p className="text-lg font-bold">${seg.avgOrderValue.toFixed(0)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Per Customer</p>
                                                    <p className="text-lg font-bold">${(seg.totalRevenue / seg.count).toFixed(0)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle>Revenue by Segment</CardTitle>
                                <CardDescription>Compare revenue performance across customer segments</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={segmentTotals}>
                                        <defs>
                                            {segmentTotals.map((seg, idx) => (
                                                <linearGradient key={idx} id={`gradient${idx}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={getSegmentColor(seg.segment)} stopOpacity={1} />
                                                    <stop offset="100%" stopColor={getSegmentColor(seg.segment)} stopOpacity={0.6} />
                                                </linearGradient>
                                            ))}
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                        <XAxis dataKey="segment" stroke="var(--muted-foreground)" fontSize={12} />
                                        <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="totalRevenue" radius={[8, 8, 0, 0]} name="Revenue">
                                            {segmentTotals.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={`url(#gradient${index})`} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Retention Tab */}
                    <TabsContent value="retention" className="space-y-6">
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle>Retention Analysis</CardTitle>
                                <CardDescription>Track customer retention and repeat purchase behavior</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <ComposedChart data={retentionData}>
                                        <defs>
                                            <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                        <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                                        <YAxis yAxisId="left" stroke="var(--muted-foreground)" fontSize={12} />
                                        <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" fontSize={12} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Area
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="totalCustomers"
                                            stroke="var(--primary)"
                                            strokeWidth={2}
                                            fill="url(#colorCustomers)"
                                            name="Total Customers"
                                        />
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="retentionRate"
                                            stroke="var(--secondary)"
                                            strokeWidth={3}
                                            dot={{ fill: 'var(--secondary)', r: 4 }}
                                            name="Retention Rate %"
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-destructive" />
                                        Churn Risk Analysis
                                    </CardTitle>
                                    <CardDescription>Customer distribution by churn risk level</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {churnData.map((churn, idx) => {
                                            const riskColors: Record<string, string> = {
                                                'Low Risk': 'var(--chart-3)',
                                                'Medium Risk': 'var(--chart-4)',
                                                'High Risk': 'var(--chart-5)',
                                                'Churned': 'var(--destructive)'
                                            };

                                            return (
                                                <div key={idx} className="p-4 rounded-xl bg-accent/50 border border-border">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="font-semibold">{churn._id}</h4>
                                                        <Badge className="text-xs" style={{ backgroundColor: riskColors[churn._id] || 'var(--muted)', color: 'white' }}>
                                                            {churn.customerCount} customers
                                                        </Badge>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                                        <div>
                                                            <p className="text-muted-foreground">Avg Orders</p>
                                                            <p className="font-bold">{churn.avgOrderCount.toFixed(1)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Revenue at Risk</p>
                                                            <p className="font-bold">${churn.totalRevenueAtRisk.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-primary" />
                                        Loyalty Metrics
                                    </CardTitle>
                                    <CardDescription>Customer engagement and loyalty indicators</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-primary/10">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-muted-foreground">Active Customers</span>
                                                <span className="text-2xl font-bold">
                                                    {((((data?.loyaltyMetrics?.activeCustomers ?? 0) / (data?.loyaltyMetrics?.totalCustomers ?? 1)) * 100).toFixed(1))}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={((data?.loyaltyMetrics?.activeCustomers ?? 0) / (data?.loyaltyMetrics?.totalCustomers ?? 1)) * 100}
                                                className="h-2"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 rounded-lg bg-secondary/10">
                                                <p className="text-xs text-muted-foreground mb-1">Avg Orders</p>
                                                <p className="text-xl font-bold">{data?.loyaltyMetrics.avgOrdersPerCustomer.toFixed(1)}</p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-accent">
                                                <p className="text-xs text-muted-foreground mb-1">Avg Sessions</p>
                                                <p className="text-xl font-bold">{data?.loyaltyMetrics.avgSessionPerCustomer.toFixed(1)}</p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-accent/50">
                                            <p className="text-sm text-muted-foreground mb-2">Repeat Purchase Rate</p>
                                            <div className="flex items-end gap-2">
                                                <span className="text-3xl font-bold">{data?.loyaltyMetrics.repeatPurchaseRate.toFixed(1)}%</span>
                                                <span className="text-green-600 flex items-center text-sm mb-1">
                                                    <TrendingUp className="h-4 w-4 mr-1" />
                                                    +5.2%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Journey Tab */}
                    <TabsContent value="journey" className="space-y-6">
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle>Customer Journey Performance</CardTitle>
                                <CardDescription>Marketing channel effectiveness and ROI</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <ScatterChart>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                        <XAxis
                                            type="number"
                                            dataKey="sessions"
                                            name="Sessions"
                                            stroke="var(--muted-foreground)"
                                            fontSize={12}
                                        />
                                        <YAxis
                                            type="number"
                                            dataKey="conversionRate"
                                            name="Conversion Rate"
                                            unit="%"
                                            stroke="var(--muted-foreground)"
                                            fontSize={12}
                                        />
                                        <ZAxis
                                            type="number"
                                            dataKey="revenue"
                                            range={[100, 1000]}
                                            name="Revenue"
                                        />
                                        <Tooltip
                                            cursor={{ strokeDasharray: '3 3' }}
                                            content={({ active, payload }) => {
                                                if (!active || !payload || !payload.length) return null;
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                                                        <p className="font-semibold mb-2">{data.source}</p>
                                                        <div className="space-y-1 text-xs">
                                                            <p>Sessions: <span className="font-semibold">{data.sessions}</span></p>
                                                            <p>Conversion: <span className="font-semibold">{data.conversionRate}%</span></p>
                                                            <p>Revenue: <span className="font-semibold">${data.revenue}</span></p>
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        />
                                        <Scatter name="Channels" data={journeyData} fill="var(--primary)" />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle>Acquisition Cost</CardTitle>
                                    <CardDescription>Cost efficiency by marketing channel</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={acquisitionData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis dataKey="source" stroke="var(--muted-foreground)" fontSize={12} />
                                            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="costPerAcquisition" fill="var(--accent)" radius={[8, 8, 0, 0]} name="Cost per Acquisition" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Crown className="h-5 w-5 text-primary" />
                                        Top Customers
                                    </CardTitle>
                                    <CardDescription>Highest value customers</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {topCustomersData.slice(0, 5).map((customer, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                                                        {customer.customerName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{customer.customerName}</p>
                                                        <p className="text-xs text-muted-foreground">{customer.orderCount} orders</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">${customer.totalSpent.toLocaleString()}</p>
                                                    <Badge className="text-xs mt-1" style={{ backgroundColor: getSegmentColor(customer.segment) }}>
                                                        {customer.segment}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Insights Tab */}
                    <TabsContent value="insights" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="shadow-md bg-green-50 dark:bg-green-950/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        Key Strengths
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        {
                                            icon: <TrendingUp className="h-4 w-4" />,
                                            title: 'Strong Retention',
                                            desc: `${data?.loyaltyMetrics.repeatPurchaseRate.toFixed(1)}% repeat purchase rate exceeds industry benchmarks`
                                        },
                                        {
                                            icon: <DollarSign className="h-4 w-4" />,
                                            title: 'High Customer Value',
                                            desc: `${data?.customerLifetimeValue.avgLifetimeValue.toFixed(0)} average lifetime value shows strong loyalty`
                                        },
                                        {
                                            icon: <Users className="h-4 w-4" />,
                                            title: 'Growing Base',
                                            desc: 'Customer base growing 15% quarter-over-quarter'
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-3 p-3 bg-card rounded-lg">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex-shrink-0">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="shadow-md bg-amber-50 dark:bg-amber-950/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                        Opportunities
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        {
                                            icon: <Smartphone className="h-4 w-4" />,
                                            title: 'Mobile Optimization',
                                            desc: '25% conversion gap between mobile and desktop users'
                                        },
                                        {
                                            icon: <Target className="h-4 w-4" />,
                                            title: 'Channel Efficiency',
                                            desc: 'Social channels show lower ROI, consider reallocation'
                                        },
                                        {
                                            icon: <Clock className="h-4 w-4" />,
                                            title: 'Weekend Engagement',
                                            desc: 'Significant activity drop on weekends presents opportunity'
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-3 p-3 bg-card rounded-lg">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex-shrink-0">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    Recommended Actions
                                </CardTitle>
                                <CardDescription>Data-driven strategies to improve customer engagement</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        {
                                            priority: 'High',
                                            title: 'Optimize Mobile Checkout',
                                            desc: 'Implement one-page checkout for mobile to improve 25% conversion gap',
                                            impact: 'High Impact',
                                            effort: 'Medium'
                                        },
                                        {
                                            priority: 'Medium',
                                            title: 'Re-engagement Campaign',
                                            desc: 'Target at-risk customers with personalized offers based on purchase history',
                                            impact: 'Medium Impact',
                                            effort: 'Low'
                                        },
                                        {
                                            priority: 'Medium',
                                            title: 'Channel Optimization',
                                            desc: 'Reallocate budget from low-performing social to high-ROI email marketing',
                                            impact: 'High Impact',
                                            effort: 'Low'
                                        }
                                    ].map((action, idx) => (
                                        <div key={idx} className="p-4 rounded-xl border-2 border-dashed border-border hover:border-solid hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge variant={action.priority === 'High' ? 'default' : 'secondary'} className="text-xs">
                                                    {action.priority} Priority
                                                </Badge>
                                            </div>
                                            <h4 className="font-semibold mb-2">{action.title}</h4>
                                            <p className="text-xs text-muted-foreground mb-3">{action.desc}</p>
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