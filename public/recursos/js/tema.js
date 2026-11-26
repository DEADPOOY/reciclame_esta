// Tema claro/oscuro. Se carga en <head> para evitar el destello de tema incorrecto.
(function () {
  const CLAVE = 'reciclatech_tema';
  const raiz = document.documentElement;

  function leer() {
    try {
      return localStorage.getItem(CLAVE) === 'oscuro' ? 'oscuro' : 'claro';
    } catch (e) {
      return 'claro';
    }
  }

  function aplicar(tema) {
    const valor = tema === 'oscuro' ? 'oscuro' : 'claro';
    raiz.dataset.tema = valor;
    raiz.style.colorScheme = valor === 'oscuro' ? 'dark' : 'light';
    try { localStorage.setItem(CLAVE, valor); } catch (e) { /* almacenamiento no disponible */ }
    return valor;
  }

  const actual = () => (raiz.dataset.tema === 'oscuro' ? 'oscuro' : 'claro');
  const alternar = () => aplicar(actual() === 'oscuro' ? 'claro' : 'oscuro');

  // Aplica el tema guardado antes de pintar la página. Sin preferencia guardada,
  // el sitio inicia siempre en claro, tal como se solicitó.
  aplicar(leer());

  window.Tema = { actual, aplicar, alternar, clave: CLAVE };
})();
