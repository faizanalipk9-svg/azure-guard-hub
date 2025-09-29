import { AlertTriangle, Clock, Shield, Skull, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

const AlertsWidget = () => {
  const { data: alerts = [], isLoading, error } = useQuery({
    queryKey: ['security-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const getIconForSeverity = (severity: string) => {
    switch (severity) {
      case "critical": return Skull;
      case "high": return Target;
      default: return AlertTriangle;
    }
  };

  if (isLoading) {
    return (
      <Card className="threat-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-threat-critical" />
            Security Alerts
          </CardTitle>
          <CardDescription>Loading alerts...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="threat-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-threat-critical" />
            Security Alerts
          </CardTitle>
          <CardDescription>Error loading alerts</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "threat-critical";
      case "high": return "threat-high";
      case "medium": return "threat-medium";
      case "low": return "threat-low";
      default: return "muted";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "destructive";
      case "investigating": return "secondary";
      case "resolved": return "default";
      default: return "outline";
    }
  };

  return (
    <Card className="threat-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-threat-critical" />
          Security Alerts
        </CardTitle>
        <CardDescription>
          Real-time threat detection and incident response
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => {
          const IconComponent = getIconForSeverity(alert.severity);
          
          return (
            <div
              key={alert.id}
              className="flex items-start gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
            >
              <div className={`p-2 rounded-full bg-${getSeverityColor(alert.severity)}/10`}>
                <IconComponent className={`h-4 w-4 text-${getSeverityColor(alert.severity)}`} />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">{alert.title}</h4>
                  <Badge variant={getStatusVariant(alert.status)} className="text-xs">
                    {alert.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {alert.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {alert.source}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    Investigate
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="flex justify-center pt-2">
          <Button variant="outline" size="sm">
            View All Alerts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { AlertsWidget };