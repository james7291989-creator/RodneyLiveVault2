import { createClient } from '@supabase/supabase-js';

// APEX OVERRIDE: Bypassing corrupted environment variables
const supabaseUrl = 'https://zmfhqojlvjyldarnmdcu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZmhxb2psdmp5bGRhcm5tZGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MjkzODYsImV4cCI6MjA4OTIwNTM4Nn0.PLf6-zTFo9_8qy8HM6VH3frFtvflDAi7dC6pV67cLwU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
