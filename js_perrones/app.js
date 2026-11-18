/* ReciclaTech · núcleo del sitio: cabecera, menú, pie, control de acceso por perfil y utilidades.
 * Cada página declara en <body>:
 *   data-pagina = nombre de la página      data-menu = opción activa del menú
 *   data-acceso = libre | invitado | usuario | admin
 */
const App = (() => {
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const parametro = (n) => new URLSearchParams(location.search).get(n);
  const archivoActual = () => location.pathname.split('/').pop() || 'Index.html';
  const menuPorRol = (rol) => (rol === 'admin' ? 'MenuAdmin.html' : 'MenuUsuario.html');

  // avisos directos mi pa
  function aviso(msg, tipo) {
    let c = document.getElementById('aviso');
    if (!c) { c = document.createElement('div'); c.id = 'aviso'; c.setAttribute('aria-live', 'polite'); document.body.appendChild(c); }
    const t = document.createElement('div');
    t.className = 'toast ' + (tipo || '');
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 4500);
  }
  function avisoDiferido(msg, tipo) { try { sessionStorage.setItem('reciclatech_aviso', JSON.stringify({ msg, tipo })); } catch (e) { /* nada */ } }
  function mostrarAvisoPendiente() {
    try {
      const v = sessionStorage.getItem('reciclatech_aviso');
      if (v) { sessionStorage.removeItem('reciclatech_aviso'); const a = JSON.parse(v); aviso(a.msg, a.tipo); }
    } catch (e) { /* nada */ }
  }

  //por si un usuario pendejo se quiere colar en donde no
  function guardia(acceso) {
    const s = API.sesion();
    if (acceso === 'invitado' && s) { location.replace(menuPorRol(s.rol)); return false; }
    if ((acceso === 'usuario' || acceso === 'admin') && !s) {
      avisoDiferido('Inicia sesión para continuar.', 'error');
      location.replace('Login.html?next=' + encodeURIComponent(archivoActual() + location.search));
      return false;
    }
    if (acceso === 'usuario' && s.rol !== 'usuario') { avisoDiferido('Esa sección es solo para usuarios wuebos puto.', 'error'); location.replace(menuPorRol(s.rol)); return false; }
    if (acceso === 'admin' && s.rol !== 'admin') { avisoDiferido('No tienes permiso para entrar al panel de administración usquele perro.', 'error'); location.replace(menuPorRol(s.rol)); return false; }
    return true;
  }

  //aqui esta lo bueno lo cabron de todo el pie la cabezita y todo aca bn aca
  const enlace = (href, texto, activo) =>
    '<a href="' + href + '"' + (activo === href ? ' class="activo" aria-current="page"' : '') + '>' + texto + '</a>';

  function pintarCabecera(s, activo) {
    let nav; let acc;
    if (s && s.rol === 'admin') {
      nav = enlace('MenuAdmin.html', 'Panel de administración', activo) + enlace('Consulta.html', 'Ver sitio público', activo);
      acc = '<span class="saludo">Administrador</span><button class="btn sec" id="btn-salir" type="button">Cerrar sesión</button>';
    } else if (s) {
      nav = enlace('MenuUsuario.html', 'Inicio', activo) + enlace('Consulta.html', 'Centros', activo) +
        enlace('Buscar.html', 'Buscar puntos', activo) + enlace('Horarios.html', 'Horarios', activo) +
        enlace('Reporte.html', 'Reportar', activo);
      acc = '<span class="saludo">Hola, ' + esc(s.nombre.split(' ')[0]) + '</span><button class="btn sec" id="btn-salir" type="button">Cerrar sesión</button>';
    } else {
      nav = enlace('Index.html', 'Inicio', activo) + enlace('Buscar.html', 'Buscar puntos', activo) +
        enlace('Consulta.html', 'Centros de acopio', activo) + enlace('Horarios.html', 'Horarios', activo);
      acc = '<a class="btn sec" href="Login.html">Iniciar sesión</a><a class="btn" href="Registro.html">Registrarse</a>';
    }
    const destino = s ? menuPorRol(s.rol) : 'Index.html';
    return '<div class="cabecera-in"><a class="logo" href="' + destino + '"><span class="logo-marca" aria-hidden="true">R</span>ReciclaTech</a>' +
      '<button class="menu-toggle" id="btn-menu" type="button" aria-label="Abrir menú" aria-expanded="false">Menú</button>' +
      '<nav class="nav" aria-label="Principal">' + nav + '</nav><div class="acciones">' + acc + '</div></div>';
  }

  function pintarMenuAdmin(activo) {
    const items = [['MenuAdmin.html', 'Inicio'], ['AdmPuntos.html', 'Puntos de recepción'], ['Ficha.html', 'Ficha del punto'],
      ['AdmResiduos.html', 'Tipos de residuos'], ['AdmHorarios.html', 'Horarios'], ['AdmUbicacion.html', 'Ubicación'],
      ['AdmReportes.html', 'Reportes']];
    return '<nav aria-label="Administración">' + items.map((i) =>
      '<a href="' + i[0] + '"' + (activo === i[0] ? ' class="activo" aria-current="page"' : '') + '>' + i[1] + '</a>').join('') + '</nav>';
  }

  function armarLayout() {
    const b = document.body; const s = API.sesion(); const activo = b.dataset.menu || '';
    const cab = document.getElementById('cabecera');
    if (cab) { cab.className = 'cabecera'; cab.innerHTML = pintarCabecera(s, activo); }
    const lateral = document.getElementById('menu-admin');
    if (lateral) { lateral.className = 'menu-admin'; lateral.innerHTML = pintarMenuAdmin(activo); }
    const pie = document.getElementById('pie');
    if (pie) { pie.className = 'pie'; pie.textContent = 'ReciclaTech · Localización y consulta de puntos de recepción de residuos tecnológicos · Ciudad de México'; }
    const salir = document.getElementById('btn-salir');
    if (salir) salir.addEventListener('click', () => ejecutar(async () => {
      await API.cerrarSesion();
      location.href = 'Index.html';
    }));
    const tog = document.getElementById('btn-menu');
    if (tog) tog.addEventListener('click', () => {
      const abierta = cab.classList.toggle('abierta'); tog.setAttribute('aria-expanded', abierta ? 'true' : 'false');
    });
  }
// no pienso explicar lo anterior porque se netiende y alch ya me dio hueva pa

  // aqui esta lo mero bueno loq eu ocupan las paginas y el pinche mapa de meirda
  const chipsResiduos = (p) => p.residuos.map((id) => '<span class="chip">' + esc(API.nombreResiduo(id)) + '</span>').join('') ||
    '<span class="suave chico">Sin tipos de residuo registrados</span>';
  const badgeFicha = (p) => p.ficha.estado === 'verificada'
    ? '<span class="insignia ok">Ficha verificada</span>' : '<span class="insignia pend">Ficha pendiente</span>';
  const urlMapa = (p) => {
    if (!p || !API.tieneUbicacion(p)) return 'https://www.openstreetmap.org/export/embed.html?bbox=-99.36%2C19.05%2C-98.95%2C19.60&layer=mapnik';
    const dx = 0.008; const dy = 0.005;
    return 'https://www.openstreetmap.org/export/embed.html?bbox=' + [p.lng - dx, p.lat - dy, p.lng + dx, p.lat + dy].join('%2C') +
      '&layer=mapnik&marker=' + p.lat + '%2C' + p.lng;
  };
  const urlMapaGrande = (p) => 'https://www.openstreetmap.org/?mlat=' + p.lat + '&mlon=' + p.lng + '#map=17/' + p.lat + '/' + p.lng;
  const tablaHorario = (p) => '<div class="tabla-wrap"><table><thead><tr><th>Día</th><th>Horario de atención</th></tr></thead><tbody>' +
    API.DIAS.map((d) => '<tr><td>' + API.NOMBRE_DIA[d] + '</td><td>' + API.fmtDia(p.horarios[d]) + '</td></tr>').join('') + '</tbody></table></div>';
  const opcionesPuntos = (lista, sel, ph) => '<option value="">' + esc(ph || 'Seleccione un punto de recepción') + '</option>' +
    lista.map((p) => '<option value="' + p.id + '"' + (String(sel) === String(p.id) ? ' selected' : '') + '>' + esc(p.nombre) + '</option>').join('');
  const opcionesLista = (lista, sel, ph) => '<option value="">' + esc(ph) + '</option>' +
    lista.map((x) => '<option' + (sel === x ? ' selected' : '') + '>' + esc(x) + '</option>').join('');

  /* validación de formularios: marca campos vacíos/ inválidos y muestra el texto bajo el campo */
  function marcar(campo, msg) {
    campo.classList.toggle('invalido', !!msg);
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
    const e = campo.parentElement.querySelector('.error-campo');
    if (e) e.textContent = msg || '';
  }
  function limpiarMarcas(form) { form.querySelectorAll('.invalido').forEach((c) => marcar(c, '')); }
  function requerido(campo, msg) {
    const vacio = !String(campo.value).trim();
    marcar(campo, vacio ? (msg || 'Este campo es obligatorio.') : '');
    return !vacio;
  }
  function mensaje(id, texto, tipo) {
    const m = document.getElementById(id); if (!m) return;
    m.hidden = !texto; m.className = 'mensaje ' + (tipo || 'info'); m.textContent = texto || '';
  }

  async function iniciar() {
    try {
      await API.cargar();
      const acceso = document.body.dataset.acceso || 'libre';
      if (!guardia(acceso)) return;
      armarLayout();
      mostrarAvisoPendiente();
      const nombre = document.body.dataset.pagina;
      if (window.Paginas && window.Paginas[nombre]) window.Paginas[nombre]();
    } catch (error) {
      console.error(error);
      aviso('No fue posible conectar con ReciclaTech: ' + error.message, 'error');
    }
  }
  document.addEventListener('DOMContentLoaded', iniciar);

  function ejecutar(accion) {
    return Promise.resolve().then(accion).catch((error) => {
      console.error(error);
      aviso(error.message || 'La operación no pudo completarse.', 'error');
    });
  }

  return { esc, parametro, aviso, avisoDiferido, menuPorRol, chipsResiduos, badgeFicha, urlMapa, urlMapaGrande,
    tablaHorario, opcionesPuntos, opcionesLista, marcar, limpiarMarcas, requerido, mensaje, ejecutar };
})();