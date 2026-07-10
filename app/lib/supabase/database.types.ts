export type UserRole = "worker" | "employer";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          email: string | null;
          first_name: string | null;
          last_name: string | null;
          company_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: UserRole;
          email?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          company_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          email?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          company_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      worker_onboarding: {
        Row: {
          user_id: string;
          completed_steps: string[];
          dismissed: boolean;
          personal: Json | null;
          location_skills: Json | null;
          payment: Json | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          completed_steps?: string[];
          dismissed?: boolean;
          personal?: Json | null;
          location_skills?: Json | null;
          payment?: Json | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          completed_steps?: string[];
          dismissed?: boolean;
          personal?: Json | null;
          location_skills?: Json | null;
          payment?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      employer_onboarding: {
        Row: {
          user_id: string;
          completed_steps: string[];
          dismissed: boolean;
          identity: Json | null;
          business_certificate: Json | null;
          business_details: Json | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          completed_steps?: string[];
          dismissed?: boolean;
          identity?: Json | null;
          business_certificate?: Json | null;
          business_details?: Json | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          completed_steps?: string[];
          dismissed?: boolean;
          identity?: Json | null;
          business_certificate?: Json | null;
          business_details?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
