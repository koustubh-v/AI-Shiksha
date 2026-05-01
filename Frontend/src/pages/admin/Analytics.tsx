import { useState, useEffect, useCallback } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Analytics } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  RefreshCw,
  Users,
  MousePointerClick,
  Clock,
  Activity,
  Globe,
  Smartphone,
  Unplug,
  Loader2,
  Settings,
  ExternalLink,
  TrendingUp,
  Wifi,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

type DateRange = "today" | "7days" | "30days" | "thisMonth";

const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "thisMonth", label: "This Month" },
];

const DATE_RANGE_LABELS: Record<DateRange, string> = {
  today: "Today",
  "7days": "Last 7 Days",
  "30days": "Last 30 Days",
  thisMonth: "This Month",
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const [pageLoading, setPageLoading] = useState(true);
  const [status, setStatus] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [showSuperAdminSetup, setShowSuperAdminSetup] = useState(false);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [savingConfig, setSavingConfig] = useState(false);

  const [properties, setProperties] = useState<any[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [propertiesError, setPropertiesError] = useState(false);
  const [selectingProperty, setSelectingProperty] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange>("30days");

  // ── Boot ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("connected") === "true") {
      toast.success("Successfully authenticated with Google!");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (urlParams.get("error") === "oauth_failed") {
      toast.error("Google authentication failed. Please try again.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    fetchStatus();
  }, []);

  // Re-fetch data when date range changes (only when connected + property selected)
  useEffect(() => {
    if (status?.connected && status?.propertySelected) {
      fetchData(dateRange);
    }
  }, [dateRange]);

  // ── API helpers ───────────────────────────────────────────────────────────
  const fetchStatus = async () => {
    try {
      const res = await Analytics.getStatus();
      setStatus(res);
      if (res.connected && res.propertySelected) {
        fetchData("30days");
      } else if (res.connected && !res.propertySelected) {
        fetchProperties();
      }
      if (isSuperAdmin) {
        try {
          const config = await Analytics.getConfig();
          if (config.clientId) setClientId(config.clientId);
          if (config.clientSecret) setClientSecret(config.clientSecret);
        } catch { /* non-critical */ }
      }
    } catch {
      toast.error("Failed to load analytics status");
    } finally {
      setPageLoading(false);
    }
  };

  const fetchData = useCallback(async (range: DateRange) => {
    setDataLoading(true);
    try {
      const [traffic, acquisition] = await Promise.all([
        Analytics.getTraffic(range),
        Analytics.getAcquisition(range),
      ]);
      setData({ traffic, acquisition });
    } catch {
      toast.error("Failed to load analytics data");
    } finally {
      setDataLoading(false);
    }
  }, []);

  const fetchProperties = async () => {
    setPropertiesLoading(true);
    setPropertiesError(false);
    try {
      const props = await Analytics.listProperties();
      setProperties(props.properties || []);
    } catch {
      setPropertiesError(true);
      toast.error("Failed to load Google Analytics properties");
    } finally {
      setPropertiesLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const res = await Analytics.getOAuthUrl();
      if (res.url) window.location.href = res.url;
    } catch {
      toast.error("Failed to initiate Google connection");
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Disconnect Google Analytics from this franchise?")) return;
    try {
      await Analytics.disconnect();
      setStatus({ connected: false });
      setData(null);
      setProperties([]);
      toast.success("Disconnected from Google Analytics");
    } catch {
      toast.error("Failed to disconnect");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Analytics.forceRefresh();
      await fetchData(dateRange);
      toast.success("Analytics data refreshed");
    } catch {
      toast.error("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!clientId || !clientSecret) {
      toast.error("Please enter both Client ID and Client Secret");
      return;
    }
    setSavingConfig(true);
    try {
      await Analytics.saveConfig(clientId, clientSecret);
      toast.success("OAuth Configuration saved");
      setShowSuperAdminSetup(false);
    } catch {
      toast.error("Failed to save configuration");
    } finally {
      setSavingConfig(false);
    }
  };

  const handleSelectProperty = async (propertyId: string, propertyName: string) => {
    setSelectingProperty(true);
    try {
      await Analytics.connectProperty(propertyId, propertyName);
      toast.success(`Connected to ${propertyName}`);
      setStatus((prev: any) => ({ ...prev, propertySelected: true, propertyName, propertyId }));
      fetchData("30days");
    } catch {
      toast.error("Failed to connect property");
    } finally {
      setSelectingProperty(false);
    }
  };

  const getGADeepLink = () => {
    const propId = status?.propertyId;
    if (propId) {
      const numericId = propId.replace("properties/", "");
      return `https://analytics.google.com/analytics/web/#/p${numericId}/reports/intelligenthome`;
    }
    return "https://analytics.google.com";
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <AdminDashboardLayout title="Analytics">
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminDashboardLayout>
    );
  }

  // ── Not Connected ─────────────────────────────────────────────────────────
  if (!status?.connected) {
    return (
      <AdminDashboardLayout title="Analytics">
        <div className="max-w-2xl mx-auto mt-10 space-y-6">
          <Card className="border-2">
            <CardHeader className="text-center pb-6 pt-10">
              <div className="mx-auto bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Connect Google Analytics</CardTitle>
              <CardDescription className="text-base mt-2 max-w-md mx-auto">
                Sign in with your Google account that has access to this site's GA4 property to see traffic insights right here in the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-10 space-y-4">
              <Button size="lg" onClick={handleConnect} className="gap-2 px-8 h-12 text-base">
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign in with Google
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Requires a Google account with access to your site's GA4 property.
              </p>

              {isSuperAdmin && (
                <div className="w-full mt-8 border-t pt-6">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground gap-2"
                    onClick={() => setShowSuperAdminSetup(!showSuperAdminSetup)}
                  >
                    <Settings className="h-4 w-4" />
                    Super Admin — OAuth Configuration
                  </Button>
                  {showSuperAdminSetup && (
                    <div className="mt-4 space-y-4 p-4 bg-muted/30 rounded-xl border">
                      <div className="space-y-2">
                        <Label>Google Client ID</Label>
                        <Input value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="Client ID from Google Cloud Console" />
                      </div>
                      <div className="space-y-2">
                        <Label>Google Client Secret</Label>
                        <Input type="password" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} placeholder="Client Secret" />
                      </div>
                      <Button variant="secondary" className="w-full" onClick={handleSaveConfig} disabled={savingConfig}>
                        {savingConfig ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Configuration"}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        These credentials are used globally for the platform OAuth flow. Each franchise admin signs in with their own Google account.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminDashboardLayout>
    );
  }

  // ── Select Property ───────────────────────────────────────────────────────
  if (status?.connected && !status?.propertySelected) {
    return (
      <AdminDashboardLayout title="Analytics">
        <div className="max-w-2xl mx-auto mt-10">
          <Card className="border-2">
            <CardHeader className="text-center pb-6 pt-10">
              <div className="mx-auto bg-emerald-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <CardTitle className="text-2xl font-bold">Select Analytics Property</CardTitle>
              <CardDescription className="text-base mt-2">
                Signed in as <span className="font-medium text-foreground">{status?.email}</span>. Choose the GA4 property for this franchise.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-10 space-y-4">
              {propertiesLoading ? (
                <div className="flex flex-col items-center gap-3 py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading your GA4 properties…</p>
                </div>
              ) : propertiesError ? (
                <div className="flex flex-col items-center gap-4 py-10">
                  <AlertCircle className="h-10 w-10 text-destructive" />
                  <p className="text-sm text-muted-foreground text-center">Failed to load properties. Check your Google account permissions.</p>
                  <Button onClick={fetchProperties} variant="outline">Try Again</Button>
                </div>
              ) : properties.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <div className="bg-muted w-16 h-16 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">No GA4 Properties Found</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      This Google account doesn't have any GA4 properties. You need to create one first in Google Analytics.
                    </p>
                  </div>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <Button asChild>
                      <a href="https://support.google.com/analytics/answer/9304153" target="_blank" rel="noopener noreferrer" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Guide: Create GA4 Property
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    <Button variant="outline" onClick={fetchProperties}>Try Again</Button>
                  </div>
                  <div className="border-t w-full pt-4 flex justify-center">
                    <Button variant="ghost" className="text-destructive" onClick={handleDisconnect}>
                      <Unplug className="mr-2 h-4 w-4" /> Cancel &amp; Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {properties.map((prop) => (
                    <div key={prop.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                      <div>
                        <h4 className="font-medium text-foreground">{prop.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">ID: {prop.id}</p>
                      </div>
                      <Button onClick={() => handleSelectProperty(prop.id, prop.name)} disabled={selectingProperty}>
                        {selectingProperty ? <Loader2 className="h-4 w-4 animate-spin" /> : "Select"}
                      </Button>
                    </div>
                  ))}
                  <div className="flex justify-center border-t pt-4">
                    <Button variant="ghost" className="text-destructive" onClick={handleDisconnect}>
                      <Unplug className="mr-2 h-4 w-4" /> Cancel &amp; Disconnect
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminDashboardLayout>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  const ts = data?.traffic?.summary;
  const daily = data?.traffic?.daily || [];
  const acquisition = data?.acquisition || [];
  const topSource = acquisition[0];

  return (
    <AdminDashboardLayout title="Analytics Dashboard">
      <div className="flex flex-col space-y-6">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Connected · <span className="text-foreground font-medium">{status?.propertyName}</span>
              </span>
              {status?.lastSynced && (
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  · Synced {new Date(status.lastSynced).toLocaleTimeString()}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{status?.email}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Date Range Filters */}
            <div className="flex rounded-lg border bg-muted/30 p-0.5 gap-0.5">
              {DATE_RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDateRange(opt.value)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    dateRange === opt.value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-1.5">
              <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button size="sm" asChild className="gap-1.5">
              <a href={getGADeepLink()} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                Open Google Analytics
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDisconnect} className="text-destructive hover:text-destructive gap-1.5">
              <Unplug className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Loading overlay when changing date range */}
        {dataLoading && !ts && (
          <div className="flex justify-center items-center h-[40vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {ts && (
          <>
            {/* KPI Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
              {[
                { label: "Total Users", value: ts.users?.toLocaleString() ?? "—", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                { label: "New Users", value: ts.newUsers?.toLocaleString() ?? "—", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { label: "Sessions", value: ts.sessions?.toLocaleString() ?? "—", icon: Activity, color: "text-violet-500", bg: "bg-violet-500/10" },
                { label: "Engagement", value: `${ts.avgEngagementRate ?? 0}%`, icon: MousePointerClick, color: "text-amber-500", bg: "bg-amber-500/10" },
                { label: "Avg Session", value: ts.avgSessionDuration != null ? `${Math.floor(ts.avgSessionDuration / 60)}m ${ts.avgSessionDuration % 60}s` : "—", icon: Clock, color: "text-rose-500", bg: "bg-rose-500/10" },
              ].map((kpi) => (
                <Card key={kpi.label} className={cn("transition-opacity", dataLoading && "opacity-60")}>
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
                      <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", kpi.bg)}>
                        <kpi.icon className={cn("h-3.5 w-3.5", kpi.color)} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{DATE_RANGE_LABELS[dateRange]}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Traffic Area Chart */}
              <Card className={cn("lg:col-span-2 transition-opacity", dataLoading && "opacity-60")}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">User Traffic</CardTitle>
                    <Badge variant="secondary" className="text-xs">{DATE_RANGE_LABELS[dateRange]}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {daily.length === 0 ? (
                    <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">No data for this period</div>
                  ) : (
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={daily}>
                          <defs>
                            <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(v) => {
                              const s = String(v);
                              return s.length >= 8 ? `${s.substring(4, 6)}/${s.substring(6, 8)}` : s;
                            }}
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={11}
                            tickLine={false}
                          />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                            labelStyle={{ fontSize: 12 }}
                          />
                          <Area type="monotone" dataKey="users" name="Users" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#gUsers)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Traffic Sources */}
              <Card className={cn("transition-opacity", dataLoading && "opacity-60")}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  {acquisition.length === 0 ? (
                    <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">No data</div>
                  ) : (
                    <div className="space-y-3">
                      <div className="h-[130px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={acquisition} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="sessions" nameKey="channel">
                              {acquisition.map((_: any, i: number) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-1.5">
                        {acquisition.slice(0, 5).map((src: any, i: number) => (
                          <div key={src.channel} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                              <span className="text-muted-foreground truncate max-w-[120px]">{src.channel}</span>
                            </div>
                            <span className="font-medium tabular-nums">{src.sessions.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Go to Analytics CTA */}
            <Card className="bg-gradient-to-br from-primary/5 to-violet-500/5 border-primary/20">
              <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Detailed Analytics in Google Analytics</p>
                    <p className="text-sm text-muted-foreground">Explore audience segments, conversion funnels, real-time data and more.</p>
                  </div>
                </div>
                <Button asChild className="gap-2 flex-shrink-0">
                  <a href={getGADeepLink()} target="_blank" rel="noopener noreferrer">
                    Open Full Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
