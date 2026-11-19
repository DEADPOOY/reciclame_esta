const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const argon2 = require('argon2');
const { createHash, randomBytes } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline/promises');

const ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(ROOT, '.env');
require('dotenv').config({ path: ENV_FILE });
let db;
const app = express();
const SESSION_COOKIE = 'rt_session';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const ARGON_OPTIONS = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 };
const DUMMY_PASSWORD_HASH = argon2.hash(randomBytes(32).toString('hex'), ARGON_OPTIONS);

class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
// ora si que lo ocupa la pinchi pagina fififiifif

function asyncRoute(handler) {
    return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function requireObject(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new HttpError(400, 'El cuerpo de la solicitud no es válido.');
    return value;
}

function requiredText(value, label, maxLength) {
    if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
        throw new HttpError(400, label + ' es obligatorio y no debe exceder ' + maxLength + ' caracteres.');
    }
    return value.trim();
}

function parseId(value) {
    const id = Number(value);
    if (!Number.isSafeInteger(id) || id < 1) throw new HttpError(400, 'El identificador no es válido.');
    return id;
}

function validarEmail(value) {
    const email = requiredText(value, 'El correo electrónico', 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Escribe un correo electrónico válido.');
    return email;
}

function validarPassword(value, esRegistro) {
    if (typeof value !== 'string' || value.length > 128 || (esRegistro && (value.length < 12 || !value.trim()))) {
        throw new HttpError(400, esRegistro
        ? 'La contraseña debe tener entre 12 y 128 caracteres.'
        : 'La contraseña no es válida.');
    }
    if (!esRegistro && !value.length) throw new HttpError(400, 'La contraseña es obligatoria.');
    return value;
}

//lo que guarda esta pinche viejo cerdo xd

async function crearSesion(connection, userId) {
    const token = randomBytes(32).toString('base64url');
    await connection.execute('DELETE FROM sessions WHERE expires_at <= UTC_TIMESTAMP()');
    await connection.execute(
        'INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 DAY))',
        [hashSesion(token), userId]
    );
    return token;
}

function hashSesion(token) {
    return createHash('sha256').update(token).digest('hex');
}

function tokenSesion(req) {
    const match = (req.get('cookie') || '').match(/(?:^|;\s*)rt_session=([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
}

function establecerCookie(res, token) {
    res.cookie(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_MAX_AGE
    });
}

function limpiarCookie(res) {
    res.clearCookie(SESSION_COOKIE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });
}

function autenticarOpcional(req, res, next) {
    const token = tokenSesion(req);
    if (!token) return next();
    db.usuarioPorSesion(hashSesion(token)).then((user) => {
        if (!user) {
        limpiarCookie(res);
        return next();
        }
        req.user = user;
        req.sessionHash = user.tokenHash;
        next();
    }).catch(next);
}

// verifica mesta fifiififif yay<yayay bueno esto en adelante son parametros para aceptacion


function verificarSesion(req, res, next) {
    const token = tokenSesion(req);
    if (!token) return next(new HttpError(401, 'Inicia sesión para continuar.'));
    db.usuarioPorSesion(hashSesion(token)).then((user) => {
        if (!user) {
        limpiarCookie(res);
        return next(new HttpError(401, 'La sesión expiró. Inicia sesión de nuevo.'));
        }
        req.user = user;
        req.sessionHash = user.tokenHash;
        next();
    }).catch(next);
}

function validarOrigen(req, res, next) {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    const origin = req.get('origin');
    if (!origin) return next(new HttpError(403, 'La solicitud debe provenir del mismo sitio.'));
    try {
        const expected = process.env.APP_ORIGIN || req.protocol + '://' + req.get('host');
        if (new URL(origin).origin !== new URL(expected).origin) {
        return next(new HttpError(403, 'El origen de la solicitud no está autorizado.'));
        }
    } catch {
        return next(new HttpError(403, 'El origen de la solicitud no es válido.'));
    }
    next();
}

function requiereAdmin(req, res, next) {
    if (!req.user || req.user.rol !== 'admin') return next(new HttpError(403, 'Se requiere una cuenta administradora autorizada.'));
    next();
}

function validarFicha(ficha) {
    if (!ficha || typeof ficha !== 'object' || Array.isArray(ficha)) throw new HttpError(400, 'La ficha no es válida.');
    if (!['pendiente', 'verificada'].includes(ficha.estado)) throw new HttpError(400, 'El estado de la ficha no es válido.');
    const fecha = typeof ficha.fecha === 'string' ? ficha.fecha.slice(0, 10) : '';
    const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? new Date(fecha + 'T00:00:00Z') : null;
    const numero = typeof ficha.numero === 'string' ? ficha.numero.trim().slice(0, 100) : '';
    const archivo = typeof ficha.archivo === 'string' ? ficha.archivo.trim().slice(0, 255) : '';
    if (ficha.estado === 'verificada' &&
        (!numero || !archivo || !parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== fecha)) {
        throw new HttpError(400, 'Una ficha verificada requiere número, fecha válida y nombre de archivo.');
    }
    return {
        numero,
        fecha,
        archivo,
        estado: ficha.estado
    };
}

function horariosBase() {
    const horarios = {};
    db.DIAS.forEach((dia) => { horarios[dia] = { abre: '09:00', cierra: '17:00', cerrado: false }; });
    horarios.sabado = { abre: '', cierra: '', cerrado: true };
    horarios.domingo = { abre: '', cierra: '', cerrado: true };
    return horarios;
}

function validarHorarios(horarios) {
    if (!horarios || typeof horarios !== 'object' || Array.isArray(horarios)) throw new HttpError(400, 'Los horarios no son válidos.');
    const result = {};
    for (const dia of db.DIAS) {
        const horario = horarios[dia];
        if (!horario || typeof horario !== 'object' || typeof horario.cerrado !== 'boolean') {
        throw new HttpError(400, 'Revisa los horarios de atención.');
        }
        const abre = horario.cerrado ? '' : String(horario.abre || '');
        const cierra = horario.cerrado ? '' : String(horario.cierra || '');
        const horaValida = (valor) => /^\d{2}:\d{2}$/.test(valor) &&
        Number(valor.slice(0, 2)) <= 23 && Number(valor.slice(3, 5)) <= 59;
        if (!horario.cerrado && (!horaValida(abre) || !horaValida(cierra) || abre >= cierra)) {
        throw new HttpError(400, 'La apertura debe ser anterior al cierre en cada día abierto.');
        }
        result[dia] = { abre, cierra, cerrado: horario.cerrado };
    }
    return result;
}

async function validarPunto(datos) {
    const nombre = requiredText(datos.nombre, 'El nombre del punto', 180);
    const calle = requiredText(datos.calle, 'La calle', 180);
    const alcaldia = requiredText(datos.alcaldia, 'La alcaldía', 100);
    if (!db.ALCALDIAS.includes(alcaldia)) throw new HttpError(400, 'La alcaldía no es válida.');
    const colonia = typeof datos.colonia === 'string' ? datos.colonia.trim().slice(0, 120) : '';
    const cp = typeof datos.cp === 'string' ? datos.cp.trim() : '';
    if (cp && !/^\d{5}$/.test(cp)) throw new HttpError(400, 'El código postal debe contener cinco dígitos.');
    const lat = datos.lat == null || datos.lat === '' ? null : Number(datos.lat);
    const lng = datos.lng == null || datos.lng === '' ? null : Number(datos.lng);
    if ((lat === null) !== (lng === null) ||
        (lat !== null && (!Number.isFinite(lat) || lat < 19 || lat > 19.65)) ||
        (lng !== null && (!Number.isFinite(lng) || lng < -99.4 || lng > -98.9))) {
        throw new HttpError(400, 'Las coordenadas no son válidas para la Ciudad de México.');
    }
    if (datos.residuos != null && !Array.isArray(datos.residuos)) {
        throw new HttpError(400, 'La selección de residuos no es válida.');
    }
    const residuos = Array.isArray(datos.residuos) ? [...new Set(datos.residuos.map(Number))] : [];
    if (residuos.some((id) => !Number.isSafeInteger(id) || id < 1)) throw new HttpError(400, 'La selección de residuos no es válida.');
    if (residuos.length) {
        const placeholders = residuos.map(() => '?').join(',');
        const [existing] = await db.pool.query(`SELECT id FROM residuos WHERE id IN (${placeholders})`, residuos);
        if (existing.length !== residuos.length) throw new HttpError(400, 'Uno o más tipos de residuo ya no existen.');
    }
    const ficha = validarFicha(datos.ficha || { numero: '', fecha: '', archivo: '', estado: 'pendiente' });
    if (ficha.estado === 'verificada' && (!residuos.length || lat === null)) {
        throw new HttpError(400, 'Para verificar el centro debe tener ubicación y tipos de residuos.');
    }
    return {
        nombre, calle, colonia, alcaldia, cp, lat, lng, residuos,
        horarios: validarHorarios(datos.horarios || horariosBase()),
        ficha
    };
}

//a donde te la voy a meter uaajajja son los recuersos aqui va el mapa y nuesta galletica
// mi galletica, mi galletica, mi galletica esta muy bonita

app.disable('x-powered-by');
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        frameSrc: ["'self'", 'https://www.openstreetmap.org', 'https://maps.google.com', 'https://www.google.com', 'https://maps.googleapis.com'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
        }
    }
}));
app.use(express.json({ limit: '32kb' }));

