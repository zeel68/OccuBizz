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
  ComposedChart,
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
  Users,
  Eye,
  Cpu,
  AlertCircle,
  CheckCircle,
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  AlertTriangle,
  Wifi,
  WifiOff,
  HardDrive,
  AlertOctagon,
} from 'lucide-react';

// Types based on the API response
interface ActiveUsers {
  totalActive: number;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  avgPagesPerSession: number;
}

interface RecentActivity {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
  };
  location: {
    country: string;
    city: string;
  };
  device_info: {
    type: string;
    os: string;
    browser: string;
  };
  referrer: string;
  created_at: string;
  session_duration: number;
  pages_visited: string[];
}

interface LiveConversion {
  _id: string;
  order_number: string;
  total: number;
  user_id: {
    _id: string;
    name: string;
    email: string;
  };
  created_at: string;
  items: {
    product_id: {
      _id: string;
      name: string;
      images: string[];
    };
    quantity: number;
    price: number;
  }[];
  status: string;
}

interface TopPage {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  views: number;
  uniqueViewerCount: number;
  avgDuration: number;
  viewsPerMinute: number;
}

interface RealtimeMetrics {
  hourlyMetrics: {
    _id: {
      hour: number;
      date: string;
    };
    sessions: number;
    conversions: number;
    totalDuration: number;
  }[];
  currentHour: {
    _id: null;
    sessions: number;
    conversions: number;
    avgSessionDuration: number;
  }[];
}

interface LiveSession {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
  };
  location: {
    country: string;
    city: string;
  };
  device_info: {
    type: string;
    os: string;
    browser: string;
  };
  referrer: string;
  created_at: string;
  session_duration: number;
  pages_visited: string[];
}

interface SystemHealth {
  outOfStockProducts: number;
  pendingOrders: number;
  activeUsers: number;
  recentProductViews: number;
  healthScore: number;
}

interface PerformanceAlert {
  _id: string;
  count: number;
  totalValue: number;
}

interface ChartsData {
  activeUsersChart: {
    total: number;
    byDevice: {
      desktop: number;
      mobile: number;
      tablet: number;
    };
    trend: {
      _id: {
        hour: number;
        date: string;
      };
      sessions: number;
      conversions: number;
      totalDuration: number;
    }[];
  };
  conversionMetrics: {
    currentHour: {
      _id: null;
      sessions: number;
      conversions: number;
      avgSessionDuration: number;
    };
    hourlyTrend: {
      _id: {
        hour: number;
        date: string;
      };
      sessions: number;
      conversions: number;
      totalDuration: number;
    }[];
  };
  topProducts: {
    name: string;
    views: number;
    engagement: number;
  }[];
}

interface AnalyticsData {
  activeUsers: ActiveUsers;
  recentActivity: RecentActivity[];
  liveConversions: LiveConversion[];
  topPages: TopPage[];
  realtimeMetrics: RealtimeMetrics;
  liveSessions: LiveSession[];
  systemHealth: SystemHealth;
  performanceAlerts: PerformanceAlert[];
  charts: ChartsData;
}

const hourNames = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];

