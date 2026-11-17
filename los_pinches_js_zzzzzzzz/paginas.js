/* ReciclaTech · lógica de cada página (se ejecuta según <body data-pagina="...">) */
window.Paginas = (() => {
  const $ = (id) => document.getElementById(id);
  const E = App.esc;

  /* ===================== PÚBLICO ===================== */
  function Index() {
    $('form-inicio').addEventListener('submit', (e) => {
      e.preventDefault();
      const q = $('q-inicio').value.trim();
      location.href = 'Buscar.html' + (q ? '?q=' + encodeURIComponent(q) : '');
    });
    $('num-puntos').textContent = API.verificados().length;
  }

  function Registro() {
    const f = $('form-registro');
    f.addEventListener('submit', (e) => {
      e.preventDefault(); App.limpiarMarcas(f); App.mensaje('msg', '');
      let ok = App.requerido(f.nombre, 'Escribe tu nombre completo.');
      ok = App.requerido(f.email, 'Escribe tu correo electrónico.') && ok;
      ok = App.requerido(f.password, 'Crea una contraseña.') && ok;
      ok = App.requerido(f.confirmar, 'Confirma tu contraseña.') && ok;
      if (f.password.value && f.password.value.length < 12) {
        App.marcar(f.password, 'Usa al menos 12 caracteres.'); ok = false;
      }
      if (f.password.value && f.password.value !== f.confirmar.value) {
        App.marcar(f.confirmar, 'Las contraseñas no coinciden.'); ok = false;
      }
      if (!ok) { App.mensaje('msg', 'Revisa los campos marcados.', 'error'); return; }
      enviarCredenciales(f, true);
    });
    f.addEventListener('reset', () => { App.limpiarMarcas(f); App.mensaje('msg', ''); });
  }

  function Login() {
    const f = $('form-login');
    f.addEventListener('submit', (e) => {
      e.preventDefault(); App.limpiarMarcas(f); App.mensaje('msg', '');
      let ok = App.requerido(f.email, 'Escribe tu correo electrónico.');
      ok = App.requerido(f.password, 'Escribe tu contraseña.') && ok;
      if (!ok) return;
      enviarCredenciales(f, false);
    });
    f.addEventListener('reset', () => { App.limpiarMarcas(f); App.mensaje('msg', ''); });
  }

  async function enviarCredenciales(form, registrar) {
    const boton = form.querySelector('[type="submit"]');
    boton.disabled = true;
    App.mensaje('msg', '');
    try {
      const datos = {
        email: form.email.value.trim(),
        password: form.password.value
      };
      if (registrar) await API.registrar(Object.assign(datos, { nombre: form.nombre.value.trim() }));
      else await API.login(datos);
      const session = API.sesion();
      if (!session) throw new Error('No se pudo crear el perfil de ReciclaTech.');
      const next = App.parametro('next');
      const valido = next && /^[A-Za-z]+\.html(\?[\w=&%.-]*)?$/.test(next);
      location.href = valido ? next : App.menuPorRol(session.rol);
    } catch (error) {
      console.error(error);
      App.mensaje('msg', error.message || 'No se pudo completar el acceso.', 'error');
    } finally {
      boton.disabled = false;
    }
  }

  /* ===================== USUARIO ===================== */
  function MenuUsuario() {
    const s = API.sesion();
    $('saludo').textContent = 'Bienvenido, ' + s.nombre;
    const mis = API.reportes().filter((r) => r.usuarioId === s.id);
    $('mis-reportes').innerHTML = mis.length
      ? '<div class="tabla-wrap"><table><thead><tr><th>Centro de acopio</th><th>Motivo</th><th>Fecha</th><th>Estado</th></tr></thead><tbody>' +
        mis.slice().reverse().map((r) => '<tr><td>' + E(r.puntoNombre) + '</td><td>' + E(r.motivo) + '</td><td>' + API.fmtFecha(r.fecha) +
          '</td><td><span class="insignia ' + (r.estado === 'Alta' ? 'ok' : 'nuevo') + '">' + r.estado + '</span></td></tr>').join('') + '</tbody></table></div>'
      : '<div class="vacio">Aún no has enviado reportes.</div>';
  }

  function tarjetaPunto(p, extra) {
    return '<article class="punto-card" data-id="' + p.id + '"><h3>' + E(p.nombre) + '</h3>' +
      '<div class="suave chico">' + E(API.dirCompleta(p)) + '</div>' + (extra || '') +
      '<div class="acciones-card"><span>' + App.chipsResiduos(p) + '</span>' +
      '<a class="btn sec chico" href="Punto.html?id=' + p.id + '">Ver información</a></div></article>';
  }

  function Consulta() {
    const lista = $('lista'); const mapa = $('mapa'); const enlace = $('enlace-mapa');
    let seleccionado = null;
    function pintar() {
      const pts = API.buscar({ q: $('q').value });
      lista.innerHTML = pts.length ? pts.map((p) => tarjetaPunto(p)).join('') : '<div class="vacio">No hay centros que coincidan.</div>';
      $('cuenta').textContent = pts.length + ' centro(s) de acopio';
      lista.querySelectorAll('.punto-card').forEach((c) => c.addEventListener('click', (ev) => {
        if (ev.target.closest('a')) return;
        seleccionar(Number(c.dataset.id));
      }));
      if (seleccionado) { const c = lista.querySelector('[data-id="' + seleccionado + '"]'); if (c) c.classList.add('sel'); }
    }
    function seleccionar(id) {
      seleccionado = id; const p = API.punto(id);
      lista.querySelectorAll('.punto-card').forEach((c) => c.classList.toggle('sel', Number(c.dataset.id) === id));
      mapa.src = App.urlMapa(p);
      enlace.hidden = false; enlace.href = App.urlMapaGrande(p); enlace.textContent = 'Abrir ' + p.nombre + ' en el mapa';
    }
    $('form-buscar').addEventListener('submit', (e) => { e.preventDefault(); pintar(); });
    $('q').addEventListener('input', pintar);
    mapa.src = App.urlMapa(null);
    pintar();
  }

  function Buscar() {
    const tipos = (App.parametro('tipos') || '').split(',').filter(Boolean).map(Number);
    $('q').value = App.parametro('q') || '';
    const cont = $('resultados');
    function pintar() {
      const pts = API.buscar({ q: $('q').value, tipos });
      $('cuenta').textContent = pts.length + ' resultado(s)';
      cont.innerHTML = pts.length ? pts.map((p) => tarjetaPunto(p)).join('')
        : '<div class="vacio">No encontramos puntos con esos criterios. Prueba con menos filtros.</div>';
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
      const q = $('q').value.trim();
      location.href = 'Filtro.html' + (q ? '?q=' + encodeURIComponent(q) : '');
    });
    pintar();
  }

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
      $('vista').innerHTML = pts.slice(0, 4).map((p) => tarjetaPunto(p)).join('') || '<div class="vacio">Ningún punto recibe todos los tipos elegidos.</div>';
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

  function Reporte() {
    const f = $('form-reporte');
    f.punto.innerHTML = App.opcionesPuntos(API.verificados(), App.parametro('id'), 'Seleccione un punto');
    f.motivo.innerHTML = App.opcionesLista(API.MOTIVOS, '', 'Seleccione un motivo');
    f.addEventListener('submit', (e) => {
      e.preventDefault(); App.limpiarMarcas(f);
      let ok = App.requerido(f.punto, 'Elige el centro de acopio.');
      ok = App.requerido(f.motivo, 'Elige un motivo.') && ok;
      ok = App.requerido(f.descripcion, 'Describe lo ocurrido.') && ok;
      if (f.descripcion.value.trim() && f.descripcion.value.trim().length < 10) { App.marcar(f.descripcion, 'Describe con al menos 10 caracteres.'); ok = false; }
      if (!ok) return;
      App.ejecutar(async () => {
        await API.crearReporte({ puntoId: f.punto.value, motivo: f.motivo.value, descripcion: f.descripcion.value });
        f.reset(); App.aviso('Reporte enviado. Un administrador lo revisará.', 'ok');
      });
    });
    f.addEventListener('reset', () => App.limpiarMarcas(f));
  }

  /* ===================== ADMINISTRADOR ===================== */
  function MenuAdmin() {
    const pts = API.todos();
    $('s-puntos').textContent = pts.length;
    $('s-fichas').textContent = pts.filter((p) => p.ficha.estado !== 'verificada').length;
    $('s-reportes').textContent = API.reportes().filter((r) => r.estado === 'Nuevo').length;
    const b = API.bitacora().slice(0, 8);
    $('bitacora').innerHTML = b.length
      ? '<div class="tabla-wrap"><table><thead><tr><th>Fecha</th><th>Administrador</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>' +
        b.map((x) => '<tr><td>' + API.fmtFecha(x.fecha) + '</td><td>' + E(x.admin) + '</td><td>' + E(x.accion) + '</td><td>' + E(x.detalle) + '</td></tr>').join('') + '</tbody></table></div>'
      : '<div class="vacio">Todavía no hay modificaciones registradas.</div>';
  }

  function AdmPuntos() {
    const f = $('form-punto'); let editando = null;
    f.alcaldia.innerHTML = App.opcionesLista(API.ALCALDIAS, '', 'Seleccione');
    function tabla() {
      const pts = API.todos();
      $('tbody').innerHTML = pts.map((p) => '<tr><td>' + E(p.nombre) + '</td><td>' + E(p.alcaldia) + '</td><td>' + App.badgeFicha(p) +
        '</td><td><button class="btn sec chico" data-ed="' + p.id + '" type="button">Editar</button>' +
        '<button class="btn peligro chico" data-el="' + p.id + '" type="button">Eliminar</button></td></tr>').join('') ||
        '<tr><td colspan="4" class="suave">No hay puntos registrados.</td></tr>';
      $('tbody').querySelectorAll('[data-ed]').forEach((b) => b.addEventListener('click', () => cargar(Number(b.dataset.ed))));
      $('tbody').querySelectorAll('[data-el]').forEach((b) => b.addEventListener('click', () => {
        const p = API.punto(b.dataset.el);
        if (confirm('¿Eliminar "' + p.nombre + '"? Esta acción no se puede deshacer.')) {
          App.ejecutar(async () => {
            await API.eliminarPunto(p.id);
            if (editando === p.id) nuevo(); tabla(); App.aviso('Punto eliminado.', 'ok');
          });
        }
      }));
    }
    function cargar(id) {
      const p = API.punto(id); editando = id;
      f.nombre.value = p.nombre; f.calle.value = p.calle; f.alcaldia.value = p.alcaldia;
      $('titulo-form').textContent = 'Editar punto'; App.limpiarMarcas(f); f.nombre.focus();
    }
    function nuevo() { editando = null; f.reset(); $('titulo-form').textContent = 'Nuevo punto'; App.limpiarMarcas(f); }
    $('nuevo').addEventListener('click', () => { nuevo(); f.nombre.focus(); });
    $('cancelar').addEventListener('click', nuevo);
    f.addEventListener('submit', (e) => {
      e.preventDefault(); App.limpiarMarcas(f);
      let ok = App.requerido(f.nombre, 'Escribe el nombre.');
      ok = App.requerido(f.calle, 'Escribe la dirección.') && ok;
      ok = App.requerido(f.alcaldia, 'Elige la alcaldía.') && ok;
      if (!ok) { App.aviso('Completa los datos obligatorios antes de guardar.', 'error'); return; }
      App.ejecutar(async () => {
        await API.guardarPunto({ nombre: f.nombre.value.trim(), calle: f.calle.value.trim(), alcaldia: f.alcaldia.value }, editando);
        App.aviso(editando ? 'Punto actualizado.' : 'Punto creado. Falta verificar su ficha.', 'ok');
        nuevo(); tabla();
      });
    });
    tabla();
  }

  function Ficha() {
    const sel = $('punto'); const f = $('form-ficha');
    sel.innerHTML = App.opcionesPuntos(API.todos(), App.parametro('id'));
    function cargar(conservarMensaje) {
      const p = API.punto(sel.value); App.limpiarMarcas(f); if (conservarMensaje !== true) App.mensaje('msg', '');
      $('estado').innerHTML = p ? App.badgeFicha(p) : '<span class="insignia pend">Sin punto</span>';
      f.numero.value = p ? p.ficha.numero : ''; f.fecha.value = p ? p.ficha.fecha : '';
      $('archivo-actual').textContent = p && p.ficha.archivo ? 'Archivo registrado: ' + p.ficha.archivo : 'Aún no hay archivo registrado.';
      f.archivo.value = '';
    }
    sel.addEventListener('change', () => cargar());
    $('verificar').addEventListener('click', () => {
      App.limpiarMarcas(f); App.mensaje('msg', '');
      const p = API.punto(sel.value);
      let ok = App.requerido(sel, 'Elige un punto.');
      ok = App.requerido(f.numero, 'Escribe el número de resolución.') && ok;
      ok = App.requerido(f.fecha, 'Indica la fecha de emisión.') && ok;
      const nombreArchivo = f.archivo.files[0] ? f.archivo.files[0].name : (p ? p.ficha.archivo : '');
      if (!nombreArchivo) { App.marcar(f.archivo, 'Adjunta la ficha oficial (PDF).'); ok = false; }
      if (!ok) return;
      if (!API.tieneUbicacion(p)) { App.mensaje('msg', 'Registra primero la ubicación del punto (sección Ubicación).', 'error'); return; }
      App.ejecutar(async () => {
        await API.actualizarPunto(p.id, { ficha: { numero: f.numero.value.trim(), fecha: f.fecha.value, archivo: nombreArchivo, estado: 'verificada' } }, 'Ficha verificada');
        App.mensaje('msg', 'Ficha verificada. El punto ya es visible para los usuarios.', 'ok'); cargar(true);
      });
    });
    $('revocar').addEventListener('click', () => {
      const p = API.punto(sel.value); if (!p) { App.requerido(sel, 'Elige un punto.'); return; }
      App.ejecutar(async () => {
        await API.actualizarPunto(p.id, { ficha: Object.assign({}, p.ficha, { estado: 'pendiente' }) }, 'Verificación de ficha retirada');
        App.mensaje('msg', 'El punto quedó pendiente de verificación y se oculta a los usuarios.', 'info'); cargar(true);
      });
    });
    cargar();
  }

  function AdmResiduos() {
    const sel = $('punto'); const caja = $('tipos');
    sel.innerHTML = App.opcionesPuntos(API.todos(), App.parametro('id'));
    function pintar() {
      const p = API.punto(sel.value);
      caja.innerHTML = API.residuos().map((r) => '<label class="check"><input type="checkbox" value="' + r.id + '"' +
        (p && p.residuos.includes(r.id) ? ' checked' : '') + (p ? '' : ' disabled') + '> ' + E(r.nombre) + '</label>').join('');
    }
    sel.addEventListener('change', pintar);
    $('agregar').addEventListener('click', () => {
      const c = $('nuevo-tipo'); if (!App.requerido(c, 'Escribe el nombre del tipo de residuo.')) return;
      App.ejecutar(async () => {
        await API.agregarResiduo(c.value);
        c.value = ''; App.marcar(c, ''); App.aviso('Tipo de residuo agregado.', 'ok'); pintar();
      });
    });
    $('guardar').addEventListener('click', () => {
      if (!App.requerido(sel, 'Elige un punto.')) return;
      const ids = Array.from(caja.querySelectorAll('input:checked')).map((i) => Number(i.value));
      if (!ids.length) { App.aviso('Marca al menos un tipo de residuo.', 'error'); return; }
      App.ejecutar(async () => {
        await API.actualizarPunto(sel.value, { residuos: ids }, 'Tipos de residuos actualizados');
        App.aviso('Tipos de residuos guardados.', 'ok'); pintar();
      });
    });
    $('cancelar').addEventListener('click', pintar);
    pintar();
  }

  function AdmHorarios() {
    const sel = $('punto'); const tb = $('tbody');
    sel.innerHTML = App.opcionesPuntos(API.todos(), App.parametro('id'));
    function pintar() {
      const p = API.punto(sel.value);
      tb.innerHTML = API.DIAS.map((d) => {
        const h = p ? p.horarios[d] : { abre: '', cierra: '', cerrado: false };
        const dis = p ? '' : ' disabled';
        return '<tr data-d="' + d + '"><td>' + API.NOMBRE_DIA[d] + '</td><td><input type="time" class="a" value="' + (h.abre || '') + '"' + dis +
          ' aria-label="Apertura ' + API.NOMBRE_DIA[d] + '"></td><td><input type="time" class="c" value="' + (h.cierra || '') + '"' + dis +
          ' aria-label="Cierre ' + API.NOMBRE_DIA[d] + '"></td><td><label class="check"><input type="checkbox" class="x"' + (h.cerrado ? ' checked' : '') + dis +
          '> Cerrado</label></td></tr>';
      }).join('');
    }
    sel.addEventListener('change', pintar);
    $('guardar').addEventListener('click', () => {
      if (!App.requerido(sel, 'Elige un punto.')) return;
      const nuevo = {}; let error = '';
      tb.querySelectorAll('tr').forEach((tr) => {
        const d = tr.dataset.d; const a = tr.querySelector('.a'); const c = tr.querySelector('.c'); const x = tr.querySelector('.x').checked;
        a.classList.remove('invalido'); c.classList.remove('invalido');
        if (!x && (!a.value || !c.value || a.value >= c.value)) {
          a.classList.add('invalido'); c.classList.add('invalido');
          error = error || 'Revisa ' + API.NOMBRE_DIA[d] + ': indica apertura y cierre (la apertura debe ser antes del cierre) o márcalo como cerrado.';
        }
        nuevo[d] = { abre: x ? '' : a.value, cierra: x ? '' : c.value, cerrado: x };
      });
      if (error) { App.aviso(error, 'error'); return; }
      App.ejecutar(async () => {
        await API.actualizarPunto(sel.value, { horarios: nuevo }, 'Horarios actualizados');
        App.aviso('Horarios guardados.', 'ok'); pintar();
      });
    });
    $('cancelar').addEventListener('click', pintar);
    pintar();
  }

  function AdmUbicacion() {
    const sel = $('punto'); const f = $('form-ubicacion'); const mapa = $('mapa');
    sel.innerHTML = App.opcionesPuntos(API.todos(), App.parametro('id'));
    f.alcaldia.innerHTML = App.opcionesLista(API.ALCALDIAS, '', 'Seleccione');
    function cargar() {
      const p = API.punto(sel.value); App.limpiarMarcas(f);
      f.calle.value = p ? p.calle : ''; f.colonia.value = p ? p.colonia : ''; f.alcaldia.value = p ? p.alcaldia : '';
      f.cp.value = p ? p.cp : ''; f.lat.value = p && API.tieneUbicacion(p) ? p.lat : ''; f.lng.value = p && API.tieneUbicacion(p) ? p.lng : '';
      vista();
    }
    function vista() {
      const lat = parseFloat(f.lat.value); const lng = parseFloat(f.lng.value);
      mapa.src = App.urlMapa(isNaN(lat) || isNaN(lng) ? null : { lat, lng });
    }
    sel.addEventListener('change', cargar);
    f.lat.addEventListener('change', vista); f.lng.addEventListener('change', vista);
    f.addEventListener('submit', (e) => {
      e.preventDefault(); App.limpiarMarcas(f);
      let ok = App.requerido(sel, 'Elige un punto.');
      ['calle', 'colonia', 'alcaldia', 'cp', 'lat', 'lng'].forEach((n) => { ok = App.requerido(f[n], 'Obligatorio.') && ok; });
      const lat = parseFloat(f.lat.value); const lng = parseFloat(f.lng.value);
      if (f.cp.value && !/^\d{5}$/.test(f.cp.value.trim())) { App.marcar(f.cp, 'Debe tener 5 dígitos.'); ok = false; }
      if (f.lat.value && (isNaN(lat) || lat < 19.0 || lat > 19.65)) { App.marcar(f.lat, 'Latitud fuera de la Ciudad de México (≈19.0 a 19.65).'); ok = false; }
      if (f.lng.value && (isNaN(lng) || lng < -99.4 || lng > -98.9)) { App.marcar(f.lng, 'Longitud fuera de la Ciudad de México (≈ -99.4 a -98.9).'); ok = false; }
      if (!ok) { App.aviso('Completa y corrige los datos de ubicación.', 'error'); return; }
      App.ejecutar(async () => {
        await API.actualizarPunto(sel.value, { calle: f.calle.value.trim(), colonia: f.colonia.value.trim(), alcaldia: f.alcaldia.value,
          cp: f.cp.value.trim(), lat, lng }, 'Ubicación actualizada');
        App.aviso('Ubicación guardada.', 'ok'); cargar();
      });
    });
    f.addEventListener('reset', () => setTimeout(cargar, 0));
    cargar();
  }

  function AdmReportes() {
    function pintar() {
      const est = $('estado').value; const q = API.norm($('q').value);
      const rs = API.reportes().filter((r) => (!est || r.estado === est) &&
        (!q || API.norm([r.puntoNombre, r.usuario, r.motivo, r.id].join(' ')).includes(q)));
      $('tbody').innerHTML = rs.map((r) => '<tr><td>' + r.id + '</td><td>' + E(r.puntoNombre) + '</td><td>' + E(r.usuario) + '</td><td>' + API.fmtFecha(r.fecha) +
        '</td><td><span class="insignia ' + (r.estado === 'Alta' ? 'ok' : 'nuevo') + '">' + r.estado + '</span></td><td>' +
        '<button class="btn sec chico" data-c="' + r.id + '" type="button">Consultar</button>' +
        (r.estado === 'Nuevo' ? '<button class="btn chico" data-a="' + r.id + '" type="button">Dar de alta</button>' : '') +
        '<button class="btn peligro chico" data-e="' + r.id + '" type="button">Eliminar</button></td></tr>').join('') ||
        '<tr><td colspan="6" class="suave">No hay reportes con esos criterios.</td></tr>';
      const tb = $('tbody');
      tb.querySelectorAll('[data-c]').forEach((b) => b.addEventListener('click', () => detalle(Number(b.dataset.c))));
      tb.querySelectorAll('[data-a]').forEach((b) => b.addEventListener('click', () => App.ejecutar(async () => {
        await API.darDeAltaReporte(Number(b.dataset.a));
        App.aviso('Reporte dado de alta.', 'ok'); pintar(); detalle(Number(b.dataset.a));
      })));
      tb.querySelectorAll('[data-e]').forEach((b) => b.addEventListener('click', () => {
        if (confirm('¿Eliminar el reporte #' + b.dataset.e + '?')) App.ejecutar(async () => {
          await API.eliminarReporte(Number(b.dataset.e));
          $('detalle').hidden = true; pintar(); App.aviso('Reporte eliminado.', 'ok');
        });
      }));
    }
    function detalle(id) {
      const r = API.reportes().find((x) => x.id === id); const d = $('detalle');
      if (!r) { d.hidden = true; return; }
      d.hidden = false;
      d.innerHTML = '<h2>Reporte #' + r.id + '</h2><p><strong>Centro de acopio:</strong> ' + E(r.puntoNombre) + '<br><strong>Usuario:</strong> ' + E(r.usuario) +
        '<br><strong>Fecha:</strong> ' + API.fmtFecha(r.fecha) + '<br><strong>Motivo:</strong> ' + E(r.motivo) + '<br><strong>Estado:</strong> ' + r.estado +
        '</p><p><strong>Descripción:</strong><br>' + E(r.descripcion) + '</p>';
    }
    $('estado').addEventListener('change', pintar); $('q').addEventListener('input', pintar);
    $('form-filtro').addEventListener('submit', (e) => { e.preventDefault(); pintar(); });
    pintar();
  }

  return { Index, Registro, Login, MenuUsuario, Consulta, Buscar, Filtro, Punto, Horarios, Reporte,
    MenuAdmin, AdmPuntos, Ficha, AdmResiduos, AdmHorarios, AdmUbicacion, AdmReportes };
})();
