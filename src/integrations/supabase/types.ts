export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      consent_forms: {
        Row: {
          account_holder_age: number | null
          account_holder_name: string | null
          address: string
          age: number | null
          allergies: string
          birth_date: string | null
          cell_phone: string
          chronic_conditions: Json | null
          consent_agreement: boolean
          created_at: string
          dependant_code: string | null
          doctor: string | null
          email: string
          emergency_name: string
          emergency_phone: string
          emergency_relationship: string
          employer_school: string | null
          encrypted: boolean
          gender: string
          gp_contact: string | null
          gp_name: string | null
          id: string
          id_number: string
          last_modified: string
          main_member: string | null
          marital_status: string | null
          medical_aid_name: string | null
          medical_aid_no: string | null
          medical_aid_plan: string | null
          medication: string
          occupation_grade: string | null
          patient_name: string
          payment_preference: string | null
          postal_code: string | null
          practice_number: string | null
          region_code: string
          region_label: string | null
          responsible_for_payment: string
          signature: string
          status: string
          submission_id: string | null
          submission_region: string | null
          synced: boolean
          synced_at: string | null
          timestamp: string
        }
        Insert: {
          account_holder_age?: number | null
          account_holder_name?: string | null
          address: string
          age?: number | null
          allergies: string
          birth_date?: string | null
          cell_phone: string
          chronic_conditions?: Json | null
          consent_agreement?: boolean
          created_at?: string
          dependant_code?: string | null
          doctor?: string | null
          email: string
          emergency_name: string
          emergency_phone: string
          emergency_relationship: string
          employer_school?: string | null
          encrypted?: boolean
          gender: string
          gp_contact?: string | null
          gp_name?: string | null
          id?: string
          id_number: string
          last_modified?: string
          main_member?: string | null
          marital_status?: string | null
          medical_aid_name?: string | null
          medical_aid_no?: string | null
          medical_aid_plan?: string | null
          medication: string
          occupation_grade?: string | null
          patient_name: string
          payment_preference?: string | null
          postal_code?: string | null
          practice_number?: string | null
          region_code: string
          region_label?: string | null
          responsible_for_payment: string
          signature: string
          status?: string
          submission_id?: string | null
          submission_region?: string | null
          synced?: boolean
          synced_at?: string | null
          timestamp?: string
        }
        Update: {
          account_holder_age?: number | null
          account_holder_name?: string | null
          address?: string
          age?: number | null
          allergies?: string
          birth_date?: string | null
          cell_phone?: string
          chronic_conditions?: Json | null
          consent_agreement?: boolean
          created_at?: string
          dependant_code?: string | null
          doctor?: string | null
          email?: string
          emergency_name?: string
          emergency_phone?: string
          emergency_relationship?: string
          employer_school?: string | null
          encrypted?: boolean
          gender?: string
          gp_contact?: string | null
          gp_name?: string | null
          id?: string
          id_number?: string
          last_modified?: string
          main_member?: string | null
          marital_status?: string | null
          medical_aid_name?: string | null
          medical_aid_no?: string | null
          medical_aid_plan?: string | null
          medication?: string
          occupation_grade?: string | null
          patient_name?: string
          payment_preference?: string | null
          postal_code?: string | null
          practice_number?: string | null
          region_code?: string
          region_label?: string | null
          responsible_for_payment?: string
          signature?: string
          status?: string
          submission_id?: string | null
          submission_region?: string | null
          synced?: boolean
          synced_at?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      form_drafts: {
        Row: {
          account_holder_age: number | null
          account_holder_name: string | null
          address: string | null
          age: number | null
          allergies: string | null
          birth_date: string | null
          cell_phone: string | null
          chronic_conditions: Json | null
          consent_agreement: boolean | null
          created_at: string
          dependant_code: string | null
          doctor: string | null
          email: string | null
          emergency_name: string | null
          emergency_phone: string | null
          emergency_relationship: string | null
          employer_school: string | null
          encrypted: boolean
          gender: string | null
          gp_contact: string | null
          gp_name: string | null
          id: string
          id_number: string | null
          last_modified: string
          main_member: string | null
          marital_status: string | null
          medical_aid_name: string | null
          medical_aid_no: string | null
          medical_aid_plan: string | null
          medication: string | null
          occupation_grade: string | null
          patient_name: string | null
          payment_preference: string | null
          postal_code: string | null
          practice_number: string | null
          region_code: string | null
          responsible_for_payment: string | null
          signature: string | null
          status: string
          timestamp: string
        }
        Insert: {
          account_holder_age?: number | null
          account_holder_name?: string | null
          address?: string | null
          age?: number | null
          allergies?: string | null
          birth_date?: string | null
          cell_phone?: string | null
          chronic_conditions?: Json | null
          consent_agreement?: boolean | null
          created_at?: string
          dependant_code?: string | null
          doctor?: string | null
          email?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          emergency_relationship?: string | null
          employer_school?: string | null
          encrypted?: boolean
          gender?: string | null
          gp_contact?: string | null
          gp_name?: string | null
          id?: string
          id_number?: string | null
          last_modified?: string
          main_member?: string | null
          marital_status?: string | null
          medical_aid_name?: string | null
          medical_aid_no?: string | null
          medical_aid_plan?: string | null
          medication?: string | null
          occupation_grade?: string | null
          patient_name?: string | null
          payment_preference?: string | null
          postal_code?: string | null
          practice_number?: string | null
          region_code?: string | null
          responsible_for_payment?: string | null
          signature?: string | null
          status?: string
          timestamp?: string
        }
        Update: {
          account_holder_age?: number | null
          account_holder_name?: string | null
          address?: string | null
          age?: number | null
          allergies?: string | null
          birth_date?: string | null
          cell_phone?: string | null
          chronic_conditions?: Json | null
          consent_agreement?: boolean | null
          created_at?: string
          dependant_code?: string | null
          doctor?: string | null
          email?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          emergency_relationship?: string | null
          employer_school?: string | null
          encrypted?: boolean
          gender?: string | null
          gp_contact?: string | null
          gp_name?: string | null
          id?: string
          id_number?: string | null
          last_modified?: string
          main_member?: string | null
          marital_status?: string | null
          medical_aid_name?: string | null
          medical_aid_no?: string | null
          medical_aid_plan?: string | null
          medication?: string | null
          occupation_grade?: string | null
          patient_name?: string | null
          payment_preference?: string | null
          postal_code?: string | null
          practice_number?: string | null
          region_code?: string | null
          responsible_for_payment?: string | null
          signature?: string | null
          status?: string
          timestamp?: string
        }
        Relationships: []
      }
      sync_queue: {
        Row: {
          created_at: string
          error_message: string | null
          form_data: Json
          id: string
          last_retry_at: string | null
          region_code: string
          retry_count: number
          status: string
          submission_endpoint: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          form_data: Json
          id?: string
          last_retry_at?: string | null
          region_code: string
          retry_count?: number
          status?: string
          submission_endpoint: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          form_data?: Json
          id?: string
          last_retry_at?: string | null
          region_code?: string
          retry_count?: number
          status?: string
          submission_endpoint?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      validate_consent_form: {
        Args: Record<PropertyKey, never> | { form_data: Json }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
