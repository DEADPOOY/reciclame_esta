const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

fs.mkdirSync(PUBLIC, { recursive: true });
fs.cpSync(path.join(ROOT, 'paginas'), PUBLIC, { recursive: true });
fs.cpSync(path.join(ROOT, 'js'), path.join(PUBLIC, 'js'), { recursive: true });
fs.cpSync(path.join(ROOT, 'css'), path.join(PUBLIC, 'css'), { recursive: true });

fs.writeFileSync(path.join(PUBLIC, 'index.html'), `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="refresh" content="0;url=/publico/Index.html"><title>ReciclaTech</title></head>
<body><p>Abriendo ReciclaTech… <a href="/publico/Index.html">Continuar</a></p>
<script>location.replace('/publico/Index.html');</script></body></html>\n`);

const supabaseBundle = path.join(ROOT, 'node_modules', '@supabase', 'supabase-js', 'dist', 'umd', 'supabase.js');
if (!fs.existsSync(supabaseBundle)) throw new Error('No se encontró el bundle UMD de Supabase. Ejecuta npm install.');
const destinoBundle = path.join(PUBLIC, 'vendor', 'supabase', 'supabase.js');
fs.mkdirSync(path.dirname(destinoBundle), { recursive: true });
fs.copyFileSync(supabaseBundle, destinoBundle);

console.log('Assets preparados en public/ para Vercel.');
