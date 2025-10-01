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
  User,
  UserCheck,
  Timer,
  Zap as ZapIcon,
  Activity as ActivityIcon,
  RefreshCw as RefreshIcon,
  Wifi,
  WifiOff,
  Cpu,
  HardDrive,
  AlertOctagon,
  Funnel as FunnelIcon,
  Filter as FilterIcon,
  Target as TargetIcon,
  ShoppingCart as ShoppingCartIcon,
  CreditCard,
  UserX,
  RefreshCcw,
} from 'lucide-react';

// Types based on the API response
interface OverallFunnel {
  totalSessions: number;
  productViews: number;
  cartAdds: number;
  conversions: number;
}

interface FunnelBySource {
  source: string;
  medium: string;
  sessions: number;
  productViews: number;
  cartAdds: number;
  conversions: number;
  viewRate: number;
  cartRate: number;
  conversionRate: number;
}

interface FunnelByDevice {
  deviceType: string;
  sessions: number;
  productViews: number;
  cartAdds: number;
  conversions: number;
  viewRate: number;
  cartRate: number;
  conversionRate: number;
}

interface AbandonmentAnalysis {
  hour: number;
  dayOfWeek: number;
  totalCartAdds: number;
  totalCartValue: number;
  conversions: number;
  abandonmentRate: number;
}

interface FunnelByCustomerSegment {
  segment: string;
  sessions: number;
  productViews: number;
  cartAdds: number;
  conversions: number;
  viewRate: number;
  cartRate: number;
  conversionRate: number;
}

interface RecoveryAnalysis {
  productId: string;
  productName: string;
  abandonedCarts: number;
  potentialRevenue: number;
  uniqueUsers: number;
}

interface ChartsData {
  funnelChart: {
    stages: {
      name: string;
      value: number;
    }[];
    rates: {
      viewRate: number;
      cartRate: number;
      conversionRate: number;
    };
  };
  sourcePerformance: {
    source: string;
    medium: string;
    conversionRate: number;
    sessions: number;
  }[];
  devicePerformance: {
    device: string;
    conversionRate: number;
    sessions: number;
  }[];
}

interface AnalyticsData {
  overallFunnel: OverallFunnel;
  funnelBySource: FunnelBySource[];
  funnelByDevice: FunnelByDevice[];
  abandonmentAnalysis: AbandonmentAnalysis[];
  funnelByTime: any[];
  funnelByCustomerSegment: FunnelByCustomerSegment[];
  recoveryAnalysis: RecoveryAnalysis[];
  charts: ChartsData;
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hourNames = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];

