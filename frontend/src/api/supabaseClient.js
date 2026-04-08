import { createClient } from '@supabase/supabase-js';

// Vite uses import.meta.env to read the .env file securely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create and export the database connection
export const supabase = createClient(supabaseUrl, supabaseKey);