const { Pool } = require('pg');
const fsSync = require('node:fs');
const fs = require('node:fs/promises');
const path = require('node:path');

// Acepta el nombre documentado y también los que crea la integración de
// Supabase en Vercel (POSTGRES_URL, etc.), para que la app no dependa de un
// único nombre de variable.
const nombreVariableConexion = process.env.RECICLATECH_DATABASE_URL ? 'RECICLATECH_DATABASE_URL'
    : process.env.DATABASE_URL ? 'DATABASE_URL'
    : process.env.SUPABASE_DB_URL ? 'SUPABASE_DB_URL'
    : process.env.POSTGRES_URL ? 'POSTGRES_URL'
    : process.env.POSTGRES_URL_NON_POOLING ? 'POSTGRES_URL_NON_POOLING'
    : '';
const databaseUrlRaw = nombreVariableConexion ? process.env[nombreVariableConexion] : '';

if (!databaseUrlRaw) {
    throw new Error('Falta DATABASE_URL. Configura la conexión de Postgres de Supabase en .env.');
}

function crearUrlBaseDatos(valor) {
    const original = String(valor);
    const limpio = original.trim();
    const esquema = limpio.match(/^([a-z][a-z0-9+.-]*):\/\//i)?.[1] || '(sin esquema)';
    if (/^DATABASE_URL\s*=/i.test(limpio)) {
        throw new Error('El valor de ' + nombreVariableConexion + ' incluye el prefijo "DATABASE_URL=". Pega solo la URI que empieza con postgresql://.');
    }
    if (/^['"]/.test(limpio) || /['"]$/.test(limpio)) {
        throw new Error('El valor de ' + nombreVariableConexion + ' tiene comillas. Quita las comillas.');
    }
    if (/[\r\n]/.test(original)) {
        throw new Error('El valor de ' + nombreVariableConexion + ' tiene saltos de línea. Pégalo en una sola línea.');
    }
    if (!/^postgres(ql)?:\/\//i.test(limpio)) {
        throw new Error('El valor de ' + nombreVariableConexion + ' debe empezar con postgresql://. Esquema detectado: ' + esquema + '. Longitud: ' + limpio.length + '.');
    }
    try {
        return new URL(limpio);
    } catch {
        throw new Error(nombreVariableConexion + ' no es una URL válida. Revisa que la contraseña no tenga espacios y que el @ esté como %40.');
    }
}

const ROOT = path.resolve(__dirname, '..');
const databaseUrl = crearUrlBaseDatos(databaseUrlRaw);
// Ruta estática: Vercel puede incluir este certificado en el bundle de Node.
const supabaseCa = fsSync.readFileSync(path.join(ROOT, 'supabase-ca.crt'), 'utf8');
databaseUrl.searchParams.delete('sslmode');
databaseUrl.searchParams.delete('sslrootcert');

const pool = new Pool({
    connectionString: databaseUrl.toString(),
    ssl: { ca: supabaseCa, rejectUnauthorized: true },
    max: Number(process.env.PG_POOL_MAX || (process.env.VERCEL ? 1 : 5)),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
});

// Adapta la interfaz de consultas del servidor al cliente pg.
// Los parámetros ? se convierten a $1, $2, etc. y los INSERT que necesitan id
// devuelven ese id con RETURNING.
function traducirSql(sql) {
    return sql
        .replace(/\?/g, (() => { let n = 0; return () => `$${++n}`; })())
        .replace(/UTC_TIMESTAMP\(\)/gi, 'CURRENT_TIMESTAMP')
        .replace(/JSON_UNQUOTE\(JSON_EXTRACT\((\w+),\s*'\$\.estado'\)\)/gi, "$1->>'estado'");
}

function clienteCompatible(client) {
    async function ejecutar(sql, valores = []) {
        let consulta = traducirSql(sql);
        const insertaConId = /^\s*INSERT\s+INTO\s+(users|puntos|residuos)\b/i.test(consulta) && !/\bRETURNING\b/i.test(consulta);
        if (insertaConId) consulta += ' RETURNING id';
        const resultado = await client.query(consulta, valores);
        if (/^\s*(SELECT|WITH)\b/i.test(consulta)) return [resultado.rows, resultado.fields];
        const metadatos = { affectedRows: resultado.rowCount };
        if (insertaConId && resultado.rows[0]) metadatos.insertId = Number(resultado.rows[0].id);
        return [metadatos, resultado.fields];
    }
    return { query: ejecutar, execute: ejecutar };
}

const db = clienteCompatible(pool);
const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const NOMBRE_DIA = { lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves',viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo' };
const ALCALDIAS = ['Álvaro Obregón', 'Azcapotzalco', 'Benito Juárez', 'Coyoacán', 'Cuajimalpa de Morelos', 'Cuauhtémoc', 'Gustavo A. Madero', 'Iztacalco', 'Iztapalapa', 'La Magdalena Contreras', 'Miguel Hidalgo', 'Milpa Alta', 'Tláhuac', 'Tlalpan', 'Venustiano Carranza', 'Xochimilco'];
const MOTIVOS = ['Información incorrecta', 'Horario distinto al publicado', 'Centro cerrado o sin servicio', 'No aceptan los residuos indicados', 'Otro'];
const TIPOS_RESIDUO = ['Celulares y tablets', 'Computadoras y laptops', 'Pantallas y televisores', 'Baterías y pilas', 'Cables y cargadores', 'Impresoras', 'Consolas y videojuegos', 'Electrodomésticos pequeños'];

function parseJson(value, fallback) {
    if (typeof value !== 'string') return value == null ? fallback : value;
    return JSON.parse(value);
}

function formatearPunto(row) {
    if (!row) return null;
    return {
        id: Number(row.id), nombre: row.nombre, calle: row.calle, colonia: row.colonia, alcaldia: row.alcaldia,
        cp: row.cp, lat: row.lat == null ? null : Number(row.lat), lng: row.lng == null ? null : Number(row.lng),
        residuos: parseJson(row.residuos, []), horarios: parseJson(row.horarios, {}),
        ficha: parseJson(row.ficha, { numero: '', fecha: '', archivo: '', estado: 'pendiente' })
    };
}

function formatearReporte(row) {
    return { id: Number(row.id), puntoId: row.punto_id == null ? null : Number(row.punto_id), puntoNombre: row.punto_nombre,
        usuarioId: Number(row.user_id), usuario: row.usuario, motivo: row.motivo, descripcion: row.descripcion,
        fecha: new Date(row.fecha).toISOString(), estado: row.estado, respuestaAdmin: row.respuesta_admin || '' };
}

function horarioBase() {
    const horarios = {};
    DIAS.forEach((dia) => { horarios[dia] = { abre: '09:00', cierra: '17:00', cerrado: false }; });
    horarios.sabado = { abre: '', cierra: '', cerrado: true };
    horarios.domingo = { abre: '', cierra: '', cerrado: true };
    return horarios;
}

function puntoPorDefecto(datos) {
    return {
        nombre: datos.nombre, calle: datos.calle || '', colonia: datos.colonia || '', alcaldia: datos.alcaldia || '',
        cp: datos.cp || '', lat: datos.lat == null ? null : Number(datos.lat), lng: datos.lng == null ? null : Number(datos.lng),
        residuos: datos.residuos || [], horarios: datos.horarios || horarioBase(),
        ficha: datos.ficha || { numero: '', fecha: '', archivo: '', estado: 'pendiente' }
    };
}

async function inicializar() {
    const schemaPath = path.join(__dirname, '..', 'base_de_datos', 'supabase_schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    for (const statement of schema.split(';').map((part) => part.trim()).filter(Boolean)) {
        await pool.query(statement);
    }
    for (const nombre of TIPOS_RESIDUO) {
        await pool.query('INSERT INTO residuos (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING', [nombre]);
    }
}

async function transaccion(callback) {
    const client = await pool.connect();
    const compatible = clienteCompatible(client);
    try {
        await client.query('BEGIN');
        const result = await callback(compatible);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function guardarAuditoria(connection, user, accion, detalle) {
    await connection.execute(
        'INSERT INTO bitacora (admin_id, admin, accion, detalle) VALUES (?, ?, ?, ?)',
        [user.id, user.nombre, accion.slice(0, 120), detalle.slice(0, 500)]
    );
}

async function usuarioPorEmail(email) {
    const [rows] = await db.execute('SELECT id, email, nombre, password_hash, rol FROM users WHERE email = ?', [email]);
    return rows[0] || null;
}

async function usuarioOAuth(email, nombre, passwordHash) {
    const buscar = async () => {
        const [rows] = await db.execute('SELECT id, email, nombre, rol FROM users WHERE email = ?', [email]);
        if (!rows.length) return null;
        return { id: Number(rows[0].id), email: rows[0].email, nombre: rows[0].nombre, rol: rows[0].rol };
    };
    const existente = await buscar();
    if (existente) return existente;
    try {
        const [result] = await db.execute(
            'INSERT INTO users (email, nombre, password_hash, rol) VALUES (?, ?, ?, ?)',
            [email, nombre || email.split('@')[0], passwordHash, 'usuario']
        );
        return { id: Number(result.insertId), email, nombre: nombre || email.split('@')[0], rol: 'usuario' };
    } catch (error) {
        if (error.code === '23505') {
            const creado = await buscar();
            if (creado) return creado;
        }
        throw error;
    }
}

async function usuarioPorSesion(tokenHash) {
    const [rows] = await db.execute(
        `SELECT users.id, users.email, users.nombre, users.rol, sessions.token_hash
        FROM sessions JOIN users ON users.id = sessions.user_id
        WHERE sessions.token_hash = ? AND sessions.expires_at > CURRENT_TIMESTAMP`, [tokenHash]
    );
    if (!rows.length) return null;
    const row = rows[0];
    return { id: Number(row.id), email: row.email, nombre: row.nombre, rol: row.rol, tokenHash: row.token_hash };
}

async function eliminarSesion(tokenHash) {
    await db.execute('DELETE FROM sessions WHERE token_hash = ?', [tokenHash]);
}

async function cargarBootstrap(user) {
    const [puntoRows] = user && user.rol === 'admin'
        ? await db.query('SELECT * FROM puntos ORDER BY id')
        : await db.query("SELECT * FROM puntos WHERE ficha->>'estado' = 'verificada' ORDER BY id");
    const [residuos] = await db.query('SELECT id, nombre FROM residuos ORDER BY id');
    let reportes = [];
    let bitacora = [];
    if (user && user.rol === 'admin') {
        const [rows] = await db.query('SELECT * FROM reportes ORDER BY id DESC');
        reportes = rows.map(formatearReporte);
        [bitacora] = await db.query('SELECT fecha, admin, accion, detalle FROM bitacora ORDER BY id DESC LIMIT 200');
    } else if (user) {
        const [rows] = await db.execute('SELECT * FROM reportes WHERE user_id = ? ORDER BY id DESC', [user.id]);
        reportes = rows.map(formatearReporte);
    }
    return {
        session: user ? { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } : null,
        puntos: puntoRows.map(formatearPunto),
        residuos: residuos.map((row) => ({ id: Number(row.id), nombre: row.nombre })),
        reportes,
        bitacora: bitacora.map((row) => ({ fecha: new Date(row.fecha).toISOString(), admin: row.admin, accion: row.accion, detalle: row.detalle }))
    };
}

async function obtenerPunto(id, connection = db) {
    const [rows] = await connection.execute('SELECT * FROM puntos WHERE id = ?', [id]);
    return rows.length ? formatearPunto(rows[0]) : null;
}

async function insertarPunto(datos, user) {
    const punto = puntoPorDefecto(datos);
    return transaccion(async (connection) => {
        const [result] = await connection.execute(
            `INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?::jsonb, ?::jsonb, ?::jsonb)`,
            [punto.nombre, punto.calle, punto.colonia, punto.alcaldia, punto.cp, punto.lat, punto.lng,
                JSON.stringify(punto.residuos), JSON.stringify(punto.horarios), JSON.stringify(punto.ficha)]
        );
        const creado = await obtenerPunto(result.insertId, connection);
        await guardarAuditoria(connection, user, 'Punto creado', creado.nombre);
        return creado;
    });
}

async function actualizarPunto(id, datos, user, accion) {
    return transaccion(async (connection) => {
        const actual = await obtenerPunto(id, connection);
        if (!actual) return null;
        const punto = puntoPorDefecto(Object.assign({}, actual, datos));
        await connection.execute(
            `UPDATE puntos SET nombre = ?, calle = ?, colonia = ?, alcaldia = ?, cp = ?, lat = ?, lng = ?,
            residuos = ?::jsonb, horarios = ?::jsonb, ficha = ?::jsonb WHERE id = ?`,
            [punto.nombre, punto.calle, punto.colonia, punto.alcaldia, punto.cp, punto.lat, punto.lng,
                JSON.stringify(punto.residuos), JSON.stringify(punto.horarios), JSON.stringify(punto.ficha), id]
        );
        const actualizado = await obtenerPunto(id, connection);
        await guardarAuditoria(connection, user, accion || 'Punto actualizado', actualizado.nombre);
        return actualizado;
    });
}

async function eliminarPunto(id, user) {
    return transaccion(async (connection) => {
        const punto = await obtenerPunto(id, connection);
        if (!punto) return false;
        await connection.execute('DELETE FROM puntos WHERE id = ?', [id]);
        await guardarAuditoria(connection, user, 'Punto eliminado', punto.nombre);
        return true;
    });
}

async function obtenerReporte(id, connection = db) {
    const [rows] = await connection.execute('SELECT * FROM reportes WHERE id = ?', [id]);
    return rows.length ? formatearReporte(rows[0]) : null;
}

module.exports = {
    pool: db, DIAS, NOMBRE_DIA, ALCALDIAS, MOTIVOS, TIPOS_RESIDUO, inicializar, usuarioPorEmail, usuarioOAuth,
    usuarioPorSesion, eliminarSesion, cargarBootstrap, transaccion, guardarAuditoria,
    obtenerPunto, insertarPunto, actualizarPunto, eliminarPunto, obtenerReporte, formatearReporte
};
