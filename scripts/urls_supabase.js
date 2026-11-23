const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
require('dotenv').config({ path: path.join(ROOT, '.env') });

const { origenesApp } = require('../servidor/origenes');

const supabaseUrl = String(process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
const origenes = origenesApp();
const origenLocal = 'http://localhost:3000';

if (!origenes.includes(origenLocal)) origenes.unshift(origenLocal);

const callbackSupabase = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(supabaseUrl)
    ? supabaseUrl + '/auth/v1/callback'
    : '(configura SUPABASE_URL en .env)';

console.log('Redirect URLs para Supabase > Authentication > URL Configuration:');
for (const origen of origenes) {
    console.log('  ' + origen + '/publico/Login.html*');
}

console.log('\nAuthorization callback URL en la OAuth App de GitHub:');
console.log('  ' + callbackSupabase);

console.log('\nOrígenes que usará el servidor (APP_ORIGIN/APP_ORIGINS):');
console.log('  ' + origenes.join(', '));

console.log('\nNota: si usas previews de Vercel, agrega también el patrón');
console.log('  https://*-TU-EQUIPO.vercel.app/publico/Login.html*');
console.log('o limita el login social solo a tu dominio de producción.');
