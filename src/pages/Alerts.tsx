import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, XCircle, Filter, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { z } from "zod";

const alertSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().trim().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  source: z.string().trim().min(1, "Source is required").max(100, "Source must be less than 100 characters"),
  target_device: z.string().trim().max(100, "Target device must be less than 100 characters").optional(),
});

const Alerts = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['security-alerts', statusFilter, severityFilter],
    queryFn: async () => {
      let query = supabase.from('security_alerts').select('*').order('created_at', { ascending: false });
      
      if (statusFilter !== 'all') query = query.eq('status', statusFilter as any);
      if (severityFilter !== 'all') query = query.eq('severity', severityFilter as any);
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('security_alerts')
        .update({ status: status as any, resolved_at: status === 'resolved' ? new Date().toISOString() : null })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-alerts'] });
      toast({ title: "Alert updated successfully" });
    },
  });

  const createAlertMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      source: string;
      target_device?: string;
    }) => {
      const { error } = await supabase.from('security_alerts').insert([{
        alert_id: `ALT-${Date.now()}`,
        ...data,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-alerts'] });
      toast({ title: "Alert created successfully" });
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

  const getStatusIcon = (status: string) => {
    const icons = {
      active: <AlertTriangle className="h-4 w-4 text-destructive" />,
      investigating: <Clock className="h-4 w-4 text-warning" />,
      resolved: <CheckCircle className="h-4 w-4 text-success" />,
      false_positive: <XCircle className="h-4 w-4 text-muted-foreground" />,
    };
    return icons[status as keyof typeof icons];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Alerts</h2>
          <p className="text-muted-foreground">Monitor and manage security threats</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Security Alert</DialogTitle>
              <DialogDescription>Add a new security alert to the system</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              const data = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                severity: formData.get('severity') as string,
                source: formData.get('source') as string,
                target_device: formData.get('target_device') as string || undefined,
              };

              const result = alertSchema.safeParse(data);
              if (!result.success) {
                toast({
                  title: "Validation Error",
                  description: result.error.errors[0].message,
                  variant: "destructive",
                });
                return;
              }

              createAlertMutation.mutate(result.data as any);
              (e.target as HTMLFormElement).reset();
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
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
                <Input id="source" name="source" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_device">Target Device (Optional)</Label>
                <Input id="target_device" name="target_device" />
              </div>
              <Button type="submit" className="w-full">Create Alert</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="false_positive">False Positive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label>Severity</Label>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">Loading alerts...</CardContent>
          </Card>
        ) : alerts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No alerts found
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className="cyber-glow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(alert.status)}
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{alert.title}</CardTitle>
                      <CardDescription>{alert.description}</CardDescription>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{alert.source}</Badge>
                        {alert.target_device && (
                          <Badge variant="outline">{alert.target_device}</Badge>
                        )}
                        <Badge variant="secondary">
                          {format(new Date(alert.created_at), 'PPp')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {alert.status !== 'investigating' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatusMutation.mutate({ id: alert.id, status: 'investigating' })}
                      >
                        Investigate
                      </Button>
                    )}
                    {alert.status !== 'resolved' && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => updateStatusMutation.mutate({ id: alert.id, status: 'resolved' })}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;
