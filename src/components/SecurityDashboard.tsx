import { Shield, AlertTriangle, Activity, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertsWidget } from "./widgets/AlertsWidget";
import { DeviceMonitor } from "./widgets/DeviceMonitor";
import { ThreatIntelligence } from "./widgets/ThreatIntelligence";
import { DetectionRules } from "./widgets/DetectionRules";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { memo, useMemo } from "react";

const SecurityDashboard = memo(() => {

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

  const metrics = useMemo(() => [
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
  ], [alertsCount, devicesCount, rulesCount]);

  return (
    <div className="space-y-6">

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
});

SecurityDashboard.displayName = "SecurityDashboard";

export default SecurityDashboard;