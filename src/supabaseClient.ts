// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Reemplaza esto con tu URL de Supabase y tu Publishable key
const SUPABASE_URL = 'https://zjqerhxjgmzqshisrfac.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_-mobhRdFG-l55qIuNUxPZA_kFmomUzk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);