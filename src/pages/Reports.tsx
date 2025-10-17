import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Reports = () => {
  const reports = [
    {
      id: 1,
      title: 'Weekly Security Summary',
      description: 'Comprehensive overview of security events from the past week',
      date: new Date().toISOString(),
      type: 'Weekly',
      status: 'Ready'
    },
    {
      id: 2,
      title: 'Threat Intelligence Report',
      description: 'Latest threat indicators and security advisories',
      date: new Date(Date.now() - 86400000).toISOString(),
      type: 'Daily',
      status: 'Ready'
    },
    {
      id: 3,
      title: 'Device Compliance Report',
      description: 'Device security status and compliance metrics',
      date: new Date(Date.now() - 172800000).toISOString(),
      type: 'Monthly',
      status: 'Ready'
    },
    {
      id: 4,
      title: 'Alert Response Analysis',
      description: 'Performance metrics for alert handling and response times',
      date: new Date(Date.now() - 259200000).toISOString(),
      type: 'Weekly',
      status: 'Ready'
    },
  ];

  const stats = [
    {
      title: 'Total Reports',
      value: '24',
      icon: FileText,
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Active Threats',
      value: '7',
      icon: AlertTriangle,
      trend: '-23%',
      trendUp: false
    },
    {
      title: 'Protected Devices',
      value: '156',
      icon: Shield,
      trend: '+5%',
      trendUp: true
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate and download security reports
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className={`h-4 w-4 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={stat.trendUp ? 'text-green-500' : 'text-red-500'}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Available Reports
          </CardTitle>
          <CardDescription>
            Download and review generated security reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{report.title}</h3>
                        <Badge variant="outline">{report.type}</Badge>
                        <Badge variant="default">{report.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Generated: {new Date(report.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate New Report */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>
            Create a custom security report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Weekly Report
            </Button>
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Security Audit
            </Button>
            <Button variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Threat Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
