export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthComponentProps {
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}