function rateLimiter(limit, message) {
    return rateLimit({
        windowMs: 15 * 60 * 1000,
        limit,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        handler: (req, res) => res.status(429).json({ error: message })
    });
}

//esto es principalmente para limitar el numero de intentos alch

app.use('/api', rateLimiter(600, 'Demasiadas solicitudes. Intenta de nuevo más tarde'));
app.use('/api/admin', rateLimiter(120, 'El servicio está temporalmente saturado. Intenta más tarde'));
app.use('/api', (req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
app.use('/api', validarOrigen);

const authRateLimit = rateLimiter(10, 'Demasiados intentos. Espera un momento e inténtalo de nuevo');

app.post('/api/auth/register', authRateLimit, asyncRoute(async (req, res) => {
    const data = requireObject(req.body);
    const nombre = requiredText(data.nombre, 'El nombre completo', 160);
    const email = validarEmail(data.email);
    const password = validarPassword(data.password, true);
    const passwordHash = await argon2.hash(password, ARGON_OPTIONS);
    const created = await db.transaccion(async (connection) => {
        const [result] = await connection.execute(
        'INSERT INTO users (email, nombre, password_hash, rol) VALUES (?, ?, ?, ?)',
        [email, nombre, passwordHash, 'usuario']
        );
        const user = { id: Number(result.insertId), email, nombre, rol: 'usuario' };
        const token = await crearSesion(connection, user.id);
        return { user, token };
    });
    establecerCookie(res, created.token);
    res.status(201).json({ session: created.user });
}));

app.post('/api/auth/login', authRateLimit, asyncRoute(async (req, res) => {
    const data = requireObject(req.body);
    const email = validarEmail(data.email);
    const password = validarPassword(data.password, false);
    const user = await db.usuarioPorEmail(email);
    const hash = user ? user.password_hash : await DUMMY_PASSWORD_HASH;
    const passwordValido = await argon2.verify(hash, password);
    if (!user || !passwordValido) throw new HttpError(401, 'Correo electrónico o contraseña incorrectos.');
    const token = await db.transaccion((connection) => crearSesion(connection, Number(user.id)));
    establecerCookie(res, token);
    res.json({ session: { id: Number(user.id), email: user.email, nombre: user.nombre, rol: user.rol } });
}));

app.post('/api/auth/logout', asyncRoute(async (req, res) => {
    const token = tokenSesion(req);
    if (token) await db.eliminarSesion(hashSesion(token));
    limpiarCookie(res);
    res.status(204).end();
}));

app.get('/api/health', asyncRoute(async (req, res) => {
    await db.pool.query('SELECT 1');
    res.json({ ok: true });
}));

app.get('/api/bootstrap', autenticarOpcional, asyncRoute(async (req, res) => {
    res.json(await db.cargarBootstrap(req.user || null));
}));

// de aqui en adelante son como verifiaciones sabes y filtros 

app.post('/api/reportes', verificarSesion, asyncRoute(async (req, res) => {
    const data = requireObject(req.body);
    const puntoId = parseId(data.puntoId);
    const motivo = requiredText(data.motivo, 'El motivo', 100);
    const descripcion = requiredText(data.descripcion, 'La descripción', 2000);
    if (descripcion.length < 10) throw new HttpError(400, 'La descripción debe tener al menos 10 caracteres.');
    if (!db.MOTIVOS.includes(motivo)) throw new HttpError(400, 'El motivo seleccionado no es válido.');
    const [points] = await db.pool.execute(
        `SELECT id, nombre FROM puntos WHERE id = ? AND JSON_UNQUOTE(JSON_EXTRACT(ficha, '$.estado')) = 'verificada'`,
        [puntoId]
    );
    if (!points.length) throw new HttpError(404, 'El centro de acopio ya no está disponible.');
    await db.pool.execute(
        'INSERT INTO reportes (punto_id, punto_nombre, user_id, usuario, motivo, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
        [puntoId, points[0].nombre, req.user.id, req.user.nombre, motivo, descripcion]
    );
    res.status(201).json({ ok: true });
}));

app.post('/api/admin/puntos', verificarSesion, requiereAdmin, asyncRoute(async (req, res) => {
    const punto = await validarPunto(requireObject(req.body));
    res.status(201).json(await db.insertarPunto(punto, req.user));
}));

app.put('/api/admin/puntos/:id', verificarSesion, requiereAdmin, asyncRoute(async (req, res) => {
    const id = parseId(req.params.id);
    const current = await db.obtenerPunto(id);
    if (!current) throw new HttpError(404, 'El punto ya no existe.');
    const data = requireObject(req.body);
    const punto = await validarPunto(Object.assign({}, current, data));
    const updated = await db.actualizarPunto(id, punto, req.user, typeof data.accion === 'string' ? data.accion : 'Punto actualizado');
    if (!updated) throw new HttpError(404, 'El punto ya no existe.');
    res.json(updated);
}));

app.delete('/api/admin/puntos/:id', verificarSesion, requiereAdmin, asyncRoute(async (req, res) => {
    const deleted = await db.eliminarPunto(parseId(req.params.id), req.user);
    if (!deleted) throw new HttpError(404, 'El punto ya no existe.');
    res.status(204).end();
}));

app.post('/api/admin/residuos', verificarSesion, requiereAdmin, asyncRoute(async (req, res) => {
    const nombre = requiredText(requireObject(req.body).nombre, 'El nombre del tipo de residuo', 120);
    const residuo = await db.transaccion(async (connection) => {
        const [result] = await connection.execute('INSERT INTO residuos (nombre) VALUES (?)', [nombre]);
        await db.guardarAuditoria(connection, req.user, 'Nuevo tipo de residuo', nombre);
        return { id: Number(result.insertId), nombre };
    });
    res.status(201).json(residuo);
}));

app.put('/api/admin/reportes/:id', verificarSesion, requiereAdmin, asyncRoute(async (req, res) => {
    const id = parseId(req.params.id);
    if (requireObject(req.body).estado !== 'Alta') throw new HttpError(400, 'El estado solicitado no es válido.');
    await db.transaccion(async (connection) => {
        const report = await db.obtenerReporte(id, connection);
        if (!report) throw new HttpError(404, 'El reporte ya no existe.');
        await connection.execute('UPDATE reportes SET estado = ? WHERE id = ?', ['Alta', id]);
        await db.guardarAuditoria(connection, req.user, 'Reporte dado de alta', '#' + id + ' · ' + report.puntoNombre);
    });
    res.json({ ok: true });
}));

app.delete('/api/admin/reportes/:id', verificarSesion, requiereAdmin, asyncRoute(async (req, res) => {
    const id = parseId(req.params.id);
    await db.transaccion(async (connection) => {
        const report = await db.obtenerReporte(id, connection);
        if (!report) throw new HttpError(404, 'El reporte ya no existe.');
        await connection.execute('DELETE FROM reportes WHERE id = ?', [id]);
        await db.guardarAuditoria(connection, req.user, 'Reporte eliminado', '#' + id + ' · ' + report.puntoNombre);
    });
    res.status(204).end();
}));

app.get('/', (req, res) => res.redirect('/publico/Index.html'));
app.use(express.static(path.join(ROOT, 'paginas'), { dotfiles: 'deny', index: false }));
app.use('/js', express.static(path.join(ROOT, 'js'), { dotfiles: 'deny', index: false }));
app.use('/css', express.static(path.join(ROOT, 'css'), { dotfiles: 'deny', index: false }));
app.use((req, res) => res.status(404).json({ error: 'La página o el recurso solicitado no existe.' }));

    app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe un registro con esos datos.' });
    }
    const status = Number.isInteger(error.status) ? error.status : 500;
    if (status >= 500) console.error(error);
    res.status(status).json({ error: status >= 500 ? 'Ocurrió un error en el servidor. Intenta de nuevo más tarde.' : error.message });
});

