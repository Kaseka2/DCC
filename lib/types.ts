export type Role = "admin" | "pastor" | "treasurer" | "secretary" | "member";

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
      attendance: {
        Row: {
          created_at: string;
          event_id: string;
          id: string;
          member_id: string;
          status: "present" | "absent";
        };
        Insert: {
          created_at?: string;
          event_id: string;
          id?: string;
          member_id: string;
          status: "present" | "absent";
        };
        Update: Partial<Database["public"]["Tables"]["attendance"]["Insert"]>;
      };
      donations: {
        Row: {
          amount: number;
          created_at: string;
          date: string;
          id: string;
          member_id: string;
          payment_method: string;
          type: "tithe" | "offering" | "pledge";
        };
        Insert: {
          amount: number;
          created_at?: string;
          date: string;
          id?: string;
          member_id: string;
          payment_method: string;
          type: "tithe" | "offering" | "pledge";
        };
        Update: Partial<Database["public"]["Tables"]["donations"]["Insert"]>;
      };
      events: {
        Row: {
          created_at: string;
          description: string | null;
          event_date: string;
          id: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          event_date: string;
          id?: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };
      members: {
        Row: {
          address: string | null;
          baptism_status: string | null;
          created_at: string;
          email: string | null;
          full_name: string;
          gender: string | null;
          id: string;
          ministry_id: string | null;
          phone: string | null;
          user_id: string | null;
        };
        Insert: {
          address?: string | null;
          baptism_status?: string | null;
          created_at?: string;
          email?: string | null;
          full_name: string;
          gender?: string | null;
          id?: string;
          ministry_id?: string | null;
          phone?: string | null;
          user_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["members"]["Insert"]>;
      };
      ministries: {
        Row: {
          created_at: string;
          id: string;
          leader_id: string | null;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          leader_id?: string | null;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["ministries"]["Insert"]>;
      };
      prayer_requests: {
        Row: {
          created_at: string;
          id: string;
          member_id: string;
          message: string;
          status: "new" | "praying" | "closed";
        };
        Insert: {
          created_at?: string;
          id?: string;
          member_id: string;
          message: string;
          status?: "new" | "praying" | "closed";
        };
        Update: Partial<Database["public"]["Tables"]["prayer_requests"]["Insert"]>;
      };
      sermons: {
        Row: {
          created_at: string;
          date: string;
          id: string;
          media_url: string | null;
          preacher: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          date: string;
          id?: string;
          media_url?: string | null;
          preacher: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["sermons"]["Insert"]>;
      };
      users: {
        Row: {
          created_at: string;
          id: string;
          role: Role;
        };
        Insert: {
          created_at?: string;
          id: string;
          role?: Role;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
    };
  };
}

export type Member = Database["public"]["Tables"]["members"]["Row"];
export type Donation = Database["public"]["Tables"]["donations"]["Row"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type Sermon = Database["public"]["Tables"]["sermons"]["Row"];
export type Attendance = Database["public"]["Tables"]["attendance"]["Row"];
export type Ministry = Database["public"]["Tables"]["ministries"]["Row"];
export type PrayerRequest = Database["public"]["Tables"]["prayer_requests"]["Row"];
