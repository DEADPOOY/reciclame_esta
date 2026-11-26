//ahi va asta arriba del todo
window.Paginas = window.Paginas || {};
Object.assign(window.Paginas, (() => {
  const $ = (id) => document.getElementById(id);
  const E = App.esc;

  /* este es pal usuario chido el bueno el goat*/
  // Sección de usuario tiene pantallas para consultar centros, revisar reportes y hacer seguimiento del perfil.
  // Aquí se construyen las tarjetas de puntos, filtros de búsqueda y la vista de detalle de cada centro.
  function MenuUsuario() {
    const s = API.sesion();
    const claseEstado = (estado) => estado === 'Alta' ? 'ok' : estado === 'Devuelto' ? 'devuelto' : 'nuevo';
    $('saludo').textContent = 'Hola, ' + s.nombre;
    const mis = API.reportes().filter((r) => r.usuarioId === s.id);
    $('mis-reportes').innerHTML = mis.length
      ? '<div class="tabla-wrap"><table><thead><tr><th>Centro de acopio</th><th>Motivo</th><th>Fecha</th><th>Estado</th><th>Respuesta del administrador</th></tr></thead><tbody>' +
        mis.slice().reverse().map((r) => '<tr><td>' + E(r.puntoNombre) + '</td><td>' + E(r.motivo) + '</td><td>' + API.fmtFecha(r.fecha) +
          '</td><td><span class="insignia ' + claseEstado(r.estado) + '">' + E(r.estado) + '</span></td><td>' +
          (r.respuestaAdmin ? E(r.respuestaAdmin) : '—') + '</td></tr>').join('') + '</tbody></table></div>'
      : '<div class="vacio">Aún no has hecho ningún reporte.</div>';
  }

  //este es un filtro aca bn aca w que guarda tus parametros pues
  function tarjetaPunto(p, extra) {
    return '<article class="punto-card" data-id="' + p.id + '"><h3>' + E(p.nombre) + '</h3>' +
      '<div class="suave chico">' + E(API.dirCompleta(p)) + '</div>' + (extra || '') +
      '<div class="acciones-card"><span>' + App.chipsResiduos(p) + '</span>' +
      '<a class="btn sec chico" href="Punto.html?id=' + p.id + '">Ver información</a></div></article>';
  }

  // Centros de acopio: mapa de fondo y listado flotante. El mapa muestra un
  // solo punto a la vez, el que se elige desde la lista.
  function Consulta() {
    const lista = $('lista'); const mapa = $('mapa'); const enlace = $('enlace-mapa');
    let seleccionado = null;

    function tarjetaMapa(p) {
      return '<article class="punto-card punto-card-mapa" data-id="' + p.id + '">' +
        '<div class="punto-card-cab"><h3>' + E(p.nombre) + '</h3><span class="insignia ok">Verificado</span></div>' +
        '<div class="suave chico">' + E(API.dirCompleta(p)) + '</div>' +
        '<div class="acciones-card"><span>' + App.chipsResiduos(p) + '</span>' +
        '<a class="btn sec chico" href="Punto.html?id=' + p.id + '">Ver ficha</a></div></article>';
    }

    function seleccionar(id) {
      const p = API.punto(id);
      if (!p) return;
      seleccionado = id;
      lista.querySelectorAll('.punto-card').forEach((c) => c.classList.toggle('sel', Number(c.dataset.id) === id));
      mapa.src = App.urlMapa(p);
      mapa.title = 'Mapa de ' + p.nombre;
      enlace.hidden = false;
      enlace.href = App.urlMapaGrande(p);
      enlace.textContent = 'Abrir ' + p.nombre + ' en Google Maps';
    }

    function pintar() {
      const pts = API.buscar({ q: $('q').value });
      lista.innerHTML = pts.length ? pts.map(tarjetaMapa).join('') : '<div class="vacio">No hay centros parecidos.</div>';
      $('cuenta').textContent = pts.length + ' centro(s) de acopio';
      lista.querySelectorAll('.punto-card').forEach((c) => c.addEventListener('click', (ev) => {
        if (ev.target.closest('a')) return;
        seleccionar(Number(c.dataset.id));
      }));

      const ids = new Set(pts.map((p) => p.id));
      if (seleccionado && !ids.has(seleccionado)) seleccionado = null;
      if (!pts.length) {
        seleccionado = null;
        mapa.src = App.urlMapa(null);
        mapa.title = 'Mapa de centros de acopio';
        enlace.hidden = true;
        return;
      }
      if (!seleccionado) seleccionar(pts[0].id);
      else lista.querySelector('[data-id="' + seleccionado + '"]')?.classList.add('sel');
    }

    $('form-buscar').addEventListener('submit', (e) => { e.preventDefault(); pintar(); });
    $('q').addEventListener('input', pintar);
    mapa.src = App.urlMapa(null);
    pintar();
  }

  // Búsqueda de puntos con filtros por texto y por tipo de residuo.
  // Los criterios se leen de la URL para mantener el estado al navegar entre pantallas.
  function Buscar() {
    const tipos = (App.parametro('tipos') || '').split(',').filter(Boolean).map(Number);
    $('q').value = App.parametro('q') || '';
    const cont = $('resultados');
    const estado = document.createElement('p');
    estado.className = 'suave';
    estado.setAttribute('role', 'status');
    cont.before(estado);
    let ubicacion = null;
    let buscandoUbicacion = false;

    function distanciaKm(a, b) {
      const rad = (n) => n * Math.PI / 180;
      const dLat = rad(b.lat - a.lat); const dLng = rad(b.lng - a.lng);
      const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
      return 6371 * 2 * Math.asin(Math.sqrt(h));
    }

    function localizar() {
      if (!navigator.geolocation) {
        estado.textContent = 'Este navegador no permite obtener tu ubicación.';
        return;
      }
      buscandoUbicacion = true;
      estado.textContent = 'Buscando el centro más cercano a tu ubicación…';
      $('cuenta').textContent = 'Buscando…';
      navigator.geolocation.getCurrentPosition((pos) => {
        ubicacion = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        buscandoUbicacion = false;
        pintar();
      }, () => {
        buscandoUbicacion = false;
        estado.textContent = 'No pudimos obtener tu ubicación. Actívala para mostrar el centro más cercano.';
        $('cuenta').textContent = 'Ubicación necesaria';
        cont.innerHTML = '<button class="btn sec" id="btn-ubicacion" type="button">Volver a intentar</button>';
        document.getElementById('btn-ubicacion').addEventListener('click', localizar);
      }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
    }

    function pintar() {
      if (buscandoUbicacion || !ubicacion) return;
      const pts = API.buscar({ q: $('q').value, tipos })
        .filter((p) => Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng)) && p.lat != null && p.lng != null)
        .map((p) => ({ p, km: distanciaKm(ubicacion, { lat: Number(p.lat), lng: Number(p.lng) }) }))
        .sort((a, b) => a.km - b.km);
      const cercano = pts[0];
      $('cuenta').textContent = cercano ? 'Centro más cercano · ' + cercano.km.toFixed(1) + ' km' : 'Sin resultados';
      estado.textContent = cercano ? 'Mostrando solo el punto más cercano a tu ubicación.' : '';
      cont.innerHTML = cercano ? tarjetaPunto(cercano.p)
        : '<div class="vacio">No encontramos puntos con esos puntos. Prueba con menos filtros.</div>';
    }
    const activos = $('filtros-activos');
    if (tipos.length) {
      activos.innerHTML = '<span class="suave chico">Filtrando por: </span>' +
        tipos.map((t) => '<span class="chip">' + E(API.nombreResiduo(t)) + '</span>').join('') +
        ' <a class="chico" href="Buscar.html?q=' + encodeURIComponent($('q').value) + '">Quitar filtros</a>';
    }
    $('form-buscar').addEventListener('submit', (e) => {
      e.preventDefault();
      const p = new URLSearchParams(); if ($('q').value.trim()) p.set('q', $('q').value.trim());
      if (tipos.length) p.set('tipos', tipos.join(','));
      history.replaceState(null, '', 'Buscar.html' + (p.toString() ? '?' + p : '')); pintar();
    });
    $('btn-filtro').addEventListener('click', () => {
      const p = new URLSearchParams();
      const q = $('q').value.trim();
      if (q) p.set('q', q);
      if (tipos.length) p.set('tipos', tipos.join(','));
      location.href = 'Filtro.html' + (p.toString() ? '?' + p : '');
    });
    localizar();
  }

  // espera adivina esto es pa los residuos
  // si es  OTRO PUTO FILTRO
  function Filtro() {
    const sel = (App.parametro('tipos') || '').split(',').filter(Boolean).map(Number);
    const q = App.parametro('q') || '';
    const caja = $('tipos');
    caja.innerHTML = API.residuos().map((r) => '<label class="check"><input type="checkbox" value="' + r.id + '"' +
      (sel.includes(r.id) ? ' checked' : '') + '> ' + E(r.nombre) + '</label>').join('');
    const marcados = () => Array.from(caja.querySelectorAll('input:checked')).map((i) => Number(i.value));
    function vista() {
      const pts = API.buscar({ q, tipos: marcados() });
      $('cuenta').textContent = pts.length + ' centro(s) con el filtro';
      $('vista').innerHTML = pts.slice(0, 4).map((p) => tarjetaPunto(p)).join('') || '<div class="vacio">Ningún punto recibe alguno de los tipos elegidos.</div>';
    }
    caja.addEventListener('change', vista);
    $('aplicar').addEventListener('click', () => {
      const p = new URLSearchParams(); if (q) p.set('q', q);
      const m = marcados(); if (m.length) p.set('tipos', m.join(','));
      location.href = 'Buscar.html' + (p.toString() ? '?' + p : '');
    });
    $('limpiar').addEventListener('click', () => { caja.querySelectorAll('input').forEach((i) => { i.checked = false; }); vista(); });
    vista();
  }

  //adivina pa adivina
  //OTRO PUTO FILTRO ajajajaja
  function Punto() {
    const p = API.punto(App.parametro('id')); const s = API.sesion();
    const visible = p && (p.ficha.estado === 'verificada' || (s && s.rol === 'admin'));
    if (!visible) {
      $('contenido-punto').innerHTML = '<div class="vacio"><h2>Centro de acopio no encontrado</h2><p>Puede que haya sido retirado o que aún no esté verificado.</p>' +
        '<a class="btn" href="Consulta.html">Ver centros de acopio</a></div>';
      return;
    }
    document.title = p.nombre + ' · ReciclaTech';
    $('p-nombre').textContent = p.nombre;
    $('p-ficha').innerHTML = App.badgeFicha(p);
    $('p-direccion').textContent = API.dirCompleta(p);
    $('p-residuos').innerHTML = App.chipsResiduos(p);
    $('p-horarios').innerHTML = App.tablaHorario(p);
    $('p-mapa').src = App.urlMapa(p);
    if (API.tieneUbicacion(p)) { $('p-enlace').href = App.urlMapaGrande(p); } else { $('p-enlace').hidden = true; }
    $('b-horarios').href = 'Horarios.html?id=' + p.id;
    $('b-reporte').href = 'Reporte.html?id=' + p.id;
  }

  // Muestra los horarios de un punto elegido desde un selector desplegable.
  function Horarios() {
    const sel = $('punto'); const cont = $('tabla');
    sel.innerHTML = App.opcionesPuntos(API.verificados(), App.parametro('id'));
    function pintar() {
      const p = API.punto(sel.value);
      if (!sel.value || !p) { cont.innerHTML = '<div class="vacio">Elige un centro de acopio para ver sus horarios.</div>'; return; }
      cont.innerHTML = App.tablaHorario(p) + '<p class="suave chico" style="margin-top:.6rem">' + E(API.dirCompleta(p)) + '</p>';
    }
    sel.addEventListener('change', pintar);
    $('consultar').addEventListener('click', pintar);
    pintar();
  }

  // pa que le puedas mandar un reporte al pinche admin de mierda
  function Reporte() {
    const f = $('form-reporte');
    f.punto.innerHTML = App.opcionesPuntos(API.verificados(), App.parametro('id'), 'Seleccione un punto');
    f.motivo.innerHTML = App.opcionesLista(API.MOTIVOS, '', 'Seleccione un motivo');
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!Validaciones.reporte(f)) return;
      App.ejecutar(async () => {
        await API.crearReporte({ puntoId: f.punto.value, motivo: f.motivo.value, descripcion: f.descripcion.value });
        f.reset(); App.aviso('Reporte enviado. Un administrador lo revisará.', 'ok');
      });
    });
    f.addEventListener('reset', () => App.limpiarMarcas(f));
  }

  return { MenuUsuario, Consulta, Buscar, Filtro, Punto, Horarios, Reporte };
})());