function dotenvValue(value) {
    return JSON.stringify(value);
}

function preguntarSecreto(label, fallback) {
    if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') return Promise.resolve(fallback);
    process.stdout.write(`${label} [entrada oculta; Enter usa el valor sugerido]: `);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    return new Promise((resolve, reject) => {
        let value = '';
        const terminar = (error) => {
            process.stdin.removeListener('data', recibir);
            process.stdin.setRawMode(false);
            process.stdin.pause();
            process.stdout.write('\n');
            if (error) reject(error);
            else resolve(value || fallback);
        };
        const recibir = (buffer) => {
            const key = buffer.toString();
            if (key === '\u0003') return terminar(new Error('Configuración cancelada.'));
            if (key === '\r' || key === '\n') return terminar();
            if (key === '\u007f' || key === '\b') {
                if (value) {
                    value = value.slice(0, -1);
                    process.stdout.write('\b \b');
                }
                return;
            }
            value += key;
            process.stdout.write('*');
        };
        process.stdin.on('data', recibir);
    });
}

async function configurarEntorno() {
    if (fs.existsSync(ENV_FILE)) return;
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
        throw new Error('No existe .env. Inicia el servidor desde una terminal interactiva para configurarlo.');
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const preguntar = async (label, fallback) => {
        const answer = (await rl.question(`${label} [${fallback}]: `)).trim();
        return answer || fallback;
    };

    try {
        console.log('Configuración inicial de ReciclaTech (MySQL local).');
        const host = await preguntar('Host de MySQL (ej. localhost o 127.0.0.1)', 'localhost');
        const port = await preguntar('Puerto de MySQL', '3306');
        const user = await preguntar('Usuario de MySQL', 'reciclame_esta');
        const database = await preguntar('Base de datos', 'reciclame_esta');
        const appPort = await preguntar('Puerto del servidor web', '3000');
        rl.close();
        const password = await preguntarSecreto('Contraseña de MySQL', 'CAMBIA_ESTA_CONTRASENA');

        const values = { MYSQL_HOST: host, MYSQL_PORT: port, MYSQL_USER: user, MYSQL_PASSWORD: password,
            MYSQL_DATABASE: database, PORT: appPort };
        const contents = Object.entries(values).map(([key, value]) => `${key}=${dotenvValue(value)}`).join('\n') + '\n';
        fs.writeFileSync(ENV_FILE, contents, { flag: 'wx', mode: 0o600 });
        Object.assign(process.env, values);
        console.log('Configuración guardada en .env.');
    } finally {
        rl.close();
    }
}

async function start() {
    await configurarEntorno();
    db = require('./base_datos');
    if (process.env.NODE_ENV === 'production' && !process.env.APP_ORIGIN) {
        throw new Error('Configura APP_ORIGIN con el origen HTTPS público antes de iniciar en producción.');
    }
    if (process.env.NODE_ENV === 'production' && new URL(process.env.APP_ORIGIN).protocol !== 'https:') {
        throw new Error('APP_ORIGIN debe usar HTTPS en producción.');
    }
    await db.inicializar();
    const port = Number(process.env.PORT || 3000);
    app.listen(port, () => console.log('ReciclaTech disponible en http://localhost:' + port));
}

if (require.main === module) {
    start().catch((error) => {
        if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
            console.error('No se pudo resolver el host de MySQL. Revisa MYSQL_HOST en .env (usa localhost o 127.0.0.1).');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('MySQL rechazó el usuario o la contraseña. Revisa MYSQL_USER y MYSQL_PASSWORD en .env.');
        } else {
            console.error('No se pudo iniciar ReciclaTech:', error.message);
        }
        process.exitCode = 1;
    });
}

module.exports = app;
