import { Shield, AlertTriangle, Activity, Users, Server, Eye, Zap, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertsWidget } from "./widgets/AlertsWidget";
import { DeviceMonitor } from "./widgets/DeviceMonitor";
import { ThreatIntelligence } from "./widgets/ThreatIntelligence";
import { DetectionRules } from "./widgets/DetectionRules";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SecurityDashboard = () => {
  const { user, signOut } = useAuth();

  // Fetch metrics data
  const { data: alertsCount = 0 } = useQuery({
    queryKey: ['alerts-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('security_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      return count || 0;
    },
  });

  const { data: devicesCount = 0 } = useQuery({
    queryKey: ['devices-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('monitored_devices')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: rulesCount = 0 } = useQuery({
    queryKey: ['rules-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('detection_rules')
        .select('*', { count: 'exact', head: true })
        .eq('enabled', true);
      return count || 0;
    },
  });

  const metrics = [
    {
      title: "Active Threats",
      value: alertsCount.toString(),
      change: "+2 from yesterday",
      Icon: AlertTriangle,
      color: "threat-critical",
      trend: "up"
    },
    {
      title: "Monitored Devices",
      value: devicesCount.toString(),
      change: "12 new this week",
      Icon: Server,
      color: "info",
      trend: "up"
    },
    {
      title: "Detection Rules",
      value: rulesCount.toString(),
      change: "8 updated today",
      Icon: Shield,
      color: "success",
      trend: "stable"
    },
    {
      title: "Events Processed",
      value: "2.4M",
      change: "↑ 15% from last hour",
      Icon: Activity,
      color: "cyber-glow",
      trend: "up"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            CyberGuard Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time security monitoring and threat detection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="cyber-glow">
            <Eye className="h-3 w-3 mr-1" />
            Real-time Monitoring
          </Badge>
          <Badge variant="outline" className="scan-animation">
            <Zap className="h-3 w-3 mr-1" />
            Active Scanning
          </Badge>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-3 w-3 mr-1" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={metric.title} className="cyber-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.Icon className={`h-4 w-4 text-${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Alerts and Threats */}
        <div className="lg:col-span-2 space-y-6">
          <AlertsWidget />
          <ThreatIntelligence />
        </div>

        {/* Right Column - Devices and Rules */}
        <div className="space-y-6">
          <DeviceMonitor />
          <DetectionRules />
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;