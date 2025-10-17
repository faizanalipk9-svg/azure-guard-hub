import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, User, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const AuditLogs = () => {
  const auditLogs = [
    {
      id: 1,
      action: 'User Login',
      user: 'admin@jcmtool.com',
      timestamp: new Date().toISOString(),
      status: 'success',
      details: 'Successful authentication from IP 192.168.1.100'
    },
    {
      id: 2,
      action: 'Detection Rule Updated',
      user: 'analyst@jcmtool.com',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'success',
      details: 'Modified rule: Suspicious Network Traffic'
    },
    {
      id: 3,
      action: 'Failed Login Attempt',
      user: 'unknown@example.com',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'failed',
      details: 'Invalid credentials from IP 203.0.113.45'
    },
    {
      id: 4,
      action: 'Alert Acknowledged',
      user: 'analyst@jcmtool.com',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      status: 'success',
      details: 'Acknowledged alert: High severity intrusion attempt'
    },
    {
      id: 5,
      action: 'Device Status Changed',
      user: 'system',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      status: 'warning',
      details: 'Device DESKTOP-001 status changed to at-risk'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <Shield className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">
          Track all system activities and user actions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            System Activity Log
          </CardTitle>
          <CardDescription>
            Recent security and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <Card key={log.id} className="border-l-4 border-l-primary/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(log.status)} className="gap-1">
                            {getStatusIcon(log.status)}
                            {log.status}
                          </Badge>
                          <span className="font-semibold">{log.action}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{log.user}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.details}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
