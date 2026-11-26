//ahi va asta arriba del todo
const Validaciones = (() => {
  const correoValido = (valor) => /^[a-z0-9._%+-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(valor);
  const CARACTERES_CONTROL = /[\u0000-\u001F\u007F]/;
  const ETIQUETAS_HTML = /[<>]/;
  const DOMINIOS = (typeof window !== 'undefined' && window.DOMINIOS_CORREO) ||
    { permitidos: [], bloqueados: [] };
  const dominioDe = (valor) => String(valor).trim().toLowerCase().split('@').pop();
  const coincideDominio = (dominio, lista) => (lista || []).some((permitido) => {
    const limpio = String(permitido).trim().toLowerCase();
    return dominio === limpio || dominio.endsWith('.' + limpio);
  });
  const dominioPermitido = (valor) => {
    const dominio = dominioDe(valor);
    if (!dominio) return false;
    if (DOMINIOS.permitidos && DOMINIOS.permitidos.length) {
      return coincideDominio(dominio, DOMINIOS.permitidos);
    }
    return !coincideDominio(dominio, DOMINIOS.bloqueados);
  };
  const marcarRequerido = (campo, mensaje) => App.requerido(campo, mensaje);
  const TEXTO_PUNTO = /^[\p{L}\p{N}\s.,#'&()\/:;°º·–—\-!?¡¿%]+$/u;
  const TIENE_LETRA = /\p{L}/u;

  function validarTexto(campo, mensajeVacio, etiqueta, minimo, maximo) {
    const valor = campo.value.trim().replace(/\s+/g, ' ');
    campo.value = valor;
    if (!valor) {
      App.marcar(campo, mensajeVacio);
      return false;
    }
    if (valor.length < minimo) {
      App.marcar(campo, etiqueta + ' debe tener al menos ' + minimo + ' caracteres.');
      return false;
    }
    if (valor.length > maximo) {
      App.marcar(campo, etiqueta + ' no puede superar ' + maximo + ' caracteres.');
      return false;
    }
    if (!TEXTO_PUNTO.test(valor)) {
      App.marcar(campo, etiqueta + ' solo puede llevar letras, números y signos comunes.');
      return false;
    }
    if (!TIENE_LETRA.test(valor)) {
      App.marcar(campo, etiqueta + ' debe incluir al menos una letra.');
      return false;
    }
    App.marcar(campo, '');
    return true;
  }

  function validarCP(campo) {
    const cp = campo.value.trim();
    campo.value = cp;
    if (!cp) {
      App.marcar(campo, 'Escribe el código postal.');
      return false;
    }
    if (!/^\d{5}$/.test(cp)) {
      App.marcar(campo, 'El código postal debe tener cinco dígitos.');
      return false;
    }
    const numero = Number(cp);
    if (numero < 1000 || numero > 16999) {
      App.marcar(campo, 'El código postal no corresponde a la Ciudad de México.');
      return false;
    }
    App.marcar(campo, '');
    return true;
  }

  function validarCorreo(campo, mensajeVacio) {
    const valor = campo.value.trim();
    campo.value = valor;
    if (!valor) {
      App.marcar(campo, mensajeVacio || 'Escribe tu correo electrónico.');
      return false;
    }
    if (valor.length > 254) {
      App.marcar(campo, 'El correo electrónico no puede superar 254 caracteres.');
      return false;
    }
    if (!correoValido(valor) || CARACTERES_CONTROL.test(valor)) {
      App.marcar(campo, 'Escribe un correo electrónico válido.');
      return false;
    }
    App.marcar(campo, '');
    return true;
  }

  function validarPassword(campo, esRegistro) {
    const valor = campo.value;
    if (!valor) {
      App.marcar(campo, esRegistro ? 'Escribe una contraseña.' : 'Escribe tu contraseña.');
      return false;
    }
    if (valor.length > 128) {
      App.marcar(campo, 'La contraseña no puede superar 128 caracteres.');
      return false;
    }
    if (esRegistro && valor.length < 12) {
      App.marcar(campo, 'La contraseña debe tener al menos 12 caracteres.');
      return false;
    }
    if (CARACTERES_CONTROL.test(valor)) {
      App.marcar(campo, 'La contraseña contiene caracteres no permitidos.');
      return false;
    }
    if (ETIQUETAS_HTML.test(valor)) {
      App.marcar(campo, 'La contraseña no puede incluir los caracteres < o >.');
      return false;
    }
    App.marcar(campo, '');
    return true;
  }

  function limpiarNombre(valor) {
    return Array.from(String(valor).toUpperCase(), (letra) => letra === 'Ñ'
      ? 'Ñ'
      : letra.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
      .join('')
      .replace(/[^A-ZÑ\s]/g, '')
      .replace(/([A-ZÑ])\1{2,}/g, '$1$1')
      .replace(/\s+/g, ' ');
  }

  function esPalabraLogica(texto) {
    return texto.trim().split(' ').every((palabra) => {
      if (palabra === 'Y') return true;
      if (palabra.length < 2 || !/[AEIOU]/.test(palabra)) return false;
      if (/[^AEIOUÑ]{4,}/.test(palabra) || /[AEIOU]{3,}/.test(palabra)) return false;
      return true;
    });
  }

  function prepararRegistro(form) {
    [form.nombres, form.apellido_paterno, form.apellido_materno].forEach((campo) => {
      campo.addEventListener('input', () => {
        campo.value = limpiarNombre(campo.value);
      });
    });
  }

  function registro(form) {
    const email = form.email;
    const password = form.password;
    const confirmar = form.confirmar;
    const camposNombre = [
      [form.nombres, 'Escribe tu nombre o nombres.'],
      [form.apellido_paterno, 'Escribe tu apellido paterno.'],
      [form.apellido_materno, 'Escribe tu apellido materno.']
    ];
    let valido = true;
    const partesNombre = [];
    form.nombre.value = '';
    camposNombre.forEach(([campo, mensaje]) => {
      campo.value = limpiarNombre(campo.value).trim();
      const completo = marcarRequerido(campo, mensaje);
      if (completo && !esPalabraLogica(campo.value)) {
        App.marcar(campo, 'Escribe un nombre válido, sin letras al azar.');
        valido = false;
      } else if (completo && campo.value.length > 80) {
        App.marcar(campo, 'Este campo no puede superar 80 caracteres.');
        valido = false;
      }
      if (!completo) valido = false;
      partesNombre.push(campo.value);
    });
    const nombreCompleto = partesNombre.join(' ');
    if (nombreCompleto.length > 160) {
      App.marcar(form.apellido_materno, 'El nombre completo no puede superar 160 caracteres.');
      valido = false;
    }
    const correoOk = validarCorreo(email, 'Escribe tu correo electrónico.');
    valido = correoOk && valido;
    if (correoOk && !dominioPermitido(email.value)) {
      App.marcar(email, 'Esta terminación de correo no está permitida. Usa otro correo.');
      valido = false;
    }
    valido = validarPassword(password, true) && valido;
    valido = marcarRequerido(confirmar, 'Confirma tu contraseña.') && valido;
    if (confirmar.value && confirmar.value !== password.value) {
      App.marcar(confirmar, 'Las contraseñas no coinciden.');
      valido = false;
    }
    if (valido) form.nombre.value = nombreCompleto;
    return valido;
  }

  function login(form) {
    let valido = validarCorreo(form.email, 'Escribe tu correo electrónico.');
    valido = validarPassword(form.password, false) && valido;
    return valido;
  }

  function reporte(form) {
    let valido = marcarRequerido(form.punto, 'Selecciona un centro de acopio.');
    valido = marcarRequerido(form.motivo, 'Selecciona un motivo.') && valido;
    const descripcion = form.descripcion;
    valido = marcarRequerido(descripcion, 'Describe lo ocurrido.') && valido;
    if (descripcion.value.trim().length > 2000) {
      App.marcar(descripcion, 'La descripción no puede superar 2000 caracteres.');
      valido = false;
    }
    return valido;
  }


  function puntoCompleto(form) {
    let valido = validarTexto(form.nombre, 'Escribe el nombre del punto.', 'El nombre del punto', 3, 180);
    valido = validarTexto(form.calle, 'Escribe la calle y número.', 'La dirección', 3, 180) && valido;
    valido = validarTexto(form.colonia, 'Escribe la colonia.', 'La colonia', 2, 120) && valido;
    valido = marcarRequerido(form.alcaldia, 'Selecciona una alcaldía.') && valido;
    if (form.alcaldia.value && typeof API !== 'undefined' && Array.isArray(API.ALCALDIAS) &&
        !API.ALCALDIAS.includes(form.alcaldia.value)) {
      App.marcar(form.alcaldia, 'Selecciona una alcaldía de la Ciudad de México.');
      valido = false;
    }
    valido = validarCP(form.cp) && valido;
    return valido;
  }

  function ficha(selector, form, puntoActual) {
    let valido = marcarRequerido(selector, 'Selecciona un punto de recepción.');
    if (!puntoActual) return null;
    valido = marcarRequerido(form.numero, 'Escribe el número de resolución.') && valido;
    valido = marcarRequerido(form.fecha, 'Selecciona la fecha de emisión.') && valido;
    const archivo = form.archivo.files && form.archivo.files[0];
    if (archivo && !/\.(pdf|png|jpe?g|gif|webp)$/i.test(archivo.name)) {
      App.marcar(form.archivo, 'Selecciona un archivo PDF o una imagen.');
      valido = false;
    }
    if (!archivo && !puntoActual.ficha.archivo) {
      App.marcar(form.archivo, 'Selecciona el archivo de la ficha oficial.');
      valido = false;
    }
    if (!valido) return null;
    return archivo ? archivo.name : puntoActual.ficha.archivo;
  }

  function nuevoResiduo(campo) {
    const valido = marcarRequerido(campo, 'Escribe el tipo de residuo.');
    if (campo.value.trim().length > 120) {
      App.marcar(campo, 'El tipo de residuo no puede superar 120 caracteres.');
      return false;
    }
    return valido;
  }

  function guardarResiduos(selector) {
    return marcarRequerido(selector, 'Selecciona un punto de recepción.');
  }

  function horariosTabla(tabla) {
    const cambios = {};
    let valido = true;
    tabla.querySelectorAll('tr[data-d]').forEach((fila) => {
      const dia = fila.dataset.d;
      const abre = fila.querySelector('.a').value;
      const cierra = fila.querySelector('.c').value;
      const cerrado = fila.querySelector('.x').checked;
      if (!cerrado && (!abre || !cierra || abre >= cierra)) valido = false;
      cambios[dia] = cerrado ? { abre: '', cierra: '', cerrado: true } : { abre, cierra, cerrado: false };
    });
    if (!valido) App.aviso('Completa un horario válido para cada día abierto.', 'error');
    return valido ? cambios : null;
  }

  function horarios(selector, tabla) {
    if (!marcarRequerido(selector, 'Selecciona un punto de recepción.')) return null;
    return horariosTabla(tabla);
  }

  function coordenadas(form) {
    const lat = form.lat ? form.lat.value.trim() : '';
    const lng = form.lng ? form.lng.value.trim() : '';
    if ((lat && !lng) || (!lat && lng)) {
      App.marcar(lat ? form.lng : form.lat, 'Escribe latitud y longitud juntas, o deja ambas vacías.');
      return false;
    }
    if (lat && (Number.isNaN(Number(lat)) || Number(lat) < 19 || Number(lat) > 19.65)) {
      App.marcar(form.lat, 'La latitud debe estar entre 19 y 19.65 para la CDMX.');
      return false;
    }
    if (lng && (Number.isNaN(Number(lng)) || Number(lng) < -99.4 || Number(lng) > -98.9)) {
      App.marcar(form.lng, 'La longitud debe estar entre -99.4 y -98.9 para la CDMX.');
      return false;
    }
    if (form.lat) App.marcar(form.lat, '');
    if (form.lng) App.marcar(form.lng, '');
    return true;
  }

  function ubicacion(selector, form) {
    let valido = marcarRequerido(selector, 'Selecciona un punto de recepción.');
    valido = validarTexto(form.calle, 'Escribe la calle y número.', 'La dirección', 3, 180) && valido;
    valido = validarTexto(form.colonia, 'Escribe la colonia.', 'La colonia', 2, 120) && valido;
    valido = marcarRequerido(form.alcaldia, 'Selecciona una alcaldía.') && valido;
    if (form.alcaldia.value && typeof API !== 'undefined' && Array.isArray(API.ALCALDIAS) &&
        !API.ALCALDIAS.includes(form.alcaldia.value)) {
      App.marcar(form.alcaldia, 'Selecciona una alcaldía de la Ciudad de México.');
      valido = false;
    }
    valido = validarCP(form.cp) && valido;
    if (!coordenadas(form)) valido = false;
    return valido;
  }

  return { prepararRegistro, registro, login, reporte, puntoCompleto, ficha, nuevoResiduo, guardarResiduos, horarios, horariosTabla, ubicacion, coordenadas };
})();
