import { Shield, Play, Pause, Settings, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const DetectionRules = () => {
  const rules = [
    {
      name: "PowerShell Encoded Commands",
      description: "Detects base64 encoded PowerShell execution",
      category: "Execution",
      severity: "High",
      enabled: true,
      triggers: 15,
      lastTriggered: "2 min ago"
    },
    {
      name: "Suspicious Registry Access",
      description: "Monitors critical registry key modifications",
      category: "Persistence",
      severity: "Medium",
      enabled: true,
      triggers: 3,
      lastTriggered: "1 hour ago"
    },
    {
      name: "Multiple Login Failures",
      description: "Tracks failed authentication attempts",
      category: "Credential Access",
      severity: "Critical",
      enabled: false,
      triggers: 0,
      lastTriggered: "Never"
    },
    {
      name: "Data Exfiltration Pattern",
      description: "Identifies unusual outbound data transfers",
      category: "Exfiltration", 
      severity: "High",
      enabled: true,
      triggers: 7,
      lastTriggered: "30 min ago"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "threat-critical";
      case "high": return "threat-high"; 
      case "medium": return "threat-medium";
      case "low": return "threat-low";
      default: return "muted";
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "destructive";
      case "high": return "secondary";
      case "medium": return "outline";
      case "low": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card className="cyber-glow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-success" />
            Detection Rules
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-3 w-3 mr-1" />
            Add Rule
          </Button>
        </CardTitle>
        <CardDescription>
          Active security detection and response rules
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rules.map((rule, index) => (
          <div
            key={rule.name}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card/30 hover:bg-card/50 transition-colors"
          >
            <Switch 
              checked={rule.enabled}
              className="data-[state=checked]:bg-success"
            />
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{rule.name}</h4>
                <Badge variant={getSeverityVariant(rule.severity)} className="text-xs">
                  {rule.severity}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {rule.description}
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {rule.category}
                  </Badge>
                  <span>{rule.triggers} triggers</span>
                  <span>Last: {rule.lastTriggered}</span>
                </div>
                
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            156 total rules • 142 active
          </div>
          <Button variant="outline" size="sm">
            Manage Rules
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { DetectionRules };