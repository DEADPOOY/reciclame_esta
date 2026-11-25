//ahi va asta arriba del todo
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
  const seccionActual = () => location.pathname.split('/').slice(-2, -1)[0];
  const enSeccion = (seccion, archivo) => seccionActual() === seccion
    ? archivo
    : '../' + seccion + '/' + archivo;
  const rutaPublica = (archivo) => enSeccion('publico', archivo);
  const rutaUsuario = (archivo) => enSeccion('usuarios', archivo);
  const rutaAdmin = (archivo) => enSeccion('admin', archivo);
  const menuPorRol = (rol) => rol === 'admin'
    ? rutaAdmin('MenuAdmin.html')
    : rutaUsuario('MenuUsuario.html');

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
      const seccion = seccionActual();
      const destino = seccion === 'publico'
        ? archivoActual() + location.search
        : '../' + seccion + '/' + archivoActual() + location.search;
      location.replace(rutaPublica('Login.html') + '?next=' + encodeURIComponent(destino));
      return false;
    }
    if (acceso === 'usuario' && s.rol !== 'usuario') { avisoDiferido('Esa sección es solo para usuarios registrados.', 'error'); location.replace(menuPorRol(s.rol)); return false; }
    if (acceso === 'admin' && s.rol !== 'admin') { avisoDiferido('No tienes permiso para entrar al panel de administración.', 'error'); location.replace(menuPorRol(s.rol)); return false; }
    return true;
  }

  //aqui esta lo bueno lo cabron de todo el pie la cabezita y todo aca bn aca
  const enlace = (href, texto, activo) =>
    '<a href="' + href + '"' + (activo === href ? ' class="activo" aria-current="page"' : '') + '>' + texto + '</a>';

  function pintarCabecera(s, activo) {
    let nav; let acc;
    if (s && s.rol === 'admin') {
      nav = enlace(menuPorRol('admin'), 'Panel de administración', activo) +
        enlace(rutaUsuario('Consulta.html'), 'Ver sitio público', activo);
      acc = '<span class="saludo">Administrador</span><button class="btn sec" id="btn-salir" type="button">Cerrar sesión</button>';
    } else if (s) {
      nav = enlace(rutaUsuario('MenuUsuario.html'), 'Inicio', activo) + enlace(rutaUsuario('Consulta.html'), 'Centros', activo) +
        enlace(rutaUsuario('Buscar.html'), 'Buscar puntos', activo) + enlace(rutaUsuario('Horarios.html'), 'Horarios', activo) +
        enlace(rutaUsuario('Reporte.html'), 'Reportar', activo);
      acc = '<span class="saludo">Hola, ' + esc(s.nombre.split(' ')[0]) + '</span><button class="btn sec" id="btn-salir" type="button">Cerrar sesión</button>';
    } else {
      nav = enlace(rutaPublica('Index.html'), 'Inicio', activo) + enlace(rutaUsuario('Buscar.html'), 'Buscar puntos', activo) +
        enlace(rutaUsuario('Consulta.html'), 'Centros de acopio', activo) + enlace(rutaUsuario('Horarios.html'), 'Horarios', activo);
      acc = '<a class="btn sec" href="' + rutaPublica('Login.html') + '">Iniciar sesión</a><a class="btn" href="' +
        rutaPublica('Registro.html') + '">Registrarse</a>';
    }
    const destino = s ? menuPorRol(s.rol) : rutaPublica('Index.html');
    return '<div class="cabecera-in"><a class="logo" href="' + destino + '" aria-label="ReciclaTech"><img class="logo-marca" src="/recursos/imagenes/logo.png" alt="" aria-hidden="true">eciclaTech</a>' +
      '<button class="menu-toggle" id="btn-menu" type="button" aria-label="Abrir menú" aria-expanded="false">Menú</button>' +
      '<nav class="nav" aria-label="Principal">' + nav + '</nav><div class="acciones">' + acc + '</div></div>';
  }

  function pintarMenuAdmin(activo) {
    const items = [['MenuAdmin.html', 'Inicio'], ['AdmPuntos.html', 'Puntos de recepción'], ['Ficha.html', 'Ficha del punto'],
      ['AdmResiduos.html', 'Tipos de residuos'], ['AdmHorarios.html', 'Horarios'], ['AdmUbicacion.html', 'Ubicación'],
      ['AdmReportes.html', 'Reportes']];
    return '<nav aria-label="Administración">' + items.map((i) =>
      '<a href="' + rutaAdmin(i[0]) + '"' + (activo === i[0] ? ' class="activo" aria-current="page"' : '') + '>' + i[1] + '</a>').join('') + '</nav>';
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
      location.href = rutaPublica('Index.html');
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
  const coordenadasValidas = (p) => p && p.lat != null && p.lng != null &&
    Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng));
  const consultaMapa = (p) => {
    if (coordenadasValidas(p)) return p.lat + ',' + p.lng;
    if (!p || !API.tieneUbicacion(p)) return 'Ciudad de México';
    return p.cp + ', Ciudad de México';
  };
  const urlMapa = (p) => 'https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1s' +
    encodeURIComponent(consultaMapa(p));
  const urlMapaGrande = (p) => 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(consultaMapa(p));

  /* ---------- punto más cercano a la ubicación del visitante ---------- */
  // Coordenadas aproximadas del centro de cada alcaldía. Se usan solo cuando el
  // punto no tiene latitud/longitud capturadas, para no dejar vacía la sección.
  const ALCALDIA_COORDS = {
    'Álvaro Obregón': [19.3593, -99.2033],
    'Azcapotzalco': [19.4869, -99.1850],
    'Benito Juárez': [19.3984, -99.1577],
    'Coyoacán': [19.3467, -99.1617],
    'Cuajimalpa de Morelos': [19.3650, -99.2930],
    'Cuauhtémoc': [19.4326, -99.1332],
    'Gustavo A. Madero': [19.4939, -99.1100],
    'Iztacalco': [19.3950, -99.0970],
    'Iztapalapa': [19.3550, -99.0620],
    'La Magdalena Contreras': [19.3333, -99.2333],
    'Miguel Hidalgo': [19.4300, -99.2000],
    'Milpa Alta': [19.1920, -99.0230],
    'Tláhuac': [19.2860, -99.0050],
    'Tlalpan': [19.2960, -99.1680],
    'Venustiano Carranza': [19.4333, -99.1000],
    'Xochimilco': [19.2570, -99.1040]
  };

  function coordenadasPunto(p) {
    if (coordenadasValidas(p)) return { lat: Number(p.lat), lng: Number(p.lng), exacta: true };
    const nombre = p.alcaldia || '';
    const clave = ALCALDIA_COORDS[nombre] ? nombre
      : Object.keys(ALCALDIA_COORDS).find((k) => API.norm(k) === API.norm(nombre));
    return clave ? { lat: ALCALDIA_COORDS[clave][0], lng: ALCALDIA_COORDS[clave][1], exacta: false } : null;
  }

  function distanciaKm(a, b) {
    const radio = 6371;
    const rad = (g) => g * Math.PI / 180;
    const dLat = rad(b.lat - a.lat);
    const dLng = rad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * radio * Math.asin(Math.sqrt(h));
  }

  function iniciarPuntoCercano() {
    const boton = document.getElementById('btn-mi-ubicacion');
    if (!boton) return;
    const estado = document.getElementById('cerca-estado');
    const resultado = document.getElementById('cerca-resultado');
    const mostrar = (texto, tipo) => {
      if (!estado) return;
      estado.hidden = !texto;
      estado.className = 'mensaje ' + (tipo || 'info');
      estado.textContent = texto || '';
    };
    const mensajeGeo = (error) => {
      if (error && error.code === 1) return 'No diste permiso de ubicación. Actívalo en tu navegador o busca el centro manualmente.';
      if (error && error.code === 2) return 'Tu ubicación no está disponible en este momento. Intenta de nuevo o busca el centro manualmente.';
      if (error && error.code === 3) return 'La búsqueda de tu ubicación tardó demasiado. Intenta de nuevo.';
      return 'No pudimos obtener tu ubicación. Busca el centro manualmente.';
    };

    function pintar(pos) {
      const usuario = { lat: pos.latitude, lng: pos.longitude };
      const candidatos = API.verificados()
        .map((p) => ({ p, c: coordenadasPunto(p) }))
        .filter((x) => x.c)
        .map((x) => ({ p: x.p, c: x.c, km: distanciaKm(usuario, x.c) }))
        .sort((a, b) => a.km - b.km);

      if (!candidatos.length) {
        mostrar('Todavía no hay centros verificados con ubicación registrada. Prueba a buscar uno manualmente.', 'error');
        resultado.innerHTML = '<a class="btn sec chico" href="' + rutaUsuario('Buscar.html') + '">Buscar centros</a>';
        return;
      }

      const mejor = candidatos[0];
      const aproximada = mejor.c.exacta ? '' : ' aprox.';
      const mapa = urlMapaGrande(mejor.p);
      mostrar('', 'info');
      resultado.innerHTML = '<article class="punto-card cerca-card">' +
        '<div class="cerca-titulo"><h3>' + esc(mejor.p.nombre) + '</h3>' +
        '<span class="insignia ok">A ' + mejor.km.toFixed(1) + ' km' + aproximada + '</span></div>' +
        '<div class="suave chico">' + esc(API.dirCompleta(mejor.p)) + '</div>' +
        '<div class="acciones-card"><span>' + chipsResiduos(mejor.p) + '</span>' +
        '<span><a class="btn sec chico" href="' + rutaUsuario('Punto.html?id=' + mejor.p.id) + '">Ver información</a> ' +
        '<a class="btn chico" href="' + mapa + '" target="_blank" rel="noopener">Cómo llegar</a></span></div>' +
        (mejor.c.exacta ? '' : '<p class="suave chico" style="margin:.5rem 0 0">La distancia es aproximada porque el centro aún no tiene coordenadas exactas; se calculó con el centro de su alcaldía.</p>') +
        '</article>';
    }

    boton.addEventListener('click', () => {
      if (!navigator.geolocation) {
        mostrar('Tu navegador no permite obtener la ubicación.', 'error');
        return;
      }
      boton.disabled = true;
      mostrar('Buscando tu ubicación…', 'info');
      navigator.geolocation.getCurrentPosition(
        (pos) => { boton.disabled = false; pintar(pos.coords); },
        (error) => {
          boton.disabled = false;
          mostrar(mensajeGeo(error), 'error');
          resultado.innerHTML = '<a class="btn sec chico" href="' + rutaUsuario('Buscar.html') + '">Buscar centros manualmente</a>';
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }
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
      iniciarPuntoCercano();
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
    tablaHorario, opcionesPuntos, opcionesLista, marcar, limpiarMarcas, requerido, mensaje, ejecutar,
    iniciarPuntoCercano };
})();