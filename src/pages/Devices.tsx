import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Plus, Shield, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const Devices = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: devices = [], isLoading } = useQuery({
    queryKey: ['monitored-devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monitored_devices')
        .select('*')
        .order('last_seen', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createDeviceMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from('monitored_devices').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitored-devices'] });
      toast({ title: "Device added successfully" });
    },
  });

  const updateDeviceMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('monitored_devices')
        .update({ status: status as any })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitored-devices'] });
      toast({ title: "Device status updated" });
    },
  });

  const getStatusColor = (status: string) => {
    const colors = {
      protected: 'bg-success/20 text-success border-success',
      alert: 'bg-destructive/20 text-destructive border-destructive',
      warning: 'bg-warning/20 text-warning border-warning',
      offline: 'bg-muted text-muted-foreground border-muted',
    };
    return colors[status as keyof typeof colors] || '';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'protected') return <Shield className="h-4 w-4" />;
    if (status === 'alert') return <AlertTriangle className="h-4 w-4" />;
    return <Server className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Device Monitoring</h2>
          <p className="text-muted-foreground">Track and manage all monitored devices</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
              <DialogDescription>Register a new device for monitoring</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              createDeviceMutation.mutate({
                device_name: formData.get('device_name'),
                device_type: formData.get('device_type'),
                os_info: formData.get('os_info'),
                ip_address: formData.get('ip_address'),
                mac_address: formData.get('mac_address'),
              });
              (e.target as HTMLFormElement).reset();
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="device_name">Device Name</Label>
                <Input id="device_name" name="device_name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="device_type">Device Type</Label>
                <Select name="device_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workstation">Workstation</SelectItem>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="laptop">Laptop</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="iot">IoT Device</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="os_info">Operating System</Label>
                <Input id="os_info" name="os_info" placeholder="e.g., Windows 11, Ubuntu 22.04" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip_address">IP Address</Label>
                <Input id="ip_address" name="ip_address" placeholder="e.g., 192.168.1.100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mac_address">MAC Address</Label>
                <Input id="mac_address" name="mac_address" placeholder="e.g., 00:1B:44:11:3A:B7" />
              </div>
              <Button type="submit" className="w-full">Add Device</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">Loading devices...</CardContent>
          </Card>
        ) : devices.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No devices found
            </CardContent>
          </Card>
        ) : (
          devices.map((device) => (
            <Card key={device.id} className="cyber-glow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{device.device_name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(device.status)}>
                    {getStatusIcon(device.status)}
                    <span className="ml-1">{device.status}</span>
                  </Badge>
                </div>
                <CardDescription className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{device.device_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">OS:</span>
                    <span className="font-medium">{device.os_info}</span>
                  </div>
                  {device.ip_address && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IP:</span>
                      <span className="font-mono text-sm">{String(device.ip_address)}</span>
                    </div>
                  )}
                  {device.mac_address && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">MAC:</span>
                      <span className="font-mono text-sm">{device.mac_address}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compliance:</span>
                    <span className="font-medium">{device.compliance_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Threats:</span>
                    <span className="font-medium">{device.threats_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Seen:</span>
                    <span className="text-sm">{format(new Date(device.last_seen), 'PPp')}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => updateDeviceMutation.mutate({ id: device.id, status: 'protected' })}
                  >
                    Mark Safe
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => updateDeviceMutation.mutate({ id: device.id, status: 'alert' })}
                  >
                    Flag Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Devices;
