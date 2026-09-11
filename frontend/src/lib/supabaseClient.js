import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Loud, not thrown — a missing .env shouldn't crash the whole module graph,
  // it should surface clearly the first time a real auth call is attempted.
  console.error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copy frontend/.env.example to " +
      "frontend/.env and fill in your Supabase project's values, then restart the dev server."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
