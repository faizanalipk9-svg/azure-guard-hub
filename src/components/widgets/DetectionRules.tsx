import { Zap, Play, Pause, Settings, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

const DetectionRules = () => {
  const { data: rules = [], isLoading, error } = useQuery({
    queryKey: ['detection-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('detection_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "secondary";
      case "medium": return "outline";
      case "low": return "outline";
      default: return "outline";
    }
  };

  if (isLoading) {
    return (
      <Card className="cyber-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-warning" />
            Detection Rules
          </CardTitle>
          <CardDescription>Loading detection rules...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="cyber-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-warning" />
            Detection Rules
          </CardTitle>
          <CardDescription>Error loading detection rules</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="cyber-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-warning" />
          Detection Rules
        </CardTitle>
        <CardDescription>
          Security detection and response automation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card/30 hover:bg-card/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Switch
                checked={rule.enabled}
                className="scale-75"
              />
              {rule.enabled ? (
                <Play className="h-3 w-3 text-success" />
              ) : (
                <Pause className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{rule.rule_name}</h4>
                <Badge variant={getSeverityVariant(rule.severity)} className="text-xs">
                  {rule.severity}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {rule.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {rule.trigger_count} triggers • Last: {
                    rule.last_triggered 
                      ? formatDistanceToNow(new Date(rule.last_triggered), { addSuffix: true })
                      : 'Never'
                  }
                </span>
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  <Settings className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex justify-center pt-2">
          <Badge variant="outline" className="text-xs">
            {rules.length} detection rules configured
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export { DetectionRules };