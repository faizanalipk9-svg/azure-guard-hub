import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Globe, Database, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { memo, useEffect, useCallback } from "react";

const ThreatIntelligence = memo(() => {
  const { data: threats = [], isLoading, error, refetch } = useQuery({
    queryKey: ['threat-intelligence'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('threat_intelligence')
        .select('*')
        .eq('active', true)
        .order('last_seen', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('threats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'threat_intelligence'
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

  const getSeverityVariant = useCallback((severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "secondary";
      case "medium": return "outline";
      case "low": return "outline";
      default: return "outline";
    }
  }, []);

  if (isLoading) {
    return (
      <Card className="cyber-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-success" />
            Threat Intelligence
          </CardTitle>
          <CardDescription>Loading threat data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="cyber-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-success" />
            Threat Intelligence
          </CardTitle>
          <CardDescription>Error loading threat intelligence</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="cyber-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-success" />
          Threat Intelligence
        </CardTitle>
        <CardDescription>
          Real-time threat indicators and intelligence feeds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {threats.map((threat) => (
          <div
            key={threat.id}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card/30 hover:bg-card/50 transition-colors"
          >
            <div className="p-2 rounded-full bg-success/10">
              <Globe className="h-4 w-4 text-success" />
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{threat.indicator}</h4>
                <Badge variant={getSeverityVariant(threat.severity) as any} className="text-xs">
                  {threat.severity}
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {threat.indicator_type} • {threat.threat_type} • {threat.source}
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Confidence</span>
                  <span>{threat.confidence_score}%</span>
                </div>
                <Progress 
                  value={threat.confidence_score} 
                  className="h-1"
                />
              </div>
              
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Last seen {formatDistanceToNow(new Date(threat.last_seen), { addSuffix: true })}
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex justify-center pt-2">
          <Badge variant="outline" className="text-xs">
            {threats.length} active threat indicators
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
});

ThreatIntelligence.displayName = "ThreatIntelligence";

export { ThreatIntelligence };
