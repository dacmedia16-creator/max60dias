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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      acao_rua: {
        Row: {
          blocos: number
          cartoes: number
          dia: number
          flyers: number
          id: string
          sms: number
          updated_at: string
          user_id: string
        }
        Insert: {
          blocos?: number
          cartoes?: number
          dia: number
          flyers?: number
          id?: string
          sms?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          blocos?: number
          cartoes?: number
          dia?: number
          flyers?: number
          id?: string
          sms?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "acao_rua_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cartilha_secoes: {
        Row: {
          conteudo: string
          id: number
          ordem: number
          titulo: string
        }
        Insert: {
          conteudo: string
          id?: number
          ordem?: number
          titulo: string
        }
        Update: {
          conteudo?: string
          id?: number
          ordem?: number
          titulo?: string
        }
        Relationships: []
      }
      contatos: {
        Row: {
          created_at: string
          id: string
          nome: string
          observacoes: string | null
          proximo_retorno: string | null
          status: string
          telefone: string | null
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          observacoes?: string | null
          proximo_retorno?: string | null
          status?: string
          telefone?: string | null
          tipo?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          observacoes?: string | null
          proximo_retorno?: string | null
          status?: string
          telefone?: string | null
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contatos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_reports: {
        Row: {
          auto_avaliacao: number | null
          capitulo_lido: boolean
          created_at: string
          data: string
          dia: number
          id: string
          notas: string | null
          pct_concluido: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_avaliacao?: number | null
          capitulo_lido?: boolean
          created_at?: string
          data?: string
          dia: number
          id?: string
          notas?: string | null
          pct_concluido?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_avaliacao?: number | null
          capitulo_lido?: boolean
          created_at?: string
          data?: string
          dia?: number
          id?: string
          notas?: string | null
          pct_concluido?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      metas_semana: {
        Row: {
          id: string
          objetivo: string | null
          reflexao: string | null
          resultado: string | null
          semana: number
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          objetivo?: string | null
          reflexao?: string | null
          resultado?: string | null
          semana: number
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          objetivo?: string | null
          reflexao?: string | null
          resultado?: string | null
          semana?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "metas_semana_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_days: {
        Row: {
          capitulo: string | null
          dia: number
          mes: number
          semana: number
          semana_frase: string | null
          semana_titulo: string
          video_url: string | null
        }
        Insert: {
          capitulo?: string | null
          dia: number
          mes: number
          semana: number
          semana_frase?: string | null
          semana_titulo: string
          video_url?: string | null
        }
        Update: {
          capitulo?: string | null
          dia?: number
          mes?: number
          semana?: number
          semana_frase?: string | null
          semana_titulo?: string
          video_url?: string | null
        }
        Relationships: []
      }
      plan_tasks: {
        Row: {
          descricao: string
          dia: number
          id: number
          ordem: number
        }
        Insert: {
          descricao: string
          dia: number
          id?: number
          ordem: number
        }
        Update: {
          descricao?: string
          dia?: number
          id?: number
          ordem?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_tasks_dia_fkey"
            columns: ["dia"]
            isOneToOne: false
            referencedRelation: "plan_days"
            referencedColumns: ["dia"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          data_inicio: string | null
          email: string
          id: string
          nome: string
          onboarding_ok: boolean
        }
        Insert: {
          created_at?: string
          data_inicio?: string | null
          email?: string
          id: string
          nome?: string
          onboarding_ok?: boolean
        }
        Update: {
          created_at?: string
          data_inicio?: string | null
          email?: string
          id?: string
          nome?: string
          onboarding_ok?: boolean
        }
        Relationships: []
      }
      scripts_corretor: {
        Row: {
          categoria: string
          conteudo: string
          created_at: string
          id: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          categoria?: string
          conteudo: string
          created_at?: string
          id?: string
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          categoria?: string
          conteudo?: string
          created_at?: string
          id?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scripts_corretor_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scripts_modelo: {
        Row: {
          categoria: string
          conteudo: string
          id: number
          ordem: number
          titulo: string
        }
        Insert: {
          categoria: string
          conteudo: string
          id?: number
          ordem?: number
          titulo: string
        }
        Update: {
          categoria?: string
          conteudo?: string
          id?: number
          ordem?: number
          titulo?: string
        }
        Relationships: []
      }
      task_guides: {
        Row: {
          guia: string
          id: number
          ordem: number
          padrao: string
          rotulo: string
        }
        Insert: {
          guia: string
          id?: number
          ordem?: number
          padrao: string
          rotulo: string
        }
        Update: {
          guia?: string
          id?: number
          ordem?: number
          padrao?: string
          rotulo?: string
        }
        Relationships: []
      }
      task_progress: {
        Row: {
          concluida: boolean
          id: string
          task_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          concluida?: boolean
          id?: string
          task_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          concluida?: boolean
          id?: string
          task_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_progress_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "plan_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "corretor" | "gestor"
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
      app_role: ["corretor", "gestor"],
    },
  },
} as const
