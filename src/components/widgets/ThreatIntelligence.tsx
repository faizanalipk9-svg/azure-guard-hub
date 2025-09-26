import { Globe, TrendingUp, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ThreatIntelligence = () => {
  const threatData = [
    {
      ip: "185.220.101.45",
      country: "Russia",
      confidence: "High",
      lastSeen: "2 hours ago",
      category: "Malware C2",
      description: "Known botnet command and control server",
      riskScore: 95
    },
    {
      ip: "203.198.45.223",
      country: "China",
      confidence: "Medium",
      lastSeen: "6 hours ago", 
      category: "Brute Force",
      description: "Source of credential stuffing attacks",
      riskScore: 78
    },
    {
      ip: "91.234.99.167",
      country: "Germany",
      confidence: "Low",
      lastSeen: "1 day ago",
      category: "Scanning",
      description: "Port scanning and reconnaissance activity",
      riskScore: 45
    }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 90) return "threat-critical";
    if (score >= 70) return "threat-high";
    if (score >= 50) return "threat-medium";
    return "threat-low";
  };

  const getConfidenceVariant = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card className="cyber-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-info" />
          Threat Intelligence
        </CardTitle>
        <CardDescription>
          Real-time threat actor tracking and IOC analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {threatData.map((threat, index) => (
          <div
            key={threat.ip}
            className="flex items-start gap-4 p-4 rounded-lg border bg-card/30 hover:bg-card/50 transition-colors"
          >
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {threat.ip}
                  </code>
                  <Badge variant={getConfidenceVariant(threat.confidence)} className="text-xs">
                    {threat.confidence} Confidence
                  </Badge>
                </div>
                <div className={`text-sm font-semibold text-${getRiskColor(threat.riskScore)}`}>
                  Risk: {threat.riskScore}%
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {threat.country}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {threat.lastSeen}
                </span>
                <Badge variant="outline" className="text-xs">
                  {threat.category}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {threat.description}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${getRiskColor(threat.riskScore)}`} />
                  <span className="text-xs text-muted-foreground">
                    Active threat indicator
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Investigate
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>Updated 5 minutes ago</span>
          </div>
          <Button variant="outline" size="sm">
            View Threat Feed
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { ThreatIntelligence };