// frontend/config/supabase.ts
import { createClient } from '@supabase/supabase-js';

// ⚠️ Substitua pelos valores corretos do Supabase
const SUPABASE_URL = 'https://jchyovivftnozqqytxzs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjaHlvdml2ZnRub3pxcXl0eHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2ODI2NjQsImV4cCI6MjA1MTI1ODY2NH0.aPEgEa9D-S0fthI7zmcoXFlr58JBEyga0X3vOKHfk8c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
