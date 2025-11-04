-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  programs_viewed INTEGER DEFAULT 0,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create program_views table
CREATE TABLE IF NOT EXISTS program_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  program_id VARCHAR(255) NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_program_views_user_id ON program_views(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_stripe_session_id ON payment_transactions(stripe_session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and update their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (firebase_uid = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (firebase_uid = auth.jwt() ->> 'sub');

-- Program views policies
CREATE POLICY "Users can view own program views" ON program_views
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own program views" ON program_views
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.jwt() ->> 'sub'));

-- Payment transactions policies
CREATE POLICY "Users can view own transactions" ON payment_transactions
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own transactions" ON payment_transactions
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.jwt() ->> 'sub'));