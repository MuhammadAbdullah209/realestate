import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cwiowfjdivpsvgfffklu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3aW93ZmpkaXZwc3ZnZmZma2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMDY2MzQsImV4cCI6MjA2ODU4MjYzNH0.jFmW5UwBox8HLO1S7owjkkx8oISsuzDYBB1NgBqaalo';
export const supabase = createClient(supabaseUrl, supabaseKey);
