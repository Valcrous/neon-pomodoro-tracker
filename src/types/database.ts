
export interface AppUser {
  username: string;
  recovery_code: string;
  created_at?: string;
  public_code?: string;
  private_code?: string;
}

export interface Report {
  id: string;
  username: string;
  date: string;
  courseName: string;
  startTime: string;
  endTime: string;
  description: string;
  created_at?: string;
}

// Schema types for Supabase tables
export interface Database {
  public: {
    Tables: {
      app_users: {
        Row: AppUser;
        Insert: Omit<AppUser, 'created_at'>;
        Update: Partial<Omit<AppUser, 'created_at'>>;
      };
      reports: {
        Row: Report;
        Insert: Omit<Report, 'created_at' | 'id'> & { id?: string };
        Update: Partial<Omit<Report, 'created_at'>>;
      };
    };
  };
}
