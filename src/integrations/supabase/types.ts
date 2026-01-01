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
      activity_log: {
        Row: {
          activity_type: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          user_email: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          user_email?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          user_email?: string | null
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          reference_id: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          reference_id?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          reference_id?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
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
          payment_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          payment_verified: boolean | null
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
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          payment_verified?: boolean | null
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
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          payment_verified?: boolean | null
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
      coin_packages: {
        Row: {
          bonus_coins: number
          coins: number
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          is_popular: boolean
          name: string
          price_inr: number
        }
        Insert: {
          bonus_coins?: number
          coins: number
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_popular?: boolean
          name: string
          price_inr: number
        }
        Update: {
          bonus_coins?: number
          coins?: number
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_popular?: boolean
          name?: string
          price_inr?: number
        }
        Relationships: []
      }
      coin_recharge_requests: {
        Row: {
          amount_paid: number
          bonus_coins: number
          coins_requested: number
          created_at: string
          id: string
          package_id: string
          payment_proof_url: string | null
          rejection_reason: string | null
          status: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount_paid: number
          bonus_coins?: number
          coins_requested: number
          created_at?: string
          id?: string
          package_id: string
          payment_proof_url?: string | null
          rejection_reason?: string | null
          status?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount_paid?: number
          bonus_coins?: number
          coins_requested?: number
          created_at?: string
          id?: string
          package_id?: string
          payment_proof_url?: string | null
          rejection_reason?: string | null
          status?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coin_recharge_requests_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "coin_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coin_recharge_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_settings: {
        Row: {
          id: string
          is_recharge_enabled: boolean
          min_recharge_amount: number
          qr_code_url: string | null
          referral_bonus: number
          updated_at: string
          upi_id: string
          welcome_bonus: number
          whatsapp_number: string
        }
        Insert: {
          id?: string
          is_recharge_enabled?: boolean
          min_recharge_amount?: number
          qr_code_url?: string | null
          referral_bonus?: number
          updated_at?: string
          upi_id?: string
          welcome_bonus?: number
          whatsapp_number?: string
        }
        Update: {
          id?: string
          is_recharge_enabled?: boolean
          min_recharge_amount?: number
          qr_code_url?: string | null
          referral_bonus?: number
          updated_at?: string
          upi_id?: string
          welcome_bonus?: number
          whatsapp_number?: string
        }
        Relationships: []
      }
      coin_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string
          id: string
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description: string
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      legal_pages: {
        Row: {
          content: string
          id: string
          slug: string
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content: string
          id?: string
          slug: string
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string | null
          updated_by?: string | null
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
      payment_settings: {
        Row: {
          created_at: string
          enable_manual_payments: boolean
          id: string
          payment_instructions: string | null
          qr_code_url: string | null
          updated_at: string
          upi_id: string
          whatsapp_number: string
        }
        Insert: {
          created_at?: string
          enable_manual_payments?: boolean
          id?: string
          payment_instructions?: string | null
          qr_code_url?: string | null
          updated_at?: string
          upi_id?: string
          whatsapp_number?: string
        }
        Update: {
          created_at?: string
          enable_manual_payments?: boolean
          id?: string
          payment_instructions?: string | null
          qr_code_url?: string | null
          updated_at?: string
          upi_id?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      pending_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_proof_url: string | null
          reference_id: string
          rejection_reason: string | null
          service_type: string
          status: string
          tracking_id: string | null
          user_email: string
          user_name: string
          verified_at: string | null
          verified_by: string | null
          whatsapp_message_sent: boolean | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payment_proof_url?: string | null
          reference_id: string
          rejection_reason?: string | null
          service_type: string
          status?: string
          tracking_id?: string | null
          user_email: string
          user_name: string
          verified_at?: string | null
          verified_by?: string | null
          whatsapp_message_sent?: boolean | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_proof_url?: string | null
          reference_id?: string
          rejection_reason?: string | null
          service_type?: string
          status?: string
          tracking_id?: string | null
          user_email?: string
          user_name?: string
          verified_at?: string | null
          verified_by?: string | null
          whatsapp_message_sent?: boolean | null
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          currency: string
          id: string
          logo_url: string | null
          platform_name: string
          primary_color: string | null
          secondary_color: string | null
          support_hours: string | null
          support_whatsapp: string | null
          tagline: string
          updated_at: string
          welcome_message: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string
          id?: string
          logo_url?: string | null
          platform_name?: string
          primary_color?: string | null
          secondary_color?: string | null
          support_hours?: string | null
          support_whatsapp?: string | null
          tagline?: string
          updated_at?: string
          welcome_message?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string
          id?: string
          logo_url?: string | null
          platform_name?: string
          primary_color?: string | null
          secondary_color?: string | null
          support_hours?: string | null
          support_whatsapp?: string | null
          tagline?: string
          updated_at?: string
          welcome_message?: string | null
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
          payment_reference: string | null
          payment_verified: boolean | null
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
          payment_reference?: string | null
          payment_verified?: boolean | null
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
          payment_reference?: string | null
          payment_verified?: boolean | null
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
      resume_profiles: {
        Row: {
          created_at: string
          customization: Json
          id: string
          resume_data: Json
          template_id: string
          updated_at: string
          user_email: string
        }
        Insert: {
          created_at?: string
          customization?: Json
          id?: string
          resume_data?: Json
          template_id: string
          updated_at?: string
          user_email: string
        }
        Update: {
          created_at?: string
          customization?: Json
          id?: string
          resume_data?: Json
          template_id?: string
          updated_at?: string
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_profiles_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "resume_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_purchases: {
        Row: {
          amount_paid: number
          id: string
          payment_proof_url: string | null
          payment_reference: string | null
          payment_verified: boolean | null
          purchase_date: string
          template_id: string
          user_email: string
          verified_at: string | null
        }
        Insert: {
          amount_paid: number
          id?: string
          payment_proof_url?: string | null
          payment_reference?: string | null
          payment_verified?: boolean | null
          purchase_date?: string
          template_id: string
          user_email: string
          verified_at?: string | null
        }
        Update: {
          amount_paid?: number
          id?: string
          payment_proof_url?: string | null
          payment_reference?: string | null
          payment_verified?: boolean | null
          purchase_date?: string
          template_id?: string
          user_email?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_purchases_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "resume_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_templates: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          preview_image: string | null
          price: number
          status: Database["public"]["Enums"]["template_status"]
          template_data: Json
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name: string
          preview_image?: string | null
          price?: number
          status?: Database["public"]["Enums"]["template_status"]
          template_data?: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          preview_image?: string | null
          price?: number
          status?: Database["public"]["Enums"]["template_status"]
          template_data?: Json
          updated_at?: string
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
      user_profiles: {
        Row: {
          avatar_url: string | null
          coin_balance: number
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_suspended: boolean
          referral_code: string | null
          referred_by: string | null
          total_coins_earned: number
          total_coins_spent: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          coin_balance?: number
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_suspended?: boolean
          referral_code?: string | null
          referred_by?: string | null
          total_coins_earned?: number
          total_coins_spent?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          coin_balance?: number
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_suspended?: boolean
          referral_code?: string | null
          referred_by?: string | null
          total_coins_earned?: number
          total_coins_spent?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      template_status: "active" | "inactive" | "draft"
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
      app_role: ["admin", "moderator", "user"],
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
      template_status: ["active", "inactive", "draft"],
    },
  },
} as const
