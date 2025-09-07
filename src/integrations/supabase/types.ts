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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      game_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          game_data: Json | null
          game_type: string
          id: string
          status: string | null
          user1_id: string
          user2_id: string
          winner_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          game_data?: Json | null
          game_type: string
          id?: string
          status?: string | null
          user1_id: string
          user2_id: string
          winner_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          game_data?: Json | null
          game_type?: string
          id?: string
          status?: string | null
          user1_id?: string
          user2_id?: string
          winner_id?: string | null
        }
        Relationships: []
      }
      gift_plans: {
        Row: {
          budget_range: string | null
          created_at: string
          description: string | null
          id: string
          occasion: string | null
          partner_id: string | null
          status: string | null
          target_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_range?: string | null
          created_at?: string
          description?: string | null
          id?: string
          occasion?: string | null
          partner_id?: string | null
          status?: string | null
          target_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_range?: string | null
          created_at?: string
          description?: string | null
          id?: string
          occasion?: string | null
          partner_id?: string | null
          status?: string | null
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      love_messages: {
        Row: {
          created_at: string
          id: string
          is_ai_generated: boolean | null
          is_read: boolean | null
          message_text: string
          message_type: string | null
          recipient_id: string | null
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_ai_generated?: boolean | null
          is_read?: boolean | null
          message_text: string
          message_type?: string | null
          recipient_id?: string | null
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_ai_generated?: boolean | null
          is_read?: boolean | null
          message_text?: string
          message_type?: string | null
          recipient_id?: string | null
          sender_id?: string
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          created_at: string
          id: string
          mood_label: string
          mood_type: string
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood_label: string
          mood_type: string
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mood_label?: string
          mood_type?: string
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      partnerships: {
        Row: {
          created_at: string
          id: string
          status: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          partner_id: string | null
          settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          partner_id?: string | null
          settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          partner_id?: string | null
          settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      special_dates: {
        Row: {
          created_at: string
          date_value: string | null
          days_notice: number | null
          id: string
          is_active: boolean | null
          name: string
          partner_id: string | null
          recurrence_day: number | null
          recurrence_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_value?: string | null
          days_notice?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          partner_id?: string | null
          recurrence_day?: number | null
          recurrence_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_value?: string | null
          days_notice?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          partner_id?: string | null
          recurrence_day?: number | null
          recurrence_type?: string | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
