import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Plus, Power, PowerOff } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

const Rules = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: rules = [], isLoading } = useQuery({
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

  const createRuleMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from('detection_rules').insert([{
        ...data,
        created_by: user?.id,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detection-rules'] });
      toast({ title: "Rule created successfully" });
    },
  });

  const toggleRuleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase
        .from('detection_rules')
        .update({ enabled })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detection-rules'] });
      toast({ title: "Rule status updated" });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Detection Rules</h2>
          <p className="text-muted-foreground">Manage automated threat detection rules</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Detection Rule</DialogTitle>
              <DialogDescription>Define a new automated detection rule</DialogDescription>
            </DialogHeader>
            <button data-dialog-close className="hidden" onClick={(e) => {
              e.currentTarget.closest('[role="dialog"]')?.querySelector<HTMLButtonElement>('[aria-label="Close"]')?.click();
            }} />
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                rule_name: formData.get('rule_name') as string,
                rule_type: formData.get('rule_type') as string,
                description: formData.get('description') as string,
                severity: formData.get('severity') as string,
                rule_content: formData.get('rule_content') as string,
                enabled: true,
              };
              createRuleMutation.mutate(data);
              (e.target as HTMLFormElement).reset();
              document.querySelector<HTMLButtonElement>('[data-dialog-close]')?.click();
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rule_name">Rule Name</Label>
                <Input id="rule_name" name="rule_name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rule_type">Rule Type</Label>
                <select 
                  name="rule_type" 
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select type</option>
                  <option value="network">Network</option>
                  <option value="file">File System</option>
                  <option value="process">Process</option>
                  <option value="registry">Registry</option>
                  <option value="user">User Behavior</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <select 
                  name="severity" 
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rule_content">Rule Content (YAML/JSON)</Label>
                <Textarea 
                  id="rule_content" 
                  name="rule_content" 
                  className="font-mono text-sm min-h-[200px]"
                  placeholder={`detection:
  selection:
    EventID: 4624
    LogonType: 3
  condition: selection`}
                  required 
                />
              </div>
              <Button type="submit" className="w-full">Create Rule</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">Loading rules...</CardContent>
          </Card>
        ) : rules.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No rules found
            </CardContent>
          </Card>
        ) : (
          rules.map((rule) => (
            <Card key={rule.id} className="cyber-glow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Shield className="h-5 w-5 text-primary mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{rule.rule_name}</CardTitle>
                        {rule.enabled ? (
                          <Badge className="bg-success/20 text-success">
                            <Power className="h-3 w-3 mr-1" />
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            <PowerOff className="h-3 w-3 mr-1" />
                            Disabled
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{rule.description}</CardDescription>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <Badge className={getSeverityColor(rule.severity)}>
                          {rule.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{rule.rule_type}</Badge>
                        {rule.trigger_count !== null && rule.trigger_count > 0 && (
                          <Badge variant="secondary">
                            Triggered {rule.trigger_count} times
                          </Badge>
                        )}
                        {rule.last_triggered && (
                          <Badge variant="secondary">
                            Last: {format(new Date(rule.last_triggered), 'PP')}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-3 p-3 bg-muted rounded-md">
                        <pre className="text-xs overflow-x-auto">
                          {rule.rule_content}
                        </pre>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.enabled || false}
                      onCheckedChange={(checked) => 
                        toggleRuleMutation.mutate({ id: rule.id, enabled: checked })
                      }
                    />
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

export default Rules;
