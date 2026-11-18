/*
Mantiene temporalmente los datos obtenidos del servidor:

Envía y recibe información mediante la API /api/....
Proporciona funciones de búsqueda, autenticación y administración.
Implementa el objeto global API, utilizado por js/app.js.
Contenido principal


Constantes principales
-  DIAS: nombres de los días.
-  NOMBRE_DIA: nombres con acento para mostrarlos.
- ALCALDIAS: alcaldías disponibles de CDMX.
- MOTIVOS: razones posibles para reportar un centro.


Comunicación con el servidor
- cargar() / refrescar(): obtiene todos los datos desde /api/bootstrap.
- registrar() y login(): autentican usuarios.
- cerrarSesion(): cierra la sesión activa.
- request(): realiza solicitudes HTTP con fetch.

Puntos y residuos
- todos() y verificados(): listas de puntos.
- buscar(): busca por nombre, dirección, colonia, alcaldía o tipos de residuo.
- guardarPunto() y actualizarPunto(): crean o modifican centros.
- eliminarPunto(): elimina un centro.
- agregarResiduo(): agrega un tipo de residuo.
- dirCompleta() y tieneUbicacion(): construyen direcciones y verifican coordenadas.

Reportes y administración
- crearReporte(): registra un reporte.
- darDeAltaReporte() y eliminarReporte(): administran reportes.
- reportes() y bitacora(): consultan reportes y cambios registrados.

Los datos reales no están escritos dentro de este archivo; permanecen en MySQL y se cargan desde el servidor cuando se abre o actualiza la aplicación.*/

const API = (() => {
    // Constantes principales
    const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const NOMBRE_DIA = { domingo: 'Domingo', lunes: 'Lunes', martes: 'Martes', miércoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', sábado: 'Sábado' };
    const ALCALDIAS = ['Álvaro Obregón', 'Azcapotzalco', 'Benito Juárez', 'Coyoacán', 'Cuajimalpa de Morelos', 'Cuauhtémoc', 'Gustavo A. Madero', 'Iztacalco', 'Iztapalapa', 'La Magdalena Contreras', 'Miguel Hidalgo', 'Milpa Alta', 'Tláhuac', 'Tlalpan', 'Venustiano Carranza', 'Xochimilco'];
    const MOTIVOS = ['informacion incorrecta', 'Centro cerrado', 'Centro no existe', 'Centro duplicado', 'Otro motivo'];
    let datos = {sesion: null, puntos: [], reportes: [], bitacora: []};
    const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    
    async function request(url, options = {}) {
        const headers = new Headers(options.headers || {});
        if (options.body !== undefined) headers.set('Content-Type', 'application/json');
        
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers,
            body: options.body === undefined && !(options.body instanceof FormData) ? JSON.stringify(options.body) : options.body,
            credentials: 'include',
            cache: 'no-store',
    }
    }
    