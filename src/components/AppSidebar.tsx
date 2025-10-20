import { NavLink } from "react-router-dom";
import {
  Shield,
  AlertTriangle,
  Server,
  Eye,
  FileCode,
  User,
  Settings,
  FileText,
  BarChart,
  Search,
  Network,
  Wrench,
  Users,
  Bell,
  Activity
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserRole } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: Shield },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
  { title: "Devices", url: "/devices", icon: Server },
  { title: "Threat Intel", url: "/threats", icon: Eye },
];

const monitoringItems = [
  { title: "Network Monitor", url: "/network", icon: Network },
  { title: "Vulnerability Scan", url: "/vulnerabilities", icon: Search },
  { title: "Detection Rules", url: "/rules", icon: FileCode },
  { title: "System Health", url: "/health", icon: Activity },
];

const toolsItems = [
  { title: "Security Tools", url: "/tools", icon: Wrench },
  { title: "Reports", url: "/reports", icon: BarChart },
  { title: "Audit Logs", url: "/audit", icon: FileText },
];

const adminItems = [
  { title: "User Management", url: "/users", icon: Users },
];

const userItems = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { isAdmin } = useUserRole();
  const isCollapsed = state === "collapsed";

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary/10 text-primary border-l-2 border-primary"
      : "hover:bg-muted/50";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Monitoring */}
        <SidebarGroup>
          <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {monitoringItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools & Reports */}
        <SidebarGroup>
          <SidebarGroupLabel>Tools & Reports</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Only */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>
              Admin
              {!isCollapsed && <Badge variant="destructive" className="ml-2">Admin</Badge>}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* User Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>User</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
