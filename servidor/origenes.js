// Utilidades compartidas para aceptar los distintos dominios de la app:
// localhost, producción de Vercel, previews y dominios propios.

function esProduccionPublica() {
    if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === 'production';
    return process.env.NODE_ENV === 'production';
}

function normalizarOrigen(valor) {
    const texto = String(valor || '').trim();
    if (!texto) return '';

    const tieneProtocolo = /^[a-z][a-z0-9+.-]*:\/\//i.test(texto);
    const esLocal = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/i.test(texto);
    const conProtocolo = tieneProtocolo ? texto : (esLocal ? 'http://' : 'https://') + texto;

    try {
        const url = new URL(conProtocolo);
        if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
        return url.origin;
    } catch {
        return '';
    }
}

function origenesApp() {
    const origenes = [];
    const agregar = (valor) => {
        const origen = normalizarOrigen(valor);
        if (origen && !origenes.includes(origen)) origenes.push(origen);
    };

    agregar(process.env.APP_ORIGIN);
    String(process.env.APP_ORIGINS || '').split(/[\s,]+/).forEach(agregar);

    // Vercel entrega estos valores sin protocolo. Algunos solo existen en
    // producción o en previews, por eso se agregan únicamente si están.
    agregar(process.env.VERCEL_PROJECT_PRODUCTION_URL);
    agregar(process.env.VERCEL_BRANCH_URL);
    agregar(process.env.VERCEL_URL);

    return origenes;
}

module.exports = { esProduccionPublica, normalizarOrigen, origenesApp };
