import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Bell, Shield, Eye, Zap } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(true);
  const [autoDetection, setAutoDetection] = useState(true);
  const [threatIntel, setThreatIntel] = useState(true);

  const handleSettingChange = (setting: string, value: boolean) => {
    toast({
      title: "Setting Updated",
      description: `${setting} ${value ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your security dashboard preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage how you receive alerts and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-alerts">Email Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive security alerts via email
                </p>
              </div>
              <Switch
                id="email-alerts"
                checked={emailAlerts}
                onCheckedChange={(checked) => {
                  setEmailAlerts(checked);
                  handleSettingChange('Email alerts', checked);
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get instant push notifications
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={(checked) => {
                  setPushNotifications(checked);
                  handleSettingChange('Push notifications', checked);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Configure security monitoring options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="real-time">Real-time Monitoring</Label>
                <p className="text-sm text-muted-foreground">
                  Enable live security monitoring
                </p>
              </div>
              <Switch
                id="real-time"
                checked={realTimeMonitoring}
                onCheckedChange={(checked) => {
                  setRealTimeMonitoring(checked);
                  handleSettingChange('Real-time monitoring', checked);
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-detection">Auto Detection</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically detect threats
                </p>
              </div>
              <Switch
                id="auto-detection"
                checked={autoDetection}
                onCheckedChange={(checked) => {
                  setAutoDetection(checked);
                  handleSettingChange('Auto detection', checked);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Monitoring Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Monitoring
            </CardTitle>
            <CardDescription>
              Configure monitoring preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="threat-intel">Threat Intelligence</Label>
                <p className="text-sm text-muted-foreground">
                  Enable threat intelligence feeds
                </p>
              </div>
              <Switch
                id="threat-intel"
                checked={threatIntel}
                onCheckedChange={(checked) => {
                  setThreatIntel(checked);
                  handleSettingChange('Threat intelligence', checked);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Advanced
            </CardTitle>
            <CardDescription>
              Advanced configuration options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Dashboard Refresh Rate</Label>
              <p className="text-sm text-muted-foreground">
                Current: Every 30 seconds
              </p>
            </div>
            <div className="space-y-2">
              <Label>Data Retention</Label>
              <p className="text-sm text-muted-foreground">
                Current: 90 days
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
