import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Devices = lazy(() => import("./pages/Devices"));
const Rules = lazy(() => import("./pages/Rules"));
const ThreatIntel = lazy(() => import("./pages/ThreatIntel"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const AuditLogs = lazy(() => import("./pages/AuditLogs"));
const Reports = lazy(() => import("./pages/Reports"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const VulnerabilityScanner = lazy(() => import("./pages/VulnerabilityScanner"));
const NetworkMonitor = lazy(() => import("./pages/NetworkMonitor"));
const SecurityTools = lazy(() => import("./pages/SecurityTools"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const Notifications = lazy(() => import("./pages/Notifications"));
const SystemHealth = lazy(() => import("./pages/SystemHealth"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-6">
    <div className="space-y-4 w-full max-w-2xl">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Index />}>
                  <Route index element={<Dashboard />} />
                  <Route path="alerts" element={<Alerts />} />
                  <Route path="devices" element={<Devices />} />
                  <Route path="rules" element={<Rules />} />
                  <Route path="threats" element={<ThreatIntel />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="audit" element={<AuditLogs />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="vulnerabilities" element={<VulnerabilityScanner />} />
                  <Route path="network" element={<NetworkMonitor />} />
                  <Route path="tools" element={<SecurityTools />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="health" element={<SystemHealth />} />
                </Route>
                <Route path="/auth" element={<Auth />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
