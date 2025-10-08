import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Monitor, Smartphone, Server, CheckCircle, AlertCircle, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { memo, useEffect, useCallback } from "react";

const DeviceMonitor = memo(() => {
  const { data: devices = [], isLoading, error, refetch } = useQuery({
    queryKey: ['monitored-devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monitored_devices')
        .select('*')
        .order('last_seen', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('devices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'monitored_devices'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const getDeviceIcon = useCallback((deviceType: string) => {
    switch (deviceType) {
      case "workstation": return Monitor;
      case "server": return Server;
      case "mobile": return Smartphone;
      default: return Monitor;
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "protected": return "default";
      case "alert": return "destructive";
      case "warning": return "secondary";
      default: return "outline";
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "protected": return CheckCircle;
      case "alert": return AlertCircle;
      default: return Shield;
    }
  }, []);

  if (isLoading) {
    return (
      <Card className="cyber-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-info" />
            Device Monitor
          </CardTitle>
          <CardDescription>Loading devices...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="cyber-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-info" />
            Device Monitor
          </CardTitle>
          <CardDescription>Error loading devices</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="cyber-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-info" />
          Device Monitor
        </CardTitle>
        <CardDescription>
          Endpoint security and compliance status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {devices.map((device) => {
          const StatusIcon = getStatusIcon(device.status);
          const DeviceIcon = getDeviceIcon(device.device_type);
          
          return (
            <div
              key={device.id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card/30 hover:bg-card/50 transition-colors"
            >
              <div className="p-2 rounded-full bg-secondary/50">
                <DeviceIcon className="h-4 w-4 text-info" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{device.device_name}</h4>
                  <Badge variant={getStatusColor(device.status) as any} className="text-xs">
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {device.status}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {device.os_info} • Last seen {formatDistanceToNow(new Date(device.last_seen), { addSuffix: true })}
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Compliance Score</span>
                    <span>{device.compliance_score}%</span>
                  </div>
                  <Progress 
                    value={device.compliance_score} 
                    className="h-1"
                  />
                </div>
                
                {device.threats_count > 0 && (
                  <div className="text-xs text-threat-critical flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {device.threats_count} active threat{device.threats_count > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        <div className="pt-2 text-center">
          <Badge variant="outline" className="text-xs">
            {devices.length} total devices monitored
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
});

DeviceMonitor.displayName = "DeviceMonitor";

export { DeviceMonitor };
