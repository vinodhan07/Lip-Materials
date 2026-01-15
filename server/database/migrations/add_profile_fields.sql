-- Migration to add profile fields to users table
-- This adds columns if they don't exist (SQLite doesn't have IF NOT EXISTS for columns)

-- Add city column
ALTER TABLE users ADD COLUMN city TEXT;

-- Add state column  
ALTER TABLE users ADD COLUMN state TEXT;

-- Add country column
ALTER TABLE users ADD COLUMN country TEXT;

-- Add pincode column
ALTER TABLE users ADD COLUMN pincode TEXT;

-- Add photo_url column
ALTER TABLE users ADD COLUMN photo_url TEXT;