export default function RealTimeAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await apiClient.get(`/store-admin/reports/realtime`) as ApiResponse<any>;

      if (!response.success) {
        throw new Error('Failed to fetch analytics data');
      }

      const result = response.data as any;
      setData(result.data);
      setLastRefresh(new Date());
    } catch (err) {
      setError('An error occurred while fetching analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000);
      setRefreshInterval(interval);

      return () => {
        clearInterval(interval);
      };
    }
  }, [autoRefresh]);

  const toggleAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
    setAutoRefresh(!autoRefresh);
  };

  const activeUsers = data?.activeUsers || { totalActive: 0, deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 }, avgPagesPerSession: 0 };
  const recentActivity = data?.recentActivity || [];
  const liveConversions = data?.liveConversions || [];
  const topPages = data?.topPages || [];
  const realtimeMetrics = data?.realtimeMetrics || { hourlyMetrics: [], currentHour: [] };
  const liveSessions = data?.liveSessions || [];
  const systemHealth = data?.systemHealth || { outOfStockProducts: 0, pendingOrders: 0, activeUsers: 0, recentProductViews: 0, healthScore: 100 };
  const performanceAlerts = data?.performanceAlerts || [];
  const chartsData = data?.charts || {
    activeUsersChart: { total: 0, byDevice: { desktop: 0, mobile: 0, tablet: 0 }, trend: [] },
    conversionMetrics: { currentHour: {}, hourlyTrend: [] },
    topProducts: []
  };

  // Process hourly data for charts
  const hourlyChartData = realtimeMetrics.hourlyMetrics.map(item => ({
    hour: hourNames[item._id.hour],
    sessions: item.sessions,
    conversions: item.conversions,
    date: item._id.date
  }));

  // Process device data for pie chart
  const deviceData = [
    { name: 'Desktop', value: activeUsers.deviceBreakdown.desktop },
    { name: 'Mobile', value: activeUsers.deviceBreakdown.mobile },
    { name: 'Tablet', value: activeUsers.deviceBreakdown.tablet }
  ].filter(item => item.value > 0);

  // Chart colors based on CSS variables
  const chartColors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)'
  ];

  // Get health status based on score
  const getHealthStatus = (score: number) => {
    if (score >= 90) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 70) return { status: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 50) return { status: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'Poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const healthStatus = getHealthStatus(systemHealth.healthScore);

  const MetricCard = ({
    title,
    value,
    subtitle,
    icon,
    trend,
    color = 'primary',
    live = false
  }: any) => {
    const colorClasses = {
      primary: 'bg-primary/10 text-primary border-l-4 border-primary',
      secondary: 'bg-secondary/10 text-secondary border-l-4 border-secondary',
      accent: 'bg-accent/10 text-accent-foreground border-l-4 border-accent',
      muted: 'bg-muted/50 text-muted-foreground border-l-4 border-muted',
    };

    return (
      <Card className={`shadow-sm hover:shadow-md transition-all duration-200 ${colorClasses[color as keyof typeof colorClasses]}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-lg bg-background/50">
              {icon}
            </div>
            {live && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1" />
                LIVE
              </Badge>
            )}
            {trend !== undefined && !live && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${trend >= 0
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(trend).toFixed(1)}%
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold mb-1">{value}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 backdrop-blur-sm">
        <p className="font-semibold text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      case 'mobile':
      case 'smartphone':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-10 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
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
          <Card className="border-destructive/50">
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
              <div className="p-2 bg-primary rounded-lg">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Real-Time Analytics
                </h1>
                <p className="text-muted-foreground mt-1">
                  Live monitoring of store performance and user activity
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4" />
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>

            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={toggleAutoRefresh}
              className="shadow-sm"
            >
              {autoRefresh ? <Wifi className="h-4 w-4 mr-2" /> : <WifiOff className="h-4 w-4 mr-2" />}
              Auto Refresh
            </Button>

            <Button variant="outline" size="sm" onClick={fetchData} className="shadow-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Active Users"
            value={activeUsers.totalActive.toString()}
            subtitle={`${activeUsers.avgPagesPerSession.toFixed(1)} avg pages/session`}
            icon={<Users className="h-6 w-6" />}
            live={true}
            color="primary"
          />
          <MetricCard
            title="Live Conversions"
            value={liveConversions.length.toString()}
            subtitle="In the last 24 hours"
            icon={<ShoppingCart className="h-6 w-6" />}
            live={true}
            color="secondary"
          />
          <MetricCard
            title="System Health"
            value={`${systemHealth.healthScore}%`}
            subtitle={healthStatus.status}
            icon={<Activity className="h-6 w-6" />}
            live={true}
            color="accent"
          />
          <MetricCard
            title="Top Product Views"
            value={topPages.length > 0 ? topPages[0].views.toString() : "0"}
            subtitle={topPages.length > 0 ? topPages[0].productName || 'Unknown' : 'No data'}
            icon={<Eye className="h-6 w-6" />}
            live={true}
            color="muted"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-card border border-border rounded-lg p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
            >
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="sessions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
            >
              <Users className="h-4 w-4 mr-2" />
              Sessions
            </TabsTrigger>
            <TabsTrigger
              value="conversions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Conversions
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
            >
              <Cpu className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Users by Device */}
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Active Users by Device
                  </CardTitle>
                  <CardDescription>Current user distribution across devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Hourly Activity */}
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-secondary" />
                    Hourly Activity
                  </CardTitle>
                  <CardDescription>User activity over the last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={hourlyChartData}>
                      <defs>
                        <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="sessions"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        fill="url(#colorSessions)"
                        name="Sessions"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest user sessions and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.slice(0, 8).map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {activity.user_id?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{activity.user_id?.name || 'Unknown User'}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.location?.city}, {activity.location?.country} • {formatTimeAgo(activity.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(activity.device_info?.type)}
                        <p className="text-xs text-muted-foreground">{activity.session_duration}s</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Sessions */}
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Live Sessions
                  </CardTitle>
                  <CardDescription>Currently active user sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {liveSessions.slice(0, 8).map((session, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {session.user_id?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{session.user_id?.name || 'Unknown User'}</p>
                            <p className="text-xs text-muted-foreground">
                              {session.location?.city}, {session.location?.country}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(session.device_info?.type)}
                          <p className="text-xs text-muted-foreground">{formatTimeAgo(session.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Session Metrics */}
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-secondary" />
                    Session Metrics
                  </CardTitle>
                  <CardDescription>Current hour session statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Current Hour Sessions</span>
                        <span className="text-2xl font-bold">{realtimeMetrics.currentHour[0]?.sessions || 0}</span>
                      </div>
                      <Progress
                        value={(realtimeMetrics.currentHour[0]?.sessions || 0) / 10}
                        className="h-2 bg-primary/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                        <p className="text-xs text-muted-foreground mb-1">Avg Duration</p>
                        <p className="text-xl font-bold">{(realtimeMetrics.currentHour[0]?.avgSessionDuration || 0).toFixed(0)}s</p>
                      </div>
                      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="text-xs text-muted-foreground mb-1">Conversions</p>
                        <p className="text-xl font-bold">{realtimeMetrics.currentHour[0]?.conversions || 0}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <p className="text-sm text-muted-foreground mb-2">Pages per Session</p>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold">{activeUsers.avgPagesPerSession.toFixed(1)}</span>
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

            {/* Session Trends */}
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle>Session Trends</CardTitle>
                <CardDescription>Hourly session and conversion trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={hourlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis yAxisId="left" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sessions" fill="var(--chart-1)" name="Sessions" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="var(--chart-2)" strokeWidth={3} name="Conversions" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversions Tab */}
          <TabsContent value="conversions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Conversions */}
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    Live Conversions
                  </CardTitle>
                  <CardDescription>Recent purchases and orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {liveConversions.slice(0, 8).map((conversion, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                            {conversion.user_id?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{conversion.user_id?.name || 'Unknown User'}</p>
                            <p className="text-xs text-muted-foreground">
                              Order #{conversion.order_number} • {formatTimeAgo(conversion.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">${conversion.total.toFixed(2)}</p>
                          <Badge className={`text-xs ${conversion.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                            conversion.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>
                            {conversion.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Conversion Metrics */}
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                    Conversion Metrics
                  </CardTitle>
                  <CardDescription>Current conversion statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Current Hour Conversions</span>
                        <span className="text-2xl font-bold">{realtimeMetrics.currentHour[0]?.conversions || 0}</span>
                      </div>
                      <Progress
                        value={(realtimeMetrics.currentHour[0]?.conversions || 0) * 10}
                        className="h-2 bg-primary/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                        <p className="text-xs text-muted-foreground mb-1">Conversion Rate</p>
                        <p className="text-xl font-bold">
                          {realtimeMetrics.currentHour[0]?.sessions > 0
                            ? ((realtimeMetrics.currentHour[0]?.conversions / realtimeMetrics.currentHour[0]?.sessions) * 100).toFixed(1)
                            : 0}%
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="text-xs text-muted-foreground mb-1">Avg Order Value</p>
                        <p className="text-xl font-bold">
                          ${liveConversions.length > 0
                            ? (liveConversions.reduce((sum, c) => sum + c.total, 0) / liveConversions.length).toFixed(0)
                            : 0}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <p className="text-sm text-muted-foreground mb-2">Performance Alerts</p>
                      <div className="space-y-2">
                        {performanceAlerts.length > 0 ? (
                          performanceAlerts.map((alert, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              <p className="text-xs text-red-700">
                                {alert.count} {alert._id} orders (${alert.totalValue.toFixed(2)})
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <p className="text-xs text-green-700">No performance issues detected</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conversion Trends */}
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle>Conversion Trends</CardTitle>
                <CardDescription>Hourly conversion trends over the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="conversions"
                      stroke="var(--chart-2)"
                      strokeWidth={3}
                      name="Conversions"
                      dot={{ fill: 'var(--chart-2)', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Top Products
                  </CardTitle>
                  <CardDescription>Most viewed products in the last hour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPages.slice(0, 8).map((product, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{product.productName || 'Unknown Product'}</p>
                            <p className="text-xs text-muted-foreground">${product.price?.toFixed(2) || '0.00'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{product.views} views</p>
                          <p className="text-xs text-muted-foreground">{product.uniqueViewerCount} users</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Product Engagement */}
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="h-5 w-5 text-secondary" />
                    Product Engagement
                  </CardTitle>
                  <CardDescription>Products with highest engagement time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topPages.slice(0, 10).sort((a, b) => b.avgDuration - a.avgDuration)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis
                        dataKey="productName"
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="avgDuration"
                        fill="var(--chart-3)"
                        radius={[4, 4, 0, 0]}
                        name="Avg Duration (s)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Product Details */}
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Detailed metrics for top products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium text-muted-foreground">Product</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">Views</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">Unique Viewers</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">Avg Duration</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">Views/Min</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPages.slice(0, 10).map((product, idx) => (
                        <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="p-3 font-medium">{product.productName || 'Unknown Product'}</td>
                          <td className="p-3 text-right">{product.views}</td>
                          <td className="p-3 text-right">{product.uniqueViewerCount}</td>
                          <td className="p-3 text-right">{product.avgDuration.toFixed(2)}s</td>
                          <td className="p-3 text-right">{product.viewsPerMinute.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health */}
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    System Health
                  </CardTitle>
                  <CardDescription>Overall system performance status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Health Score</span>
                        <span className="text-2xl font-bold">{systemHealth.healthScore}%</span>
                      </div>
                      <Progress
                        value={systemHealth.healthScore}
                        className="h-2 bg-primary/20"
                      />
                      <div className="mt-2 flex justify-between">
                        <span className="text-xs text-muted-foreground">Status:</span>
                        <Badge className={`text-xs ${healthStatus.bg} ${healthStatus.color} border-current`}>
                          {healthStatus.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                        <p className="text-xs text-muted-foreground mb-1">Out of Stock</p>
                        <p className="text-xl font-bold">{systemHealth.outOfStockProducts}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="text-xs text-muted-foreground mb-1">Pending Orders</p>
                        <p className="text-xl font-bold">{systemHealth.pendingOrders}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                        <p className="text-xs text-muted-foreground mb-1">Active Users</p>
                        <p className="text-xl font-bold">{systemHealth.activeUsers}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="text-xs text-muted-foreground mb-1">Product Views</p>
                        <p className="text-xl font-bold">{systemHealth.recentProductViews}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Alerts */}
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertOctagon className="h-5 w-5 text-secondary" />
                    Performance Alerts
                  </CardTitle>
                  <CardDescription>System issues that need attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemHealth.outOfStockProducts > 0 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-semibold text-sm text-red-700">Out of Stock Products</p>
                          <p className="text-xs text-red-600">{systemHealth.outOfStockProducts} products need restocking</p>
                        </div>
                      </div>
                    )}

                    {systemHealth.pendingOrders > 0 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="font-semibold text-sm text-yellow-700">Pending Orders</p>
                          <p className="text-xs text-yellow-600">{systemHealth.pendingOrders} orders awaiting processing</p>
                        </div>
                      </div>
                    )}

                    {performanceAlerts.length > 0 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-semibold text-sm text-red-700">Failed/Cancelled Orders</p>
                          <p className="text-xs text-red-600">
                            {performanceAlerts.reduce((sum, alert) => sum + alert.count, 0)} orders with issues
                          </p>
                        </div>
                      </div>
                    )}

                    {systemHealth.outOfStockProducts === 0 &&
                      systemHealth.pendingOrders === 0 &&
                      performanceAlerts.length === 0 && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-semibold text-sm text-green-700">All Systems Operational</p>
                            <p className="text-xs text-green-600">No issues detected</p>
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Metrics */}
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle>System Metrics</CardTitle>
                <CardDescription>Detailed system performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <HardDrive className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-sm">Inventory Status</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Out of Stock</span>
                        <span className="font-semibold">{systemHealth.outOfStockProducts}</span>
                      </div>
                      <Progress value={systemHealth.outOfStockProducts > 0 ? 20 : 100} className="h-2" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="h-5 w-5 text-secondary" />
                      <h4 className="font-semibold text-sm">Order Processing</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pending Orders</span>
                        <span className="font-semibold">{systemHealth.pendingOrders}</span>
                      </div>
                      <Progress value={systemHealth.pendingOrders > 0 ? 30 : 100} className="h-2" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-accent-foreground" />
                      <h4 className="font-semibold text-sm">User Activity</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Active Users</span>
                        <span className="font-semibold">{systemHealth.activeUsers}</span>
                      </div>
                      <Progress value={systemHealth.activeUsers > 0 ? 80 : 20} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}