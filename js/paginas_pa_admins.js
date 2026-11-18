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
        $('bitacora').textContent = b.length
            ? '<div class = "tabla-wrap"><table><thead><tr><th>Fecha</th><th>Administrador</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>' +
                b.map((x) => `<tr><td>` + API.fmtFecha(x.fecha) + `</td><td>` + E(x.admin) + `</td><td>` + E(x.accion) + `</td><td>` + E(x.detalle) + `</td></tr>`).join('') + `</tbody></table></div>`
            : '<div class="vacio">Aún no hay actividad registrada.</div>';
    }

    //se viene el pinche crud = crea edita y elima leer me lo paso por los huevos mis dos huevotes
    function AdmPuntos() {
    
    //el pinchi delete
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
        if (confirm('vas a elimar "' + p.nombre + '"? seguro w? no se puede deshacer')) {
          App.ejecutar(async () => {
            await API.eliminarPunto(p.id);
            if (editando === p.id) nuevo(); tabla(); App.aviso('El punto fue eliminado.', 'XD');
          });
        }
      }));
    }

    //editar puntico
    function cargar(id) {
      const p = API.punto(id); editando = id;
      f.nombre.value = p.nombre; f.calle.value = p.calle; f.alcaldia.value = p.alcaldia;
      $('titulo-form').textContent = 'Editar punto'; App.limpiarMarcas(f); f.nombre.focus();
    }

    // crear otro puntico
    function nuevo() { editando = null; f.reset(); $('titulo-form').textContent = 'Nuevo punto'; App.limpiarMarcas(f); }
    $('nuevo').addEventListener('click', () => { nuevo(); f.nombre.focus(); });
    $('cancelar').addEventListener('click', nuevo);
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!Validaciones.punto(f)) return;
      App.ejecutar(async () => {
        await API.guardarPunto({ nombre: f.nombre.value.trim(), calle: f.calle.value.trim(), alcaldia: f.alcaldia.value }, editando);
        App.aviso(editando ? 'Punto actualizado.' : 'Punto creado. Falta verificar que ps si exista', 'ok');
        nuevo(); tabla();
      });
    });
    tabla();
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
        App.mensaje('msg', 'ya ta mi jefe ya quedo pa todos fifiififi', 'ok'); cargar(true);
      });
    });
    $('revocar').addEventListener('click', () => {
      const p = API.punto(sel.value); if (!p) { App.requerido(sel, 'Elige un punto.'); return; }
      App.ejecutar(async () => {
        await API.actualizarPunto(p.id, { ficha: Object.assign({}, p.ficha, { estado: 'pendiente' }) }, 'Verificación de ficha retirada');
        App.mensaje('msg', 'ora si jefe que como aun no se verifica no se va a mostrar a los demas vaca va', 'info'); cargar(true);
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
      vista();
    }
    function vista() {
      const punto = {
        cp: f.cp.value.trim(),
        alcaldia: f.alcaldia.value
      };
      mapa.src = App.urlMapa(API.tieneUbicacion(punto) ? punto : null);
    }
    sel.addEventListener('change', cargar);
    f.cp.addEventListener('input', vista); f.alcaldia.addEventListener('change', vista);
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!Validaciones.ubicacion(sel, f)) return;
      App.ejecutar(async () => {
        await API.actualizarPunto(sel.value, { calle: f.calle.value.trim(), colonia: f.colonia.value.trim(), alcaldia: f.alcaldia.value,
          cp: f.cp.value.trim() }, 'Ubicación actualizada');
        App.aviso('Ubicación guardada.', 'ok'); cargar();
      });
    });
    f.addEventListener('reset', () => setTimeout(cargar, 0));
    cargar();
  }

  //ojo se viene la pinche gestion de reportes de usuarios
  //permite filtrar, consultar, dar de alta, etc alch es por hueva que no pongo mas xd
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

  return { MenuAdmin, AdmPuntos, Ficha, AdmResiduos, AdmHorarios, AdmUbicacion, AdmReportes };
})());