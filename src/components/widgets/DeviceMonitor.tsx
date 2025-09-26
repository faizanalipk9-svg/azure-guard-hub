import { Monitor, Smartphone, Server, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const DeviceMonitor = () => {
  const devices = [
    {
      name: "DESKTOP-ABC123",
      type: "workstation",
      os: "Windows 11",
      status: "protected",
      lastSeen: "2 min ago",
      threats: 0,
      compliance: 95,
      icon: Monitor
    },
    {
      name: "SERVER-PROD-01",
      type: "server",
      os: "Windows Server 2022",
      status: "alert",
      lastSeen: "1 min ago",
      threats: 2,
      compliance: 78,
      icon: Server
    },
    {
      name: "MOBILE-DEV-456",
      type: "mobile",
      os: "iOS 17.1",
      status: "protected",
      lastSeen: "15 min ago",
      threats: 0,
      compliance: 88,
      icon: Smartphone
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "protected": return "default";
      case "alert": return "destructive";
      case "warning": return "secondary";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "protected": return CheckCircle;
      case "alert": return AlertCircle;
      default: return Shield;
    }
  };

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
          
          return (
            <div
              key={device.name}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card/30 hover:bg-card/50 transition-colors"
            >
              <div className="p-2 rounded-full bg-secondary/50">
                <device.icon className="h-4 w-4 text-info" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{device.name}</h4>
                  <Badge variant={getStatusColor(device.status)} className="text-xs">
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {device.status}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {device.os} • Last seen {device.lastSeen}
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Compliance Score</span>
                    <span>{device.compliance}%</span>
                  </div>
                  <Progress 
                    value={device.compliance} 
                    className="h-1"
                  />
                </div>
                
                {device.threats > 0 && (
                  <div className="text-xs text-threat-critical flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {device.threats} active threat{device.threats > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        <div className="pt-2 text-center">
          <Badge variant="outline" className="text-xs">
            847 total devices monitored
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export { DeviceMonitor };