-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  partner_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create partnerships table to link couples
CREATE TABLE public.partnerships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Create mood entries table
CREATE TABLE public.mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mood_type TEXT NOT NULL,
  mood_label TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create special dates table
CREATE TABLE public.special_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  partner_id UUID,
  name TEXT NOT NULL,
  date_value DATE,
  recurrence_type TEXT, -- 'none', 'monthly', 'yearly', 'weekly'
  recurrence_day INTEGER, -- day of month/week for recurring dates
  days_notice INTEGER DEFAULT 7,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gift plans table
CREATE TABLE public.gift_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  partner_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  occasion TEXT,
  budget_range TEXT,
  status TEXT DEFAULT 'planned', -- 'planned', 'purchased', 'given'
  target_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create love messages table
CREATE TABLE public.love_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID,
  message_text TEXT NOT NULL,
  message_type TEXT DEFAULT 'sweet', -- 'sweet', 'consolation', 'surprise'
  is_ai_generated BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create game sessions table
CREATE TABLE public.game_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  game_type TEXT NOT NULL,
  game_data JSONB,
  status TEXT DEFAULT 'active', -- 'active', 'completed'
  winner_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.love_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile and their partner's profile" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() = partner_id OR
  user_id IN (
    SELECT user2_id FROM partnerships WHERE user1_id = auth.uid() AND status = 'accepted'
    UNION
    SELECT user1_id FROM partnerships WHERE user2_id = auth.uid() AND status = 'accepted'
  )
);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for partnerships
CREATE POLICY "Users can view their partnerships" 
ON public.partnerships 
FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create partnerships" 
ON public.partnerships 
FOR INSERT 
WITH CHECK (auth.uid() = user1_id);

CREATE POLICY "Users can update their partnerships" 
ON public.partnerships 
FOR UPDATE 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create RLS policies for mood entries
CREATE POLICY "Users can view their own and partner's mood entries" 
ON public.mood_entries 
FOR SELECT 
USING (
  auth.uid() = user_id OR
  user_id IN (
    SELECT user2_id FROM partnerships WHERE user1_id = auth.uid() AND status = 'accepted'
    UNION
    SELECT user1_id FROM partnerships WHERE user2_id = auth.uid() AND status = 'accepted'
  )
);

CREATE POLICY "Users can create their own mood entries" 
ON public.mood_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for special dates
CREATE POLICY "Users can view their own and shared special dates" 
ON public.special_dates 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() = partner_id
);

CREATE POLICY "Users can create their own special dates" 
ON public.special_dates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own special dates" 
ON public.special_dates 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for gift plans
CREATE POLICY "Users can view their own and partner's gift plans" 
ON public.gift_plans 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() = partner_id
);

CREATE POLICY "Users can create gift plans" 
ON public.gift_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gift plans" 
ON public.gift_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for love messages
CREATE POLICY "Users can view messages they sent or received" 
ON public.love_messages 
FOR SELECT 
USING (
  auth.uid() = sender_id OR 
  auth.uid() = recipient_id
);

CREATE POLICY "Users can send messages" 
ON public.love_messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update message read status" 
ON public.love_messages 
FOR UPDATE 
USING (auth.uid() = recipient_id);

-- Create RLS policies for game sessions
CREATE POLICY "Users can view their game sessions" 
ON public.game_sessions 
FOR SELECT 
USING (
  auth.uid() = user1_id OR 
  auth.uid() = user2_id
);

CREATE POLICY "Users can create game sessions" 
ON public.game_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their game sessions" 
ON public.game_sessions 
FOR UPDATE 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_special_dates_updated_at
  BEFORE UPDATE ON public.special_dates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gift_plans_updated_at
  BEFORE UPDATE ON public.gift_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();