import { createClient } from '@supabase/supabase-js';

// HARD-WIRED MASTER KEYS
const supabaseUrl = 'https://zmfhqojlvjyldarnmdcu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZmhxb2psdmp5bGRhcm5tZGN1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzYyOTM4NiwiZXhwIjoyMDg5MjA1Mzg2fQ.i6GoIohStncGoj825V63JOVmWBZ0ud_Eza4NNDV-itU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);