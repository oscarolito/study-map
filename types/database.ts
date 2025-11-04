export interface User {
  id: string;
  email: string;
  firebase_uid: string;
  plan: 'free' | 'premium';
  programs_viewed: number;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at?: string;
  updated_at?: string;
}

export interface UserInsert {
  email: string;
  firebase_uid: string;
  plan: 'free' | 'premium';
  programs_viewed: number;
  payment_status: 'pending' | 'completed' | 'failed';
}

export interface ProgramView {
  id: string;
  user_id: string;
  program_id: string;
  viewed_at: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  stripe_session_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}