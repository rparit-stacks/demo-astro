-- Fix Database Schema - Remove password_hash columns
-- These are not needed since Supabase Auth handles authentication

-- Remove password_hash from users table
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;

-- Remove password_hash from astrologers table  
ALTER TABLE astrologers DROP COLUMN IF EXISTS password_hash;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'astrologers' 
AND table_schema = 'public'
ORDER BY ordinal_position;