export default function ConversionFunnelAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('period', period);

      const response = await apiClient.get(`/store-admin/reports/conversionfunnel`) as ApiResponse<any>;

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

  const overallFunnel = data?.overallFunnel || { totalSessions: 0, productViews: 0, cartAdds: 0, conversions: 0 };
  const funnelBySource = data?.funnelBySource || [];
  const funnelByDevice = data?.funnelByDevice || [];
  const abandonmentAnalysis = data?.abandonmentAnalysis || [];
  const funnelByCustomerSegment = data?.funnelByCustomerSegment || [];
  const recoveryAnalysis = data?.recoveryAnalysis || [];
  const chartsData = data?.charts || {
    funnelChart: { stages: [], rates: { viewRate: 0, cartRate: 0, conversionRate: 0 } },
    sourcePerformance: [],
    devicePerformance: []
  };

  // Calculate conversion rates
  const viewRate = overallFunnel.totalSessions > 0 ? (overallFunnel.productViews / overallFunnel.totalSessions) * 100 : 0;
  const cartRate = overallFunnel.productViews > 0 ? (overallFunnel.cartAdds / overallFunnel.productViews) * 100 : 0;
  const conversionRate = overallFunnel.totalSessions > 0 ? (overallFunnel.conversions / overallFunnel.totalSessions) * 100 : 0;

  // Get top sources by conversion rate
  const topSources = [...funnelBySource]
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, 5);

  // Get top devices by conversion rate
  const topDevices = [...funnelByDevice]
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, 5);

  // Process abandonment data by hour
  const abandonmentByHour = Array.from({ length: 24 }, (_, hour) => {
    const hourData = abandonmentAnalysis.filter(item => item.hour === hour);
    const totalAdds = hourData.reduce((sum, item) => sum + item.totalCartAdds, 0);
    const totalConversions = hourData.reduce((sum, item) => sum + item.conversions, 0);
    const abandonmentRate = totalAdds > 0 ? ((totalAdds - totalConversions) / totalAdds) * 100 : 0;

    return {
      hour: hourNames[hour],
      abandonmentRate,
      totalAdds,
      totalConversions
    };
  });

  // Process abandonment data by day of week
  const abandonmentByDay = Array.from({ length: 7 }, (_, day) => {
    const dayData = abandonmentAnalysis.filter(item => item.dayOfWeek === day + 1);
    const totalAdds = dayData.reduce((sum, item) => sum + item.totalCartAdds, 0);
    const totalConversions = dayData.reduce((sum, item) => sum + item.conversions, 0);
    const abandonmentRate = totalAdds > 0 ? ((totalAdds - totalConversions) / totalAdds) * 100 : 0;

    return {
      day: dayNames[day],
      abandonmentRate,
      totalAdds,
      totalConversions
    };
  });

  // Get segment colors
  const getSegmentColor = (segment: string) => {
    const segmentColors: Record<string, string> = {
      'VIP': 'var(--chart-1)',
      'Loyal': 'var(--chart-2)',
      'First-time': 'var(--chart-3)',
      'New': 'var(--chart-4)'
    };
    return segmentColors[segment] || 'var(--chart-5)';
  };

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
                <FunnelIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                Conversion Funnel Analytics
              </h1>
            </div>
            <p className="text-muted-foreground ml-14">
              Comprehensive analysis of customer journey and conversion optimization
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
            title="Total Sessions"
            value={overallFunnel.totalSessions.toLocaleString()}
            subtitle="Initial visits"
            icon={<Users className="h-6 w-6" />}
            trend={8.5}
            color="primary"
          />
          <MetricCard
            title="Product Views"
            value={overallFunnel.productViews.toLocaleString()}
            subtitle={`${viewRate.toFixed(1)}% view rate`}
            icon={<Eye className="h-6 w-6" />}
            trend={12.3}
            color="secondary"
          />
          <MetricCard
            title="Cart Adds"
            value={overallFunnel.cartAdds.toLocaleString()}
            subtitle={`${cartRate.toFixed(1)}% cart rate`}
            icon={<ShoppingCart className="h-6 w-6" />}
            trend={5.7}
            color="accent"
          />
          <MetricCard
            title="Conversions"
            value={overallFunnel.conversions.toLocaleString()}
            subtitle={`${conversionRate.toFixed(1)}% conversion rate`}
            icon={<TargetIcon className="h-6 w-6" />}
            trend={15.2}
            color="muted"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-card shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sources" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Navigation className="h-4 w-4 mr-2" />
              Sources
            </TabsTrigger>
            <TabsTrigger value="devices" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Monitor className="h-4 w-4 mr-2" />
              Devices
            </TabsTrigger>
            <TabsTrigger value="segments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4 mr-2" />
              Segments
            </TabsTrigger>
            <TabsTrigger value="recovery" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Recovery
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversion Funnel */}
              <Card className="shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        Conversion Funnel
                      </CardTitle>
                      <CardDescription>Customer journey from visit to purchase</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <FunnelChart>
                      <Tooltip content={<CustomTooltip />} />
                      <Funnel
                        dataKey="value"
                        data={chartsData.funnelChart.stages}
                        isAnimationActive
                      >
                        <LabelList position="center" fill="#fff" />
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Conversion Rates */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary" />
                    Conversion Rates
                  </CardTitle>
                  <CardDescription>Stage-by-stage conversion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-primary/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">View Rate</span>
                        <span className="text-2xl font-bold">{chartsData.funnelChart.rates.viewRate?.toFixed(1)}%</span>
                      </div>
                      <Progress value={chartsData.funnelChart.rates.viewRate} className="h-2" />
                    </div>

                    <div className="p-4 rounded-xl bg-secondary/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Cart Rate</span>
                        <span className="text-2xl font-bold">{chartsData.funnelChart.rates.cartRate?.toFixed(1)}%</span>
                      </div>
                      <Progress value={chartsData.funnelChart.rates.cartRate} className="h-2" />
                    </div>

                    <div className="p-4 rounded-xl bg-accent">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                        <span className="text-2xl font-bold">{chartsData.funnelChart.rates.conversionRate?.toFixed(1)}%</span>
                      </div>
                      <Progress value={chartsData.funnelChart.rates.conversionRate} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Abandonment Analysis */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserX className="h-5 w-5 text-primary" />
                  Cart Abandonment by Hour
                </CardTitle>
                <CardDescription>Abandonment rates throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={abandonmentByHour}>
                    <defs>
                      <linearGradient id="colorAbandonment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--destructive)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--destructive)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="abandonmentRate"
                      stroke="var(--destructive)"
                      strokeWidth={2}
                      fill="url(#colorAbandonment)"
                      name="Abandonment Rate %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sources Tab */}
          <TabsContent value="sources" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Sources */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-primary" />
                    Top Traffic Sources
                  </CardTitle>
                  <CardDescription>Sources with highest conversion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topSources.map((source, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{source.source}</p>
                            <p className="text-xs text-muted-foreground">{source.medium} • {source.sessions} sessions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{source.conversionRate.toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">{source.conversions} conversions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Source Performance */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChartIcon className="h-5 w-5 text-secondary" />
                    Source Performance
                  </CardTitle>
                  <CardDescription>Conversion rates by traffic source</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={funnelBySource.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="source" stroke="var(--muted-foreground)" fontSize={12} angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="conversionRate" fill="var(--chart-2)" radius={[8, 8, 0, 0]} name="Conversion Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Source Details */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Traffic Source Details</CardTitle>
                <CardDescription>Detailed metrics for each traffic source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Source</th>
                        <th className="text-left p-2">Medium</th>
                        <th className="text-right p-2">Sessions</th>
                        <th className="text-right p-2">Product Views</th>
                        <th className="text-right p-2">Cart Adds</th>
                        <th className="text-right p-2">Conversions</th>
                        <th className="text-right p-2">Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {funnelBySource.slice(0, 10).map((source, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-medium">{source.source}</td>
                          <td className="p-2">{source.medium}</td>
                          <td className="p-2 text-right">{source.sessions}</td>
                          <td className="p-2 text-right">{source.productViews}</td>
                          <td className="p-2 text-right">{source.cartAdds}</td>
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
              {/* Top Devices */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-primary" />
                    Top Devices
                  </CardTitle>
                  <CardDescription>Devices with highest conversion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topDevices.map((device, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                            {idx + 1}
                          </div>
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(device.deviceType)}
                            <div>
                              <p className="font-semibold text-sm">{device.deviceType}</p>
                              <p className="text-xs text-muted-foreground">{device.sessions} sessions</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{device.conversionRate.toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">{device.conversions} conversions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Device Performance */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChartIcon className="h-5 w-5 text-secondary" />
                    Device Performance
                  </CardTitle>
                  <CardDescription>Conversion rates by device type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={funnelByDevice}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="deviceType" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="conversionRate" fill="var(--chart-3)" radius={[8, 8, 0, 0]} name="Conversion Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Device Details */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Device Details</CardTitle>
                <CardDescription>Detailed metrics for each device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Device Type</th>
                        <th className="text-right p-2">Sessions</th>
                        <th className="text-right p-2">Product Views</th>
                        <th className="text-right p-2">Cart Adds</th>
                        <th className="text-right p-2">Conversions</th>
                        <th className="text-right p-2">View Rate</th>
                        <th className="text-right p-2">Cart Rate</th>
                        <th className="text-right p-2">Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {funnelByDevice.map((device, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-medium">
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(device.deviceType)}
                              {device.deviceType}
                            </div>
                          </td>
                          <td className="p-2 text-right">{device.sessions}</td>
                          <td className="p-2 text-right">{device.productViews}</td>
                          <td className="p-2 text-right">{device.cartAdds}</td>
                          <td className="p-2 text-right">{device.conversions}</td>
                          <td className="p-2 text-right">{device.viewRate.toFixed(2)}%</td>
                          <td className="p-2 text-right">{device.cartRate.toFixed(2)}%</td>
                          <td className="p-2 text-right">{device.conversionRate.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segments Tab */}
          <TabsContent value="segments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Segments */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Customer Segments
                  </CardTitle>
                  <CardDescription>Conversion rates by customer segment</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={funnelByCustomerSegment}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="segment" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="conversionRate" fill="var(--chart-4)" radius={[8, 8, 0, 0]} name="Conversion Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Segment Performance */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChartIcon className="h-5 w-5 text-secondary" />
                    Segment Performance
                  </CardTitle>
                  <CardDescription>Funnel metrics by customer segment</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={funnelByCustomerSegment}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="segment" stroke="var(--muted-foreground)" fontSize={12} />
                      <PolarRadiusAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Radar
                        name="Conversion Rate"
                        dataKey="conversionRate"
                        stroke="var(--chart-1)"
                        fill="var(--chart-1)"
                        fillOpacity={0.6}
                      />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Segment Details */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Segment Details</CardTitle>
                <CardDescription>Detailed metrics for each customer segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Segment</th>
                        <th className="text-right p-2">Sessions</th>
                        <th className="text-right p-2">Product Views</th>
                        <th className="text-right p-2">Cart Adds</th>
                        <th className="text-right p-2">Conversions</th>
                        <th className="text-right p-2">View Rate</th>
                        <th className="text-right p-2">Cart Rate</th>
                        <th className="text-right p-2">Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {funnelByCustomerSegment.map((segment, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-medium">
                            <Badge
                              className="text-xs"
                              style={{ backgroundColor: getSegmentColor(segment.segment), color: 'white' }}
                            >
                              {segment.segment}
                            </Badge>
                          </td>
                          <td className="p-2 text-right">{segment.sessions}</td>
                          <td className="p-2 text-right">{segment.productViews}</td>
                          <td className="p-2 text-right">{segment.cartAdds}</td>
                          <td className="p-2 text-right">{segment.conversions}</td>
                          <td className="p-2 text-right">{segment.viewRate.toFixed(2)}%</td>
                          <td className="p-2 text-right">{segment.cartRate.toFixed(2)}%</td>
                          <td className="p-2 text-right">{segment.conversionRate.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recovery Tab */}
          <TabsContent value="recovery" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Abandoned Carts */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    Abandoned Carts
                  </CardTitle>
                  <CardDescription>Products with most abandoned carts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recoveryAnalysis.slice(0, 8).map((product, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{product.productName || 'Unknown Product'}</p>
                            <p className="text-xs text-muted-foreground">{product.uniqueUsers} unique users</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">${product.potentialRevenue.toFixed(0)}</p>
                          <p className="text-xs text-muted-foreground">{product.abandonedCarts} carts</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recovery Opportunities */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCcw className="h-5 w-5 text-secondary" />
                    Recovery Opportunities
                  </CardTitle>
                  <CardDescription>Potential revenue from abandoned carts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-primary/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Total Potential Revenue</span>
                        <span className="text-2xl font-bold">
                          ${recoveryAnalysis.reduce((sum, product) => sum + product.potentialRevenue, 0).toFixed(0)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        From {recoveryAnalysis.reduce((sum, product) => sum + product.abandonedCarts, 0)} abandoned carts
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-secondary/10">
                        <p className="text-xs text-muted-foreground mb-1">Avg Cart Value</p>
                        <p className="text-xl font-bold">
                          ${recoveryAnalysis.length > 0
                            ? (recoveryAnalysis.reduce((sum, product) => sum + product.potentialRevenue, 0) / recoveryAnalysis.reduce((sum, product) => sum + product.abandonedCarts, 0)).toFixed(0)
                            : 0}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-accent">
                        <p className="text-xs text-muted-foreground mb-1">Total Products</p>
                        <p className="text-xl font-bold">{recoveryAnalysis.length}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-accent/50">
                      <p className="text-sm text-muted-foreground mb-2">Recovery Recommendations</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                          <Info className="h-4 w-4 text-blue-500" />
                          <p className="text-xs text-blue-700">
                            Send cart abandonment emails within 1 hour
                          </p>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <p className="text-xs text-green-700">
                            Offer limited-time discounts for high-value carts
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recovery Details */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Recovery Analysis</CardTitle>
                <CardDescription>Detailed metrics for abandoned cart recovery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Product</th>
                        <th className="text-right p-2">Abandoned Carts</th>
                        <th className="text-right p-2">Unique Users</th>
                        <th className="text-right p-2">Potential Revenue</th>
                        <th className="text-right p-2">Recovery Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recoveryAnalysis.map((product, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-medium">{product.productName || 'Unknown Product'}</td>
                          <td className="p-2 text-right">{product.abandonedCarts}</td>
                          <td className="p-2 text-right">{product.uniqueUsers}</td>
                          <td className="p-2 text-right">${product.potentialRevenue.toFixed(2)}</td>
                          <td className="p-2 text-right">
                            <Badge className={
                              product.potentialRevenue > 1000 ? 'bg-red-100 text-red-800' :
                                product.potentialRevenue > 500 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                            }>
                              {product.potentialRevenue > 1000 ? 'High' :
                                product.potentialRevenue > 500 ? 'Medium' : 'Low'}
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