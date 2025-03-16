export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          theme: string | null;
          created_at: string;
          updated_at: string;
          has_free_plan: boolean;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          theme?: string | null;
          created_at?: string;
          updated_at?: string;
          has_free_plan?: boolean;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          theme?: string | null;
          created_at?: string;
          updated_at?: string;
          has_free_plan?: boolean;
        };
      };
      links: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          url: string;
          icon: string | null;
          display_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
          click_count: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          url: string;
          icon?: string | null;
          display_order: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
          click_count?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          url?: string;
          icon?: string | null;
          display_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
          click_count?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
