import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, Activity, Wifi, Globe, TrendingUp, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const NetworkMonitor = () => {
  const networkDevices = [
    { name: 'Router-01', ip: '192.168.1.1', status: 'online', traffic: 85, type: 'router' },
    { name: 'Switch-Core', ip: '192.168.1.2', status: 'online', traffic: 62, type: 'switch' },
    { name: 'Firewall-01', ip: '192.168.1.3', status: 'online', traffic: 78, type: 'firewall' },
    { name: 'Server-DB', ip: '192.168.1.10', status: 'warning', traffic: 95, type: 'server' },
    { name: 'AP-Floor1', ip: '192.168.1.20', status: 'online', traffic: 45, type: 'access-point' },
  ];

  const trafficData = [
    { protocol: 'HTTPS', packets: '1.2M', percentage: 45, color: 'bg-primary' },
    { protocol: 'HTTP', packets: '850K', percentage: 25, color: 'bg-accent' },
    { protocol: 'SSH', packets: '320K', percentage: 15, color: 'bg-success' },
    { protocol: 'DNS', packets: '180K', percentage: 10, color: 'bg-info' },
    { protocol: 'Other', packets: '150K', percentage: 5, color: 'bg-muted' },
  ];

  const anomalies = [
    {
      time: '14:32:15',
      type: 'Port Scan Detected',
      source: '203.0.113.45',
      severity: 'high',
    },
    {
      time: '14:28:03',
      type: 'Unusual Traffic Pattern',
      source: '192.168.1.105',
      severity: 'medium',
    },
    {
      time: '14:15:22',
      type: 'Failed Login Attempts',
      source: '198.51.100.23',
      severity: 'low',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Network Monitoring</h1>
        <p className="text-muted-foreground">
          Real-time network traffic analysis and topology
        </p>
      </div>

      {/* Network Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Devices</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Network className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Network Load</p>
                <p className="text-2xl font-bold">72%</p>
              </div>
              <Activity className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bandwidth</p>
                <p className="text-2xl font-bold">2.4 Gbps</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Anomalies</p>
                <p className="text-2xl font-bold text-destructive">3</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Network Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Network Devices
            </CardTitle>
            <CardDescription>Real-time device status and traffic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {networkDevices.map((device) => (
                <div key={device.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-muted-foreground">{device.ip}</p>
                      </div>
                    </div>
                    <Badge variant={device.status === 'online' ? 'outline' : 'destructive'}>
                      {device.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Traffic Load</span>
                      <span>{device.traffic}%</span>
                    </div>
                    <Progress value={device.traffic} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Protocol Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Protocol Distribution
            </CardTitle>
            <CardDescription>Network traffic by protocol</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficData.map((protocol) => (
                <div key={protocol.protocol} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{protocol.protocol}</span>
                    <span className="text-muted-foreground">{protocol.packets} packets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={protocol.percentage} className="flex-1" />
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {protocol.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anomaly Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Network Anomalies
          </CardTitle>
          <CardDescription>Detected unusual network activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {anomalies.map((anomaly, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={
                    anomaly.severity === 'high' ? 'destructive' :
                    anomaly.severity === 'medium' ? 'default' : 'outline'
                  }>
                    {anomaly.severity}
                  </Badge>
                  <div>
                    <p className="font-medium">{anomaly.type}</p>
                    <p className="text-sm text-muted-foreground">
                      Source: {anomaly.source} • {anomaly.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkMonitor;
