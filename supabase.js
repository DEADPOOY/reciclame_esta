// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://supabase.co'
const supabaseKey = 'sb_publishable_VCrpcK60ktvkrxoWUs6h9w_wHdpXgJm'

export const supabase = createClient(supabaseUrl, supabaseKey)


async function loginConGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard.html' // A donde va tras iniciar sesión
    }
  })
}
