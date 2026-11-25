//ahi va asta arriba del todo
/* Cliente de Supabase para iniciar sesión con GitHub.
 * La configuración se lee de /api/config, que toma SUPABASE_URL y SUPABASE_KEY del .env.
 * El bundle de Supabase se sirve localmente en /recursos/vendor/supabase/supabase.js.
 */
window.AuthSocial = (() => {
  const NOMBRES = { github: 'GitHub' };
  let configuracion = null;
  let cliente = null;

  async function config() {
    if (configuracion) return configuracion;
    const respuesta = await fetch('/api/config', { credentials: 'same-origin', cache: 'no-store' });
    if (!respuesta.ok) throw new Error('No se pudo leer la configuración de Supabase.');
    configuracion = await respuesta.json();
    return configuracion;
  }

  async function obtenerCliente() {
    if (cliente) return cliente;
    const cfg = await config();
    if (!cfg.supabaseConfigurado) {
      throw new Error('Supabase no está configurado. Escribe SUPABASE_URL y SUPABASE_KEY reales en .env y reinicia el servidor.');
    }
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      throw new Error('No se pudo cargar la librería de Supabase.');
    }
    cliente = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, {
      auth: { detectSessionInUrl: true, persistSession: true, autoRefreshToken: true }
    });
    return cliente;
  }

  function urlRetorno() {
    const destino = new URL('/publico/Login.html', window.location.origin);
    destino.searchParams.set('oauth', '1');
    const next = new URLSearchParams(window.location.search).get('next');
    if (next) destino.searchParams.set('next', next);
    return destino.toString();
  }

  async function iniciarSesion(proveedor) {
    const sb = await obtenerCliente();
    const opciones = { redirectTo: urlRetorno() };
    if (proveedor === 'github') opciones.scopes = 'user:email';
    const { error } = await sb.auth.signInWithOAuth({ provider: proveedor, options: opciones });
    if (error) throw error;
  }

  const loginConGitHub = () => iniciarSesion('github');

  async function sincronizarSesion() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('oauth') !== '1') return null;

    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const errorOAuth = hash.get('error_description') || hash.get('error') ||
      params.get('error_description') || params.get('error');
    const sb = await obtenerCliente();

    if (errorOAuth) {
      await sb.auth.signOut().catch(() => {});
      throw new Error(decodeURIComponent(errorOAuth.replace(/\+/g, ' ')));
    }

    const { data, error } = await sb.auth.getSession();
    if (error) throw error;
    const sesion = data && data.session;
    if (!sesion || !sesion.access_token) {
      throw new Error('Supabase no devolvió una sesión válida. Intenta de nuevo.');
    }

    const respuesta = await fetch('/api/auth/supabase', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: sesion.access_token })
    });
    const resultado = await respuesta.json().catch(() => null);
    if (!respuesta.ok) {
      throw new Error(resultado && resultado.error ? resultado.error : 'No se pudo validar la sesión con ReciclaTech.');
    }

    await sb.auth.signOut().catch(() => {});
    const limpia = new URL(window.location.href);
    limpia.searchParams.delete('oauth');
    limpia.searchParams.delete('error');
    limpia.searchParams.delete('error_description');
    limpia.hash = '';
    window.history.replaceState(null, '', limpia.pathname + limpia.search);
    return resultado && resultado.session ? resultado.session : null;
  }

  function conectarBotones(contenedor) {
    const caja = typeof contenedor === 'string' ? document.getElementById(contenedor) : contenedor;
    if (!caja) return;
    caja.querySelectorAll('[data-proveedor]').forEach((boton) => {
      boton.addEventListener('click', () => {
        const proveedor = boton.dataset.proveedor;
        const nombre = NOMBRES[proveedor] || proveedor;
        if (typeof App !== 'undefined' && App.mensaje) App.mensaje('msg', 'Conectando con ' + nombre + '…', 'info');
        boton.disabled = true;
        iniciarSesion(proveedor).catch((error) => {
          console.error(error);
          const texto = error && error.message ? error.message : 'No se pudo iniciar sesión con ' + nombre + '.';
          if (typeof App !== 'undefined' && App.mensaje) App.mensaje('msg', texto, 'error');
          if (typeof App !== 'undefined' && App.aviso) App.aviso(texto, 'error');
        }).finally(() => { boton.disabled = false; });
      });
    });
  }

  window.loginConGitHub = loginConGitHub;

  return { iniciarSesion, loginConGitHub, sincronizarSesion, conectarBotones };
})();
