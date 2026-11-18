window.API = (() => {
    // Constantes principales
    const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const NOMBRE_DIA = { domingo: 'Domingo', lunes: 'Lunes', martes: 'Martes', miércoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', sábado: 'Sábado' };
    const ALCALDIAS = ['Álvaro Obregón', 'Azcapotzalco', 'Benito Juárez', 'Coyoacán', 'Cuajimalpa de Morelos', 'Cuauhtémoc', 'Gustavo A. Madero', 'Iztacalco', 'Iztapalapa', 'La Magdalena Contreras', 'Miguel Hidalgo', 'Milpa Alta', 'Tláhuac', 'Tlalpan', 'Venustiano Carranza', 'Xochimilco'];
    const MOTIVOS = ['informacion incorrecta', 'Centro cerrado', 'Centro no existe', 'Centro duplicado', 'Otro motivo'];
    let datos = {sesion: null, puntos: [], residuos: [], reportes: [], bitacora: []};
    const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    
    async function request(url, options = {}) {
        const headers = new Headers(options.headers || {});
        if (options.body !== undefined) headers.set('Content-Type', 'application/json');
        
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers,
            body: options.body === undefined ? undefined : JSON.stringify(options.body),
            credentials: 'same-origin',
            cache: 'no-store',
    });
    
    if(response.status === 204) return null;
    const contentType = response.headers.get('Content-Type') || '';
    const result = contentType.includes('application/json') ? await response.json() : null;
    if (!response.ok) throw new Error(result && result.error ? result.error : 'no se pudo papi');
    return result;
    }

    async function refresh() {
        const resultado = await request('/api/bootstrap');
        if (!resultado || typeof resultado !== 'object') {
            throw new Error('La API no devolvió datos iniciales válidos.');
        }
        datos = {
            ...datos,
            ...resultado,
            sesion: resultado.sesion ?? resultado.session ?? null,
            residuos: Array.isArray(resultado.residuos) ? resultado.residuos : [],
            puntos: Array.isArray(resultado.puntos) ? resultado.puntos : [],
            reportes: Array.isArray(resultado.reportes) ? resultado.reportes : [],
            bitacora: Array.isArray(resultado.bitacora) ? resultado.bitacora : []
        };
        return datos;
    }

    async function registrar(usuario) {
        const resultado = await request('/api/auth/register', {method: 'POST', body: usuario}) || {};
        await refresh();
        return datos.sesion || resultado.sesion || resultado.session || null;
    }

    async function login(credenciales) {
        const resultado = await request('/api/auth/login', {method: 'POST', body: credenciales}) || {};
        await refresh();
        return datos.sesion || resultado.sesion || resultado.session || null;
    }

    async function cerrarSesion() {
        await request('/api/auth/logout', {method: 'POST'});
        datos.sesion = null;
        datos.reportes = [];
    }

    async function mutate(url, method, body) {
        const result = await request(url, {method, body});
        await refresh();
        return result;
    }

    function buscar({q = '', tipos = [] } = {}, soloVerificados =  true) {
        const nq = norm(q);
        return (soloVerificados ? verificados() : todos()).filter((p) => {
            const texto = norm([p.nombre, p.calle, p.colonia, p.alcaldia, p.cp].join(' '));
            const okTexto = !nq || nq.split(/\s+/).every((t) => texto.includes(t));
            const okTipos = tipos.every((t) => p.residuos.includes (t));
            return okTexto && okTipos;
        });
    }
    const fmtFecha = (iso) => {
        const d = new Date(iso);
        return isNaN(d) ? '-' : d.toLocaleDateString('es-MX') + ' ' +
            d.toLocaleDateString('es-MX', {hour: '2-digit', minute: '2-digit' });
    };

    const fmtDia = (h) => (!h || h.cerrado) ? 'Cerrado' : h.abre + ' – ' + h.cierra;
    const todos = () => datos.puntos;
    const verificados = () => todos().filter((p) => p.ficha && p.ficha.estado === 'verificada');
    const punto = (id) => todos().find((p) => p.id === Number(id));
    const residuos = () => datos.residuos;
    const reportes = () => datos.reportes;
    const bitacora = () => datos.bitacora;
    const sesion = () => datos.sesion;
    const nombreResiduo = (id) => (residuos().find((x) => x.id === Number(id)) || { nombre: '—' }).nombre;
    const dirCompleta = (p) => [p.calle, p.colonia, p.alcaldia, p.cp ? 'C.P. ' + p.cp : '', 'CDMX'].filter(Boolean).join(', ');
    const tieneUbicacion = (p) => /^\d{5}$/.test(String(p.cp || '').trim());

    async function guardarPunto(punto, idExistente) {
        const resultado = idExistente
            ? await mutate('/api/admin/puntos/' + idExistente, 'PUT', punto)
            : await mutate('/api/admin/puntos', 'POST', punto);
        return { ok: true, punto: resultado };
    }

    async function actualizarPunto(id, cambios, accion) {
        return mutate('/api/admin/puntos/' + id, 'PUT', cambios);
    }

    async function agregarResiduo(nombre) {
        return mutate('/api/admin/residuos', 'POST', { nombre: nombre.trim() });
    }

    async function eliminarPunto(id) {
        await mutate('/api/admin/puntos/' + id, 'DELETE');
        return true;
    }

    async function crearReporte(reporte) {
        await mutate('/api/reportes', 'POST', reporte);
    }

    async function darDeAltaReporte(id) {
        await mutate('/api/admin/reportes/' + id, 'PUT', { estado: 'Alta' });
    }

    async function eliminarReporte(id) {
        await mutate('/api/admin/reportes/' + id, 'DELETE');
    }

    return{
        DIAS, NOMBRE_DIA, ALCALDIAS, MOTIVOS,
        cargar: refresh, refrescar: refresh, registrar, login, cerrarSesion, sesion, residuos, nombreResiduo, todos, verificados, punto,
        dirCompleta, tieneUbicacion, buscar, reportes, bitacora, guardarPunto, actualizarPunto,
        agregarResiduo, eliminarPunto, crearReporte, darDeAltaReporte, eliminarReporte,
        fmtFecha, fmtDia, norm
    };
})();
    