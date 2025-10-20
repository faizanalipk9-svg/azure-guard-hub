import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Cpu, HardDrive, Zap, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const SystemHealth = () => {
  const systemMetrics = [
    { name: 'CPU Usage', value: 45, status: 'healthy', icon: Cpu, unit: '%' },
    { name: 'Memory Usage', value: 62, status: 'warning', icon: Activity, unit: '%' },
    { name: 'Disk Usage', value: 78, status: 'warning', icon: HardDrive, unit: '%' },
    { name: 'Network I/O', value: 34, status: 'healthy', icon: TrendingUp, unit: 'Mbps' },
  ];

  const services = [
    { name: 'Authentication Service', status: 'operational', uptime: '99.99%', responseTime: '45ms' },
    { name: 'Database Cluster', status: 'operational', uptime: '99.95%', responseTime: '12ms' },
    { name: 'API Gateway', status: 'operational', uptime: '99.99%', responseTime: '23ms' },
    { name: 'Threat Detection Engine', status: 'operational', uptime: '99.98%', responseTime: '150ms' },
    { name: 'Log Aggregator', status: 'degraded', uptime: '98.50%', responseTime: '890ms' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return 'outline';
      case 'warning':
      case 'degraded':
        return 'default';
      case 'critical':
      case 'down':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
        <p className="text-muted-foreground">
          Monitor infrastructure and service status
        </p>
      </div>

      {/* System Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}{metric.unit}</div>
              <div className="mt-2">
                <Progress value={metric.value} />
              </div>
              <Badge variant={getStatusColor(metric.status)} className="mt-2">
                {metric.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Service Status
          </CardTitle>
          <CardDescription>Real-time status of all services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{service.name}</h3>
                    <Badge variant={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Uptime: {service.uptime}</span>
                    <span>Response: {service.responseTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trends</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart visualization would go here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Rate</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart visualization would go here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemHealth;
