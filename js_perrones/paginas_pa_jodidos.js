/* el numero de lineas no es coincidencia xd */
window.Paginas = window.Paginas || {};
Object.assign(window.Paginas, (() => {
  const $ = (id) => document.getElementById(id);

  // ok me costo pero para que sea facil de entender voy a dejar de lado las groserias y payasadas y nos pondremos algo tecnicos

  /* esto va pa los jodidos*/
  // esto es pa los que no tienen sesion o una basica
  // Incluye la página de inicio, registro, login y la lógica compartida para autenticación.
  function Index() {
    $('form-inicio').addEventListener('submit', (e) => {
      e.preventDefault();
      const q = $('q-inicio').value.trim();
      location.href = '../usuarios/Buscar.html' + (q ? '?q=' + encodeURIComponent(q) : '');
    });
    $('num-puntos').textContent = API.verificados().length;
  }

  function Registro() {
    const f = $('form-registro');
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!Validaciones.registro(f)) return;
      enviarCredenciales(f, true);
    });
    f.addEventListener('reset', () => { App.limpiarMarcas(f); App.mensaje('msg', ''); });
  }

  function Login() {
    const f = $('form-login');
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!Validaciones.login(f)) return;
      enviarCredenciales(f, false);
    });
    f.addEventListener('reset', () => { App.limpiarMarcas(f); App.mensaje('msg', ''); });
  }

  // Función compartida para registrar o iniciar sesión.
  // esto wuacha si eres mierdausuario o admin de los cabrones
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
      if (!session) throw new Error('no se pudo crear tu puto perfil de mierda');
      const next = App.parametro('next');
      const valido = next && /^(?:\.\.\/(?:admin|usuarios)\/)?[A-Za-z]+\.html(?:\?[\w=&%.-]*)?$/.test(next);
      location.href = valido ? next : App.menuPorRol(session.rol);
    } catch (error) {
      console.error(error);
      App.mensaje('msg', error.message || 'No se pudo completar el acceso.', 'error');
    } finally {
      boton.disabled = false;
    }
  }

  return { Index, Registro, Login };
})());