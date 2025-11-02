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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      assignment_rate_settings: {
        Row: {
          base_rate: number
          dynamic_edu_percentage: number
          id: string
          is_active: boolean
          solver_percentage: number
          subject: string
          updated_at: string
          urgent_fee_high: number
          urgent_fee_normal: number
        }
        Insert: {
          base_rate?: number
          dynamic_edu_percentage?: number
          id?: string
          is_active?: boolean
          solver_percentage?: number
          subject: string
          updated_at?: string
          urgent_fee_high?: number
          urgent_fee_normal?: number
        }
        Update: {
          base_rate?: number
          dynamic_edu_percentage?: number
          id?: string
          is_active?: boolean
          solver_percentage?: number
          subject?: string
          updated_at?: string
          urgent_fee_high?: number
          urgent_fee_normal?: number
        }
        Relationships: []
      }
      assignment_solutions: {
        Row: {
          admin_notes: string | null
          assignment_id: string
          created_at: string
          id: string
          solution_files: Json | null
          solution_text: string | null
          solver_contact: string
          solver_id: string | null
          solver_name: string
          status: Database["public"]["Enums"]["solution_status"]
          submitted_at: string
        }
        Insert: {
          admin_notes?: string | null
          assignment_id: string
          created_at?: string
          id?: string
          solution_files?: Json | null
          solution_text?: string | null
          solver_contact: string
          solver_id?: string | null
          solver_name: string
          status?: Database["public"]["Enums"]["solution_status"]
          submitted_at?: string
        }
        Update: {
          admin_notes?: string | null
          assignment_id?: string
          created_at?: string
          id?: string
          solution_files?: Json | null
          solution_text?: string | null
          solver_contact?: string
          solver_id?: string | null
          solver_name?: string
          status?: Database["public"]["Enums"]["solution_status"]
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_solutions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_solvers: {
        Row: {
          class_levels: Json
          contact: string
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          is_verified: boolean
          name: string
          rating: number | null
          subjects: Json
          total_earned: number
          total_solved: number
        }
        Insert: {
          class_levels?: Json
          contact: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          name: string
          rating?: number | null
          subjects?: Json
          total_earned?: number
          total_solved?: number
        }
        Update: {
          class_levels?: Json
          contact?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          name?: string
          rating?: number | null
          subjects?: Json
          total_earned?: number
          total_solved?: number
        }
        Relationships: []
      }
      assignment_transactions: {
        Row: {
          assignment_id: string
          created_at: string
          dynamic_edu_amount: number
          id: string
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          released_at: string | null
          solver_amount: number
          solver_name: string | null
          status: Database["public"]["Enums"]["payment_status"]
          student_name: string
          total_amount: number
        }
        Insert: {
          assignment_id: string
          created_at?: string
          dynamic_edu_amount: number
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          released_at?: string | null
          solver_amount: number
          solver_name?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          student_name: string
          total_amount: number
        }
        Update: {
          assignment_id?: string
          created_at?: string
          dynamic_edu_amount?: number
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          released_at?: string | null
          solver_amount?: number
          solver_name?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          student_name?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "assignment_transactions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          approved_at: string | null
          assignment_files: Json | null
          assignment_text: string | null
          assignment_type: string
          base_fee: number
          class_level: string
          created_at: string
          deadline: string | null
          dynamic_edu_fee: number
          id: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          solver_id: string | null
          solver_name: string | null
          solver_payment: number
          status: Database["public"]["Enums"]["assignment_status"]
          student_contact: string
          student_name: string
          subject: string
          submitted_at: string | null
          total_fee: number
          updated_at: string
          urgency: string
          urgent_fee: number
        }
        Insert: {
          approved_at?: string | null
          assignment_files?: Json | null
          assignment_text?: string | null
          assignment_type: string
          base_fee?: number
          class_level: string
          created_at?: string
          deadline?: string | null
          dynamic_edu_fee?: number
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          solver_id?: string | null
          solver_name?: string | null
          solver_payment?: number
          status?: Database["public"]["Enums"]["assignment_status"]
          student_contact: string
          student_name: string
          subject: string
          submitted_at?: string | null
          total_fee: number
          updated_at?: string
          urgency?: string
          urgent_fee?: number
        }
        Update: {
          approved_at?: string | null
          assignment_files?: Json | null
          assignment_text?: string | null
          assignment_type?: string
          base_fee?: number
          class_level?: string
          created_at?: string
          deadline?: string | null
          dynamic_edu_fee?: number
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          solver_id?: string | null
          solver_name?: string | null
          solver_payment?: number
          status?: Database["public"]["Enums"]["assignment_status"]
          student_contact?: string
          student_name?: string
          subject?: string
          submitted_at?: string | null
          total_fee?: number
          updated_at?: string
          urgency?: string
          urgent_fee?: number
        }
        Relationships: []
      }
      data: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      external_links: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          comments: string | null
          email: string
          id: string
          name: string
          rating: number
          service: string | null
          timestamp: string
        }
        Insert: {
          comments?: string | null
          email: string
          id?: string
          name: string
          rating: number
          service?: string | null
          timestamp?: string
        }
        Update: {
          comments?: string | null
          email?: string
          id?: string
          name?: string
          rating?: number
          service?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      note_categories: {
        Row: {
          class_level: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          subjects: Json
        }
        Insert: {
          class_level: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          subjects?: Json
        }
        Update: {
          class_level?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          subjects?: Json
        }
        Relationships: []
      }
      note_requests: {
        Row: {
          additional_details: string | null
          class_level: string
          contact: string | null
          created_at: string
          id: string
          status: Database["public"]["Enums"]["request_status"]
          student_name: string
          subject: string
          topic: string
          updated_at: string
        }
        Insert: {
          additional_details?: string | null
          class_level: string
          contact?: string | null
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["request_status"]
          student_name: string
          subject: string
          topic: string
          updated_at?: string
        }
        Update: {
          additional_details?: string | null
          class_level?: string
          contact?: string | null
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["request_status"]
          student_name?: string
          subject?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          class_level: string
          created_at: string
          description: string | null
          download_count: number
          file_size: number
          file_type: string
          file_url: string
          id: string
          is_approved: boolean
          status: Database["public"]["Enums"]["note_status"]
          subject: string
          title: string
          updated_at: string
          upload_date: string
          uploader_contact: string | null
          uploader_name: string
          view_count: number
        }
        Insert: {
          class_level: string
          created_at?: string
          description?: string | null
          download_count?: number
          file_size: number
          file_type: string
          file_url: string
          id?: string
          is_approved?: boolean
          status?: Database["public"]["Enums"]["note_status"]
          subject: string
          title: string
          updated_at?: string
          upload_date?: string
          uploader_contact?: string | null
          uploader_name: string
          view_count?: number
        }
        Update: {
          class_level?: string
          created_at?: string
          description?: string | null
          download_count?: number
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          is_approved?: boolean
          status?: Database["public"]["Enums"]["note_status"]
          subject?: string
          title?: string
          updated_at?: string
          upload_date?: string
          uploader_contact?: string | null
          uploader_name?: string
          view_count?: number
        }
        Relationships: []
      }
      print_jobs: {
        Row: {
          delivery_requested: boolean | null
          email_notifications: boolean | null
          estimated_completion: string | null
          files: Json
          id: string
          institute: string | null
          name: string
          notes: string | null
          phone: string
          selected_services: Json | null
          sms_notifications: boolean | null
          status: string
          time_slot: string
          timestamp: string
          total_amount: number | null
          tracking_id: string
        }
        Insert: {
          delivery_requested?: boolean | null
          email_notifications?: boolean | null
          estimated_completion?: string | null
          files: Json
          id?: string
          institute?: string | null
          name: string
          notes?: string | null
          phone: string
          selected_services?: Json | null
          sms_notifications?: boolean | null
          status?: string
          time_slot: string
          timestamp?: string
          total_amount?: number | null
          tracking_id: string
        }
        Update: {
          delivery_requested?: boolean | null
          email_notifications?: boolean | null
          estimated_completion?: string | null
          files?: Json
          id?: string
          institute?: string | null
          name?: string
          notes?: string | null
          phone?: string
          selected_services?: Json | null
          sms_notifications?: boolean | null
          status?: string
          time_slot?: string
          timestamp?: string
          total_amount?: number | null
          tracking_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          price: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: string
        }
        Relationships: []
      }
      status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          notes: string | null
          print_job_id: string
          status: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          notes?: string | null
          print_job_id: string
          status: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          notes?: string | null
          print_job_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_history_print_job_id_fkey"
            columns: ["print_job_id"]
            isOneToOne: false
            referencedRelation: "print_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      assignment_status:
        | "pending"
        | "assigned"
        | "in_progress"
        | "submitted"
        | "approved"
        | "rejected"
        | "completed"
      note_status: "pending" | "approved" | "rejected"
      payment_status: "pending" | "paid" | "released" | "refunded"
      request_status: "pending" | "fulfilled" | "rejected"
      solution_status: "pending" | "approved" | "rejected" | "revision_needed"
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
      assignment_status: [
        "pending",
        "assigned",
        "in_progress",
        "submitted",
        "approved",
        "rejected",
        "completed",
      ],
      note_status: ["pending", "approved", "rejected"],
      payment_status: ["pending", "paid", "released", "refunded"],
      request_status: ["pending", "fulfilled", "rejected"],
      solution_status: ["pending", "approved", "rejected", "revision_needed"],
    },
  },
} as const
