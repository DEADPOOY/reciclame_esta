const Validaciones = (() => {
  const correoValido = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  const marcarRequerido = (campo, mensaje) => App.requerido(campo, mensaje);

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
    valido = marcarRequerido(email, 'Escribe tu correo electrónico.') && valido;
    if (email.value.trim() && !correoValido(email.value.trim())) {
      App.marcar(email, 'Escribe un correo electrónico válido.');
      valido = false;
    }
    valido = marcarRequerido(password, 'Escribe una contraseña.') && valido;
    if (password.value.length < 12 || password.value.length > 128) {
      App.marcar(password, 'La contraseña debe tener entre 12 y 128 caracteres.');
      valido = false;
    }
    valido = marcarRequerido(confirmar, 'Confirma tu contraseña.') && valido;
    if (confirmar.value && confirmar.value !== password.value) {
      App.marcar(confirmar, 'Las contraseñas no coinciden.');
      valido = false;
    }
    if (valido) form.nombre.value = partesNombre.join(' ');
    return valido;
  }

  function login(form) {
    const email = form.email;
    const password = form.password;
    let valido = marcarRequerido(email, 'Escribe tu correo electrónico.');
    if (email.value.trim() && !correoValido(email.value.trim())) {
      App.marcar(email, 'Escribe un correo electrónico válido.');
      valido = false;
    }
    valido = marcarRequerido(password, 'Escribe tu contraseña.') && valido;
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

  function punto(form) {
    let valido = marcarRequerido(form.nombre, 'Escribe el nombre del punto.');
    valido = marcarRequerido(form.calle, 'Escribe la dirección del punto.') && valido;
    valido = marcarRequerido(form.alcaldia, 'Selecciona una alcaldía.') && valido;
    return valido;
  }

  function puntoCompleto(form) {
    let valido = marcarRequerido(form.nombre, 'Escribe el nombre del punto.');
    valido = marcarRequerido(form.calle, 'Escribe la calle y número.') && valido;
    valido = marcarRequerido(form.colonia, 'Escribe la colonia.') && valido;
    valido = marcarRequerido(form.alcaldia, 'Selecciona una alcaldía.') && valido;
    valido = marcarRequerido(form.cp, 'Escribe el código postal.') && valido;
    if (form.cp.value.trim() && !/^\d{5}$/.test(form.cp.value.trim())) {
      App.marcar(form.cp, 'El código postal debe tener cinco dígitos.');
      valido = false;
    }
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

  function ubicacion(selector, form) {
    let valido = marcarRequerido(selector, 'Selecciona un punto de recepción.');
    for (const [campo, mensaje] of [[form.calle, 'Escribe la calle y número.'], [form.colonia, 'Escribe la colonia.'],
      [form.alcaldia, 'Selecciona una alcaldía.'], [form.cp, 'Escribe un código postal de cinco dígitos.']]) {
      valido = marcarRequerido(campo, mensaje) && valido;
    }
    if (form.cp.value.trim() && !/^\d{5}$/.test(form.cp.value.trim())) {
      App.marcar(form.cp, 'El código postal debe tener cinco dígitos.');
      valido = false;
    }
    return valido;
  }

  return { prepararRegistro, registro, login, reporte, punto, puntoCompleto, ficha, nuevoResiduo, guardarResiduos, horarios, horariosTabla, ubicacion };
})();
