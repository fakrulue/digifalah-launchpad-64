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
      api_keys: {
        Row: {
          created_at: string
          id: string
          masked_value: string | null
          name: string
          notes: string | null
          service: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          masked_value?: string | null
          name: string
          notes?: string | null
          service: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          masked_value?: string | null
          name?: string
          notes?: string | null
          service?: string
          updated_at?: string
        }
        Relationships: []
      }
      backups: {
        Row: {
          backup_type: string
          created_at: string
          filename: string
          id: string
          notes: string | null
          size_bytes: number | null
          status: string
        }
        Insert: {
          backup_type?: string
          created_at?: string
          filename: string
          id?: string
          notes?: string | null
          size_bytes?: number | null
          status?: string
        }
        Update: {
          backup_type?: string
          created_at?: string
          filename?: string
          id?: string
          notes?: string | null
          size_bytes?: number | null
          status?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          approved: boolean
          content: string
          created_at: string
          email: string | null
          id: string
          name: string
          post_id: string
        }
        Insert: {
          approved?: boolean
          content: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          post_id: string
        }
        Update: {
          approved?: boolean
          content?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          ai_generated: boolean
          author_id: string | null
          category_id: string | null
          content: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at: string
        }
        Insert: {
          ai_generated?: boolean
          author_id?: string | null
          category_id?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at?: string
        }
        Update: {
          ai_generated?: boolean
          author_id?: string | null
          category_id?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          business_type: string | null
          created_at: string
          email: string | null
          id: string
          message: string | null
          name: string
          notes: string | null
          phone: string
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          business_type?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name: string
          notes?: string | null
          phone: string
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          business_type?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: []
      }
      media_files: {
        Row: {
          alt_text: string | null
          created_at: string
          filename: string
          folder: string | null
          height: number | null
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
          updated_at: string
          uploader_id: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          filename: string
          folder?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
          updated_at?: string
          uploader_id?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          filename?: string
          folder?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          updated_at?: string
          uploader_id?: string | null
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      page_blocks: {
        Row: {
          block_type: string
          content: Json
          created_at: string
          id: string
          is_visible: boolean
          page_slug: string
          position: number
          updated_at: string
        }
        Insert: {
          block_type: string
          content?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          page_slug: string
          position?: number
          updated_at?: string
        }
        Update: {
          block_type?: string
          content?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          page_slug?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_keywords: {
        Row: {
          created_at: string
          current_rank: number | null
          id: string
          keyword: string
          notes: string | null
          search_volume: number | null
          target_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_rank?: number | null
          id?: string
          keyword: string
          notes?: string | null
          search_volume?: number | null
          target_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_rank?: number | null
          id?: string
          keyword?: string
          notes?: string | null
          search_volume?: number | null
          target_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      seo_meta: {
        Row: {
          canonical_url: string | null
          created_at: string
          description: string | null
          id: string
          no_index: boolean
          og_image: string | null
          page_slug: string
          title: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          no_index?: boolean
          og_image?: string | null
          page_slug: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          no_index?: boolean
          og_image?: string | null
          page_slug?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          is_public: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          is_public?: boolean
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          id?: string
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
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
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "editor" | "viewer"
      lead_status: "new" | "contacted" | "qualified" | "converted" | "lost"
      post_status: "draft" | "published" | "archived"
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
      app_role: ["super_admin", "admin", "editor", "viewer"],
      lead_status: ["new", "contacted", "qualified", "converted", "lost"],
      post_status: ["draft", "published", "archived"],
    },
  },
} as const
