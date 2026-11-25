//vamos a ello

window.Paginas = window.Paginas || {};
Object.assign(window.Paginas, (() => {
    const $ = (id) => document.getElementById(id);
    const E = App.esc;
    /* ADMINIS DE DISC XD
    seccion de los admins que tiene = panel central para gestionar
    los puntos, fichas, residuos, etc alch me dio hueva seguir
    poniendo xd

    en esto vasicamente checa datos cambia estados y revisa incidencias*/

    function MenuAdmin(){
        const pts = API.todos();
        $('s-puntos').textContent = pts.length;
        $('s-reportes').textContent = API.reportes().filter((r) => r.estado === 'Nuevo').length;
        $('s-fichas').textContent = pts.filter((p) => p.ficha.estado !== 'verificada').length;
        const b = API.bitacora().slice(0, 8);
        $('bitacora').innerHTML = b.length
            ? '<div class = "tabla-wrap"><table><thead><tr><th>Fecha</th><th>Administrador</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>' +
                b.map((x) => `<tr><td>` + API.fmtFecha(x.fecha) + `</td><td>` + E(x.admin) + `</td><td>` + E(x.accion) + `</td><td>` + E(x.detalle) + `</td></tr>`).join('') + `</tbody></table></div>`
            : '<div class="vacio">Aún no hay actividad registrada.</div>';
    }

    //se viene el pinche crud = crea edita y elima leer me lo paso por los huevos mis dos huevotes
    function AdmPuntos() {
      function tabla() {
        const pts = API.todos();
        $('tbody').innerHTML = pts.map((p) => '<tr><td>' + E(p.nombre) + '</td><td>' + E(p.alcaldia) + '</td><td>' + App.badgeFicha(p) +
          '</td><td><a class="btn sec chico" href="AdmPuntoNuevo.html?id=' + p.id + '">Editar</a>' +
          '<button class="btn peligro chico" data-el="' + p.id + '" type="button">Eliminar</button></td></tr>').join('') ||
          '<tr><td colspan="4" class="suave">No hay puntos registrados.</td></tr>';
        $('tbody').querySelectorAll('[data-el]').forEach((b) => b.addEventListener('click', () => {
          const p = API.punto(b.dataset.el);
          if (!p) { tabla(); return; }
          if (confirm('¿Eliminar el punto "' + p.nombre + '"? No se puede deshacer.')) {
            App.ejecutar(async () => {
              await API.eliminarPunto(p.id);
              tabla(); App.aviso('El punto fue eliminado.', 'ok');
            });
          }
        }));
      }
      tabla();
    }

    function AdmPuntoNuevo() {
      const f = $('form-punto-nuevo');
      const tb = $('horarios-tbody');
      const tipos = $('tipos');
      const tiposError = $('tipos-error');
      const mapa = $('mapa');
      const guardar = $('guardar');
      const siguiente = $('siguiente');
      const anterior = $('anterior');
      const indicador = $('paso-indicador');
      const pasos = Array.from(f.querySelectorAll('.paso'));
      const id = App.parametro('id');
      const editando = id ? API.punto(id) : null;
      let paso = 1;

      if (id && !editando) {
        App.avisoDiferido('El punto que intentas editar ya no existe.', 'error');
        location.replace('AdmPuntos.html');
        return;
      }

      f.alcaldia.innerHTML = App.opcionesLista(API.ALCALDIAS, editando ? editando.alcaldia : '', 'Seleccione');

      const base = {};
      API.DIAS.forEach((d) => { base[d] = { abre: '09:00', cierra: '17:00', cerrado: false }; });
      base.sabado = { abre: '', cierra: '', cerrado: true };
      base.domingo = { abre: '', cierra: '', cerrado: true };
      const horarios = editando ? editando.horarios : base;

      tb.innerHTML = API.DIAS.map((d) => {
        const h = horarios[d] || base[d];
        return '<tr data-d="' + d + '"><td>' + API.NOMBRE_DIA[d] + '</td>' +
          '<td><input type="time" class="a" value="' + (h.abre || '') + '" aria-label="Apertura ' + API.NOMBRE_DIA[d] + '"></td>' +
          '<td><input type="time" class="c" value="' + (h.cierra || '') + '" aria-label="Cierre ' + API.NOMBRE_DIA[d] + '"></td>' +
          '<td><label class="check"><input type="checkbox" class="x"' + (h.cerrado ? ' checked' : '') + '> Cerrado</label></td></tr>';
      }).join('');

      tipos.innerHTML = API.residuos().map((r) => '<label class="check"><input type="checkbox" value="' + r.id + '"' +
        (editando && editando.residuos.includes(r.id) ? ' checked' : '') + '> ' + E(r.nombre) + '</label>').join('') ||
        '<p class="suave chico">No hay tipos de residuo registrados.</p>';

      function alternarDia(fila) {
        const cerrado = fila.querySelector('.x').checked;
        fila.querySelectorAll('input[type="time"]').forEach((i) => { i.disabled = cerrado; });
      }
      tb.querySelectorAll('tr[data-d]').forEach(alternarDia);
      tb.addEventListener('change', (e) => {
        if (e.target.classList.contains('x')) alternarDia(e.target.closest('tr'));
      });
      tipos.addEventListener('change', () => {
        if (tipos.querySelector('input:checked')) tiposError.textContent = '';
      });

      if (editando) {
        document.title = 'Editar punto de recepción · ReciclaTech';
        $('titulo').textContent = 'Editar punto de recepción';
        $('subtitulo').textContent = 'Actualiza los datos y guarda los cambios.';
        $('nota-ficha').textContent = 'La ficha del punto se gestiona en la sección Ficha del punto.';
        guardar.textContent = 'Guardar cambios';
        f.nombre.value = editando.nombre;
        f.calle.value = editando.calle;
        f.colonia.value = editando.colonia || '';
        f.cp.value = editando.cp || '';
        f.lat.value = editando.lat != null ? editando.lat : '';
        f.lng.value = editando.lng != null ? editando.lng : '';
      }

      function vista() {
        const lat = f.lat.value.trim();
        const lng = f.lng.value.trim();
        const punto = {
          cp: f.cp.value.trim(),
          alcaldia: f.alcaldia.value,
          lat: lat === '' || Number.isNaN(Number(lat)) ? null : Number(lat),
          lng: lng === '' || Number.isNaN(Number(lng)) ? null : Number(lng)
        };
        mapa.src = App.urlMapa(punto);
      }
      f.cp.addEventListener('input', vista);
      f.alcaldia.addEventListener('change', vista);
      f.lat.addEventListener('input', vista);
      f.lng.addEventListener('input', vista);
      vista();

      function residuosSeleccionados() {
        return Array.from(tipos.querySelectorAll('input:checked')).map((i) => Number(i.value));
      }

      function validarPaso(n) {
        if (n === 1) return Validaciones.puntoCompleto(f);
        if (n === 2) return Validaciones.coordenadas(f);
        if (n === 3) return Boolean(Validaciones.horariosTabla(tb));
        if (n === 4) {
          if (!residuosSeleccionados().length) {
            tiposError.textContent = 'Selecciona al menos un tipo de residuo.';
            return false;
          }
          tiposError.textContent = '';
          return true;
        }
        return true;
      }

      function mostrarPaso(n) {
        paso = Math.min(Math.max(n, 1), pasos.length);
        pasos.forEach((seccion, i) => { seccion.hidden = i + 1 !== paso; });
        indicador.textContent = 'Paso ' + paso + ' de ' + pasos.length;
        anterior.hidden = paso === 1;
        siguiente.hidden = paso === pasos.length;
        guardar.hidden = paso !== pasos.length;
        const visible = pasos[paso - 1];
        const primero = visible.querySelector('input:not([type="hidden"]), select, textarea');
        if (primero && paso > 1) primero.focus({ preventScroll: true });
        visible.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      siguiente.addEventListener('click', () => {
        if (!validarPaso(paso)) return;
        mostrarPaso(paso + 1);
      });
      anterior.addEventListener('click', () => mostrarPaso(paso - 1));

      f.addEventListener('submit', (e) => {
        e.preventDefault();
        for (let n = 1; n <= pasos.length; n++) {
          if (!validarPaso(n)) { mostrarPaso(n); return; }
        }
        const horariosNuevos = Validaciones.horariosTabla(tb);
        if (!horariosNuevos) { mostrarPaso(3); return; }
        const datos = {
          nombre: f.nombre.value.trim(),
          calle: f.calle.value.trim(),
          colonia: f.colonia.value.trim(),
          alcaldia: f.alcaldia.value,
          cp: f.cp.value.trim(),
          lat: f.lat.value.trim(),
          lng: f.lng.value.trim(),
          horarios: horariosNuevos,
          residuos: residuosSeleccionados()
        };
        App.ejecutar(async () => {
          guardar.disabled = true;
          try {
            await API.guardarPunto(datos, editando ? editando.id : null);
            App.avisoDiferido(editando ? 'Punto actualizado.' : 'Punto creado. Ya puedes completar su ficha.', 'ok');
            location.href = 'AdmPuntos.html';
          } finally {
            guardar.disabled = false;
          }
        });
      });

      mostrarPaso(1);
    }

  //esta miercoles es pa verificar fichas oficiales de cada puntico
  //aqui se valida la ficha, se adjunta el archivo y se cambia el estado de verificacion del centro
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
      const p = API.punto(sel.value);
      const nombreArchivo = Validaciones.ficha(sel, f, p);
      if (!nombreArchivo) return;
      App.ejecutar(async () => {
        await API.actualizarPunto(p.id, { ficha: { numero: f.numero.value.trim(), fecha: f.fecha.value, archivo: nombreArchivo, estado: 'verificada' } }, 'Ficha verificada');
        App.mensaje('msg', 'Ficha verificada correctamente.', 'ok'); cargar(true);
      });
    });
    $('revocar').addEventListener('click', () => {
      const p = API.punto(sel.value); if (!p) { App.requerido(sel, 'Elige un punto.'); return; }
      App.ejecutar(async () => {
        await API.actualizarPunto(p.id, { ficha: Object.assign({}, p.ficha, { estado: 'pendiente' }) }, 'Verificación de ficha retirada');
        App.mensaje('msg', 'La verificación fue retirada; el centro no se mostrará como verificado.', 'info'); cargar(true);
      });
    });
    cargar();
  }

  //esta madre es pa poner los residuos aceptados por cada centro vaca
  // otro pinche crud sin crud porque tengo unos huevotes


  // ASI DE PUTAS GRANDES CARAJO
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
      const c = $('nuevo-tipo');
      if (!Validaciones.nuevoResiduo(c)) return;
      App.ejecutar(async () => {
        await API.agregarResiduo(c.value);
        c.value = ''; App.marcar(c, ''); App.aviso('Tipo de residuo agregado.', 'ok'); pintar();
      });
    });
    $('guardar').addEventListener('click', () => {
      const ids = Array.from(caja.querySelectorAll('input:checked')).map((i) => Number(i.value));
      if (!Validaciones.guardarResiduos(sel, ids)) return;
      App.ejecutar(async () => {
        await API.actualizarPunto(sel.value, { residuos: ids }, 'Tipos de residuos actualizados');
        App.aviso('Tipos de residuos guardados.', 'ok'); pintar();
      });
    });
    $('cancelar').addEventListener('click', pintar);
    pintar();
  }

  // wuachate este pedo ojo esto es una pequeña validacion voy a crear un archivo de validaciones pero ps me vale
  // verga puto alch lo meti aqui por accesibilidad checa que sea mayor la de cierre a la de apertura
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
      const nuevo = Validaciones.horarios(sel, tb);
      if (!nuevo) return;
      App.ejecutar(async () => {
        await API.actualizarPunto(sel.value, { horarios: nuevo }, 'Horarios actualizados');
        App.aviso('Horarios guardados.', 'ok'); pintar();
      });
    });
    $('cancelar').addEventListener('click', pintar);
    pintar();
  }

  // a su puta madre esto es pa administrar que si exista pue
  // controla los datos del centro y actualiza la vista previa en el mapa de mierda
  // aqui la puta ia metio latitud y longitud sacate alv che pendeja xdd ahi te va

  function AdmUbicacion() {
    const sel = $('punto'); const f = $('form-ubicacion'); const mapa = $('mapa');
    sel.innerHTML = App.opcionesPuntos(API.todos(), App.parametro('id'));
    f.alcaldia.innerHTML = App.opcionesLista(API.ALCALDIAS, '', 'Seleccione');
    function cargar() {
      const p = API.punto(sel.value); App.limpiarMarcas(f);
      f.calle.value = p ? p.calle : ''; f.colonia.value = p ? p.colonia : ''; f.alcaldia.value = p ? p.alcaldia : '';
      f.cp.value = p ? p.cp || '' : '';
      f.lat.value = p && p.lat != null ? p.lat : '';
      f.lng.value = p && p.lng != null ? p.lng : '';
      vista();
    }
    function vista() {
      const lat = f.lat.value.trim();
      const lng = f.lng.value.trim();
      const punto = {
        cp: f.cp.value.trim(),
        alcaldia: f.alcaldia.value,
        lat: lat === '' || Number.isNaN(Number(lat)) ? null : Number(lat),
        lng: lng === '' || Number.isNaN(Number(lng)) ? null : Number(lng)
      };
      mapa.src = App.urlMapa(punto);
    }
    sel.addEventListener('change', cargar);
    f.cp.addEventListener('input', vista); f.alcaldia.addEventListener('change', vista);
    f.lat.addEventListener('input', vista); f.lng.addEventListener('input', vista);
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!Validaciones.ubicacion(sel, f)) return;
      App.ejecutar(async () => {
        await API.actualizarPunto(sel.value, { calle: f.calle.value.trim(), colonia: f.colonia.value.trim(), alcaldia: f.alcaldia.value,
          cp: f.cp.value.trim(), lat: f.lat.value.trim(), lng: f.lng.value.trim() }, 'Ubicación actualizada');
        App.aviso('Ubicación guardada.', 'ok'); cargar();
      });
    });
    f.addEventListener('reset', () => setTimeout(cargar, 0));
    cargar();
  }

  //ojo se viene la pinche gestion de reportes de usuarios
  //permite filtrar, consultar, aprobar o devolver con una explicacion para el usuario
  function AdmReportes() {
    const claseEstado = (estado) => estado === 'Alta' ? 'ok' : estado === 'Devuelto' ? 'devuelto' : 'nuevo';

    function pintar() {
      const est = $('estado').value; const q = API.norm($('q').value);
      const rs = API.reportes().filter((r) => (!est || r.estado === est) &&
        (!q || API.norm([r.puntoNombre, r.usuario, r.motivo, r.descripcion, r.respuestaAdmin, r.id].join(' ')).includes(q)));
      $('tbody').innerHTML = rs.map((r) => '<tr><td>' + r.id + '</td><td>' + E(r.puntoNombre) + '</td><td>' + E(r.usuario) + '</td><td>' + API.fmtFecha(r.fecha) +
        '</td><td><span class="insignia ' + claseEstado(r.estado) + '">' + E(r.estado) + '</span></td><td>' +
        '<button class="btn sec chico" data-c="' + r.id + '" type="button">Revisar</button>' +
        '<button class="btn peligro chico" data-e="' + r.id + '" type="button">Eliminar</button></td></tr>').join('') ||
        '<tr><td colspan="6" class="suave">No hay reportes con esos criterios.</td></tr>';
      const tb = $('tbody');
      tb.querySelectorAll('[data-c]').forEach((b) => b.addEventListener('click', () => detalle(Number(b.dataset.c))));
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
      d.innerHTML = '<h2>Reporte #' + r.id + '</h2><p><strong>Centro de acopio:</strong> ' + E(r.puntoNombre) +
        '<br><strong>Usuario:</strong> ' + E(r.usuario) +
        '<br><strong>Fecha:</strong> ' + API.fmtFecha(r.fecha) +
        '<br><strong>Motivo:</strong> ' + E(r.motivo) +
        '<br><strong>Estado:</strong> <span class="insignia ' + claseEstado(r.estado) + '">' + E(r.estado) + '</span>' +
        '</p><p><strong>Descripción del usuario:</strong><br>' + E(r.descripcion) + '</p>' +
        '<p><strong>Respuesta actual del administrador:</strong><br>' +
        (r.respuestaAdmin ? E(r.respuestaAdmin) : '<span class="suave">Sin respuesta registrada.</span>') + '</p>' +
        '<form id="form-respuesta-reporte" novalidate>' +
        '<div class="campo"><label for="respuesta-admin">Explicación para el usuario</label>' +
        '<textarea id="respuesta-admin" name="respuesta" rows="3" maxlength="500" placeholder="Explica por qué se aprueba o por qué se devuelve el reporte.">' +
        E(r.respuestaAdmin) + '</textarea><div class="error-campo" aria-live="polite"></div></div>' +
        '<div class="fila-botones">' +
        '<button class="btn" type="button" data-responder="Alta">Aprobar reporte</button>' +
        '<button class="btn peligro" type="button" data-responder="Devuelto">Devolver reporte</button>' +
        '</div></form>';

      const form = $('form-respuesta-reporte');
      form.querySelectorAll('[data-responder]').forEach((b) => b.addEventListener('click', () => {
        const respuesta = form.respuesta.value.trim();
        if (!respuesta) {
          App.marcar(form.respuesta, 'Escribe la explicación para el usuario.');
          return;
        }
        App.marcar(form.respuesta, '');
        const estado = b.dataset.responder;
        App.ejecutar(async () => {
          b.disabled = true;
          try {
            await API.responderReporte(r.id, estado, respuesta);
            App.aviso(estado === 'Alta' ? 'Reporte aprobado.' : 'Reporte devuelto.', 'ok');
            pintar(); detalle(r.id);
          } finally {
            b.disabled = false;
          }
        });
      }));
    }

    $('estado').addEventListener('change', pintar); $('q').addEventListener('input', pintar);
    $('form-filtro').addEventListener('submit', (e) => { e.preventDefault(); pintar(); });
    pintar();
  }

  return { MenuAdmin, AdmPuntos, AdmPuntoNuevo, Ficha, AdmResiduos, AdmHorarios, AdmUbicacion, AdmReportes };
})());