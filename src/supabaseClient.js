import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('>>> FATAL ERROR: Supabase keys are missing from the .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
