-- Create program_views table for tracking user interactions
CREATE TABLE program_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  program_id VARCHAR(255) NOT NULL,
  school_name VARCHAR(255) NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_program_views_user_id ON program_views(user_id);
CREATE INDEX idx_program_views_viewed_at ON program_views(viewed_at);
CREATE INDEX idx_program_views_program_id ON program_views(program_id);