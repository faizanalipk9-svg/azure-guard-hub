import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Shield, LogOut, Eye, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Fetch unread notifications count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
      return count || 0;
    },
    enabled: !!user?.id,
  });

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
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <Shield className="h-6 w-6 text-primary animate-pulse" />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Azure Guard Hub
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">JCMtool Security Dashboard</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-md mx-4 hidden md:block">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts, devices, threats..."
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="cyber-glow hidden sm:flex">
                  <Eye className="h-3 w-3 mr-1" />
                  Live
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={() => navigate('/notifications')}
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
                <ThemeToggle />
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Sign Out</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
