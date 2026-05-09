-- Create scans table
CREATE TABLE public.scans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scanned_text TEXT NOT NULL,
    scam_score INTEGER NOT NULL,
    reasons JSONB NOT NULL,
    verdict VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own scans
CREATE POLICY "Users can insert their own scans"
ON public.scans FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own scans
CREATE POLICY "Users can view their own scans"
ON public.scans FOR SELECT
USING (auth.uid() = user_id);

-- Optional: Create an index for faster queries by user_id
CREATE INDEX idx_scans_user_id ON public.scans(user_id);
