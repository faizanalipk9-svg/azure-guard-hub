import { useEffect, memo } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, Server, Eye, FileCode, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex-1"></div>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary animate-pulse" />
              <div className="text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Azure Guard Hub
                </h1>
                <p className="text-sm text-muted-foreground">JCMtool Security Dashboard - Real-time Monitoring & Threat Detection</p>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-end gap-2">
              <Badge variant="outline" className="cyber-glow">
                <Eye className="h-3 w-3 mr-1" />
                Real-time Monitoring
              </Badge>
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-3 w-3 mr-1" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="dashboard" className="w-full" onValueChange={(value) => navigate(value === 'dashboard' ? '/' : `/${value}`)}>
            <TabsList className="h-12 bg-transparent border-none">
              <TabsTrigger value="dashboard" className="gap-2">
                <Shield className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="alerts" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Alerts
              </TabsTrigger>
              <TabsTrigger value="devices" className="gap-2">
                <Server className="h-4 w-4" />
                Devices
              </TabsTrigger>
              <TabsTrigger value="rules" className="gap-2">
                <FileCode className="h-4 w-4" />
                Rules
              </TabsTrigger>
              <TabsTrigger value="threats" className="gap-2">
                <Eye className="h-4 w-4" />
                Threat Intel
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Index;
