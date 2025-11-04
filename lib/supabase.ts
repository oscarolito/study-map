// Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import type { User, ProgramView, PaymentTransaction } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create Supabase client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create Supabase client for server-side operations with service role key
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : supabase;

// Database interface for type safety
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      program_views: {
        Row: ProgramView;
        Insert: Omit<ProgramView, 'id' | 'viewed_at'>;
        Update: Partial<Omit<ProgramView, 'id' | 'viewed_at'>>;
      };
      payment_transactions: {
        Row: PaymentTransaction;
        Insert: Omit<PaymentTransaction, 'id' | 'created_at'>;
        Update: Partial<Omit<PaymentTransaction, 'id' | 'created_at'>>;
      };
    };
  };
}