-- Create enum types for security data
CREATE TYPE public.alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.alert_status AS ENUM ('active', 'investigating', 'resolved', 'false_positive');
CREATE TYPE public.device_status AS ENUM ('protected', 'alert', 'warning', 'offline');
CREATE TYPE public.threat_type AS ENUM ('malware', 'phishing', 'suspicious_ip', 'data_exfiltration', 'privilege_escalation', 'lateral_movement');

-- Create security_alerts table
CREATE TABLE public.security_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity alert_severity NOT NULL,
  status alert_status NOT NULL DEFAULT 'active',
  source TEXT NOT NULL,
  source_ip INET,
  target_device TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

-- Create monitored_devices table
CREATE TABLE public.monitored_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('workstation', 'server', 'mobile', 'iot')),
  os_info TEXT NOT NULL,
  status device_status NOT NULL DEFAULT 'protected',
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  mac_address TEXT,
  threats_count INTEGER DEFAULT 0,
  compliance_score INTEGER DEFAULT 100 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Create detection_rules table
CREATE TABLE public.detection_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name TEXT NOT NULL,
  description TEXT,
  rule_type TEXT NOT NULL,
  severity alert_severity NOT NULL,
  enabled BOOLEAN DEFAULT true,
  rule_content TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_triggered TIMESTAMP WITH TIME ZONE,
  trigger_count INTEGER DEFAULT 0
);

-- Create threat_intelligence table
CREATE TABLE public.threat_intelligence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  indicator TEXT NOT NULL,
  indicator_type TEXT NOT NULL CHECK (indicator_type IN ('ip', 'domain', 'hash', 'url', 'email')),
  threat_type threat_type NOT NULL,
  severity alert_severity NOT NULL,
  source TEXT NOT NULL,
  description TEXT,
  first_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confidence_score INTEGER DEFAULT 50 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'
);

-- Create user profiles table for additional user info
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'analyst' CHECK (role IN ('admin', 'analyst', 'viewer')),
  department TEXT,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitored_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detection_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for security_alerts
CREATE POLICY "Users can view all security alerts" 
ON public.security_alerts FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can create security alerts" 
ON public.security_alerts FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Users can update security alerts" 
ON public.security_alerts FOR UPDATE 
TO authenticated 
USING (true);

-- Create RLS policies for monitored_devices
CREATE POLICY "Users can view all monitored devices" 
ON public.monitored_devices FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can create monitored devices" 
ON public.monitored_devices FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Users can update monitored devices" 
ON public.monitored_devices FOR UPDATE 
TO authenticated 
USING (true);

-- Create RLS policies for detection_rules
CREATE POLICY "Users can view all detection rules" 
ON public.detection_rules FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can create detection rules" 
ON public.detection_rules FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their detection rules" 
ON public.detection_rules FOR UPDATE 
TO authenticated 
USING (auth.uid() = created_by);

-- Create RLS policies for threat_intelligence
CREATE POLICY "Users can view all threat intelligence" 
ON public.threat_intelligence FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can create threat intelligence" 
ON public.threat_intelligence FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.user_profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_security_alerts_updated_at
  BEFORE UPDATE ON public.security_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_monitored_devices_updated_at
  BEFORE UPDATE ON public.monitored_devices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_detection_rules_updated_at
  BEFORE UPDATE ON public.detection_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'analyst'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for demonstration
INSERT INTO public.security_alerts (alert_id, title, description, severity, status, source, source_ip, target_device) VALUES
('ALT-001', 'Suspicious PowerShell Execution Detected', 'Encoded PowerShell command executed on DESKTOP-ABC123', 'critical', 'active', 'Endpoint Detection', '192.168.1.100', 'DESKTOP-ABC123'),
('ALT-002', 'Multiple Failed Login Attempts', '15 failed login attempts from IP 185.220.101.45', 'high', 'investigating', 'Azure AD', '185.220.101.45', NULL),
('ALT-003', 'Unusual Network Traffic Pattern', 'High data exfiltration detected on Server-PROD-01', 'medium', 'resolved', 'Network Monitor', '10.0.0.50', 'SERVER-PROD-01');

INSERT INTO public.monitored_devices (device_name, device_type, os_info, status, ip_address, threats_count, compliance_score) VALUES
('DESKTOP-ABC123', 'workstation', 'Windows 11', 'protected', '192.168.1.100', 0, 95),
('SERVER-PROD-01', 'server', 'Windows Server 2022', 'alert', '10.0.0.50', 2, 78),
('MOBILE-DEV-456', 'mobile', 'iOS 17.1', 'protected', '192.168.1.200', 0, 88);

INSERT INTO public.detection_rules (rule_name, description, rule_type, severity, rule_content) VALUES
('PowerShell Execution', 'Detects suspicious PowerShell activity', 'process', 'high', 'process_name contains "powershell" AND command_line contains "-enc"'),
('Failed Login Threshold', 'Triggers on multiple failed login attempts', 'authentication', 'medium', 'failed_login_count > 10 IN 5_minutes'),
('Data Exfiltration', 'Detects unusual outbound network traffic', 'network', 'critical', 'outbound_bytes > 100MB IN 1_hour');

INSERT INTO public.threat_intelligence (indicator, indicator_type, threat_type, severity, source, description, confidence_score) VALUES
('185.220.101.45', 'ip', 'suspicious_ip', 'high', 'AbuseIPDB', 'Known malicious IP involved in brute force attacks', 85),
('malware.exe', 'hash', 'malware', 'critical', 'VirusTotal', 'Confirmed malware hash detected in multiple campaigns', 95),
('phishing-site.com', 'domain', 'phishing', 'medium', 'PhishTank', 'Suspected phishing domain targeting corporate users', 70);