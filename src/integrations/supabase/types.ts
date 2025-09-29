export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      detection_rules: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          enabled: boolean | null
          id: string
          last_triggered: string | null
          rule_content: string
          rule_name: string
          rule_type: string
          severity: Database["public"]["Enums"]["alert_severity"]
          trigger_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          last_triggered?: string | null
          rule_content: string
          rule_name: string
          rule_type: string
          severity: Database["public"]["Enums"]["alert_severity"]
          trigger_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          last_triggered?: string | null
          rule_content?: string
          rule_name?: string
          rule_type?: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          trigger_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      monitored_devices: {
        Row: {
          compliance_score: number | null
          created_at: string
          device_name: string
          device_type: string
          id: string
          ip_address: unknown | null
          last_seen: string
          mac_address: string | null
          metadata: Json | null
          os_info: string
          status: Database["public"]["Enums"]["device_status"]
          threats_count: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          compliance_score?: number | null
          created_at?: string
          device_name: string
          device_type: string
          id?: string
          ip_address?: unknown | null
          last_seen?: string
          mac_address?: string | null
          metadata?: Json | null
          os_info: string
          status?: Database["public"]["Enums"]["device_status"]
          threats_count?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          compliance_score?: number | null
          created_at?: string
          device_name?: string
          device_type?: string
          id?: string
          ip_address?: unknown | null
          last_seen?: string
          mac_address?: string | null
          metadata?: Json | null
          os_info?: string
          status?: Database["public"]["Enums"]["device_status"]
          threats_count?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      security_alerts: {
        Row: {
          alert_id: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          resolved_at: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          source: string
          source_ip: unknown | null
          status: Database["public"]["Enums"]["alert_status"]
          target_device: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          alert_id: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          source: string
          source_ip?: unknown | null
          status?: Database["public"]["Enums"]["alert_status"]
          target_device?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          alert_id?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          source?: string
          source_ip?: unknown | null
          status?: Database["public"]["Enums"]["alert_status"]
          target_device?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      threat_intelligence: {
        Row: {
          active: boolean | null
          confidence_score: number | null
          description: string | null
          first_seen: string
          id: string
          indicator: string
          indicator_type: string
          last_seen: string
          metadata: Json | null
          severity: Database["public"]["Enums"]["alert_severity"]
          source: string
          threat_type: Database["public"]["Enums"]["threat_type"]
        }
        Insert: {
          active?: boolean | null
          confidence_score?: number | null
          description?: string | null
          first_seen?: string
          id?: string
          indicator: string
          indicator_type: string
          last_seen?: string
          metadata?: Json | null
          severity: Database["public"]["Enums"]["alert_severity"]
          source: string
          threat_type: Database["public"]["Enums"]["threat_type"]
        }
        Update: {
          active?: boolean | null
          confidence_score?: number | null
          description?: string | null
          first_seen?: string
          id?: string
          indicator?: string
          indicator_type?: string
          last_seen?: string
          metadata?: Json | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          source?: string
          threat_type?: Database["public"]["Enums"]["threat_type"]
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          department: string | null
          full_name: string | null
          id: string
          last_login: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_severity: "low" | "medium" | "high" | "critical"
      alert_status: "active" | "investigating" | "resolved" | "false_positive"
      device_status: "protected" | "alert" | "warning" | "offline"
      threat_type:
        | "malware"
        | "phishing"
        | "suspicious_ip"
        | "data_exfiltration"
        | "privilege_escalation"
        | "lateral_movement"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_severity: ["low", "medium", "high", "critical"],
      alert_status: ["active", "investigating", "resolved", "false_positive"],
      device_status: ["protected", "alert", "warning", "offline"],
      threat_type: [
        "malware",
        "phishing",
        "suspicious_ip",
        "data_exfiltration",
        "privilege_escalation",
        "lateral_movement",
      ],
    },
  },
} as const
