import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Plus, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ThreatIntel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: threats = [], isLoading } = useQuery({
    queryKey: ['threat-intelligence'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('threat_intelligence')
        .select('*')
        .order('last_seen', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createThreatMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from('threat_intelligence').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threat-intelligence'] });
      toast({ title: "Threat intelligence added successfully" });
    },
  });

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'bg-threat-critical/20 text-threat-critical border-threat-critical',
      high: 'bg-threat-high/20 text-threat-high border-threat-high',
      medium: 'bg-threat-medium/20 text-threat-medium border-threat-medium',
      low: 'bg-threat-low/20 text-threat-low border-threat-low',
    };
    return colors[severity as keyof typeof colors] || '';
  };

  const getThreatTypeColor = (type: string) => {
    const colors = {
      malware: 'bg-destructive/20 text-destructive',
      phishing: 'bg-warning/20 text-warning',
      suspicious_ip: 'bg-info/20 text-info',
      data_exfiltration: 'bg-threat-critical/20 text-threat-critical',
      privilege_escalation: 'bg-threat-high/20 text-threat-high',
      lateral_movement: 'bg-threat-medium/20 text-threat-medium',
    };
    return colors[type as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Threat Intelligence</h2>
          <p className="text-muted-foreground">Monitor known threats and indicators of compromise</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Threat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Threat Intelligence</DialogTitle>
              <DialogDescription>Register a new threat indicator</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              createThreatMutation.mutate({
                indicator: formData.get('indicator'),
                indicator_type: formData.get('indicator_type'),
                threat_type: formData.get('threat_type'),
                severity: formData.get('severity'),
                source: formData.get('source'),
                description: formData.get('description'),
                confidence_score: parseInt(formData.get('confidence_score') as string),
              });
              (e.target as HTMLFormElement).reset();
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="indicator">Indicator</Label>
                <Input 
                  id="indicator" 
                  name="indicator" 
                  placeholder="e.g., 192.168.1.100, malware.exe, example.com"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="indicator_type">Indicator Type</Label>
                <Select name="indicator_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ip">IP Address</SelectItem>
                    <SelectItem value="domain">Domain</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="hash">File Hash</SelectItem>
                    <SelectItem value="email">Email Address</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="threat_type">Threat Type</Label>
                <Select name="threat_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select threat type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="malware">Malware</SelectItem>
                    <SelectItem value="phishing">Phishing</SelectItem>
                    <SelectItem value="suspicious_ip">Suspicious IP</SelectItem>
                    <SelectItem value="data_exfiltration">Data Exfiltration</SelectItem>
                    <SelectItem value="privilege_escalation">Privilege Escalation</SelectItem>
                    <SelectItem value="lateral_movement">Lateral Movement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select name="severity" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input 
                  id="source" 
                  name="source" 
                  placeholder="e.g., VirusTotal, AlienVault OTX"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confidence_score">Confidence Score (0-100)</Label>
                <Input 
                  id="confidence_score" 
                  name="confidence_score" 
                  type="number" 
                  min="0" 
                  max="100" 
                  defaultValue="50"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              <Button type="submit" className="w-full">Add Threat Intelligence</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Threats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">Loading threats...</CardContent>
          </Card>
        ) : threats.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No threats found
            </CardContent>
          </Card>
        ) : (
          threats.map((threat) => (
            <Card key={threat.id} className="cyber-glow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-mono">{threat.indicator}</CardTitle>
                  </div>
                  {threat.active && (
                    <Badge className="bg-destructive/20 text-destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>
                <CardDescription className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getSeverityColor(threat.severity)}>
                      {threat.severity.toUpperCase()}
                    </Badge>
                    <Badge className={getThreatTypeColor(threat.threat_type)}>
                      {threat.threat_type.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{threat.indicator_type.toUpperCase()}</Badge>
                  </div>
                  {threat.description && (
                    <p className="text-sm">{threat.description}</p>
                  )}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <span className="font-medium">{threat.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="font-medium">{threat.confidence_score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">First Seen:</span>
                      <span>{format(new Date(threat.first_seen), 'PP')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Seen:</span>
                      <span>{format(new Date(threat.last_seen), 'PP')}</span>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ThreatIntel;
