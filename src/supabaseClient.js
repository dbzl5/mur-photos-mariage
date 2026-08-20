import { createClient } from '@supabase/supabase-js'

// Ces deux valeurs viennent de ton projet Supabase (Settings > API).
// En local : mets-les dans un fichier .env (voir .env.example)
// Sur Vercel : ajoute-les dans Project Settings > Environment Variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquantes. ' +
    'Vérifie ton fichier .env (en local) ou tes variables d\'environnement (sur Vercel).'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Nom du bucket de stockage créé dans Supabase Storage
export const BUCKET_NAME = 'wedding-photos'
