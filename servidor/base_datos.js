const mysql = require('mysql2/promise');
const fs = require('node:fs/promises');
const path = require('node:path');

//esta es conexion a la base de datos y principalmente pool es para que guarde de manera momentanea y consulte

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'reciclame_esta',
    password: process.env.MYSQL_PASSWORD || '091119',
    database: process.env.MYSQL_DATABASE || 'reciclame_esta',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: true } : undefined
});

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

// Mantiene compatibles las bases de datos creadas antes de que existieran
// la respuesta del administrador y el estado "Devuelto".
async function asegurarEsquemaReportes() {
    const [respuesta] = await pool.query("SHOW COLUMNS FROM reportes LIKE 'respuesta_admin'");
    if (!respuesta.length) {
        await pool.query("ALTER TABLE reportes ADD COLUMN respuesta_admin VARCHAR(500) NOT NULL DEFAULT '' AFTER estado");
    }
    const [estado] = await pool.query("SHOW COLUMNS FROM reportes LIKE 'estado'");
    if (estado.length && !String(estado[0].Type || '').includes('Devuelto')) {
        await pool.query("ALTER TABLE reportes MODIFY COLUMN estado ENUM('Nuevo','Alta','Devuelto') NOT NULL DEFAULT 'Nuevo'");
    }
}

async function inicializar() {
    const schemaPath = path.join(__dirname, '..', 'base_de_datos', 'Reciclame_esta.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    const statements = schema.split(';').map((part) => part.trim()).filter(Boolean)
        .filter((statement) => !/^(CREATE DATABASE|CREATE USER|GRANT|USE)\b/i.test(statement));
    for (const statement of statements) {
        await pool.query(statement);
    }
    await asegurarEsquemaReportes();
    for (const nombre of TIPOS_RESIDUO) {
        await pool.execute('INSERT IGNORE INTO residuos (nombre) VALUES (?)', [nombre]);
    }
}

async function transaccion(callback) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function guardarAuditoria(connection, user, accion, detalle) {
    await connection.execute(
        'INSERT INTO bitacora (admin_id, admin, accion, detalle) VALUES (?, ?, ?, ?)',
        [user.id, user.nombre, accion.slice(0, 120), detalle.slice(0, 500)]
    );
}

async function usuarioPorEmail(email) {
    const [rows] = await pool.execute(
        'SELECT id, email, nombre, password_hash, rol FROM users WHERE email = ?',
        [email]
    );
    return rows[0] || null;
}

// Crea o reutiliza la cuenta local que corresponde a un correo verificado por Supabase.
// Si la cuenta ya existía (por ejemplo, un administrador), conserva su rol.
async function usuarioOAuth(email, nombre, passwordHash) {
    const buscar = async () => {
        const [rows] = await pool.execute(
            'SELECT id, email, nombre, rol FROM users WHERE email = ?',
            [email]
        );
        if (!rows.length) return null;
        return { id: Number(rows[0].id), email: rows[0].email, nombre: rows[0].nombre, rol: rows[0].rol };
    };

    const existente = await buscar();
    if (existente) return existente;

    try {
        const [result] = await pool.execute(
            'INSERT INTO users (email, nombre, password_hash, rol) VALUES (?, ?, ?, ?)',
            [email, nombre || email.split('@')[0], passwordHash, 'usuario']
        );
        return { id: Number(result.insertId), email, nombre: nombre || email.split('@')[0], rol: 'usuario' };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            const creado = await buscar();
            if (creado) return creado;
        }
        throw error;
    }
}

async function usuarioPorSesion(tokenHash) {
    const [rows] = await pool.execute(
        `SELECT users.id, users.email, users.nombre, users.rol, sessions.token_hash
        FROM sessions JOIN users ON users.id = sessions.user_id
        WHERE sessions.token_hash = ? AND sessions.expires_at > UTC_TIMESTAMP()`,
        [tokenHash]
    );
    if (!rows.length) return null;
    const row = rows[0];
    return { id: Number(row.id), email: row.email, nombre: row.nombre, rol: row.rol, tokenHash: row.token_hash };
}

async function eliminarSesion(tokenHash) {
    await pool.execute('DELETE FROM sessions WHERE token_hash = ?', [tokenHash]);
}

async function cargarBootstrap(user) {
    const [puntoRows] = user && user.rol === 'admin'
        ? await pool.query('SELECT * FROM puntos ORDER BY id')
        : await pool.query(`SELECT * FROM puntos WHERE JSON_UNQUOTE(JSON_EXTRACT(ficha, '$.estado')) = 'verificada' ORDER BY id`);
    const [residuos] = await pool.query('SELECT id, nombre FROM residuos ORDER BY id');
    let reportes = [];
    let bitacora = [];
    if (user && user.rol === 'admin') {
        const [rows] = await pool.query('SELECT * FROM reportes ORDER BY id DESC');
        reportes = rows.map(formatearReporte);
        [bitacora] = await pool.query('SELECT fecha, admin, accion, detalle FROM bitacora ORDER BY id DESC LIMIT 200');
    } else if (user) {
        const [rows] = await pool.execute('SELECT * FROM reportes WHERE user_id = ? ORDER BY id DESC', [user.id]);
        reportes = rows.map(formatearReporte);
    }
    return {
        session: user ? { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } : null,
        puntos: puntoRows.map(formatearPunto),
        residuos: residuos.map((row) => ({ id: Number(row.id), nombre: row.nombre })),
        reportes,
        bitacora: bitacora.map((row) => ({ fecha: new Date(row.fecha).toISOString(), admin: row.admin,
        accion: row.accion, detalle: row.detalle }))
    };
}

async function obtenerPunto(id, connection = pool) {
    const [rows] = await connection.execute('SELECT * FROM puntos WHERE id = ?', [id]);
    return rows.length ? formatearPunto(rows[0]) : null;
}

async function insertarPunto(datos, user) {
    const punto = puntoPorDefecto(datos);
    return transaccion(async (connection) => {
        const [result] = await connection.execute(
        `INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        residuos = ?, horarios = ?, ficha = ? WHERE id = ?`,
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

async function obtenerReporte(id, connection = pool) {
    const [rows] = await connection.execute('SELECT * FROM reportes WHERE id = ?', [id]);
    return rows.length ? formatearReporte(rows[0]) : null;
}

module.exports = {
    pool, DIAS, NOMBRE_DIA, ALCALDIAS, MOTIVOS, TIPOS_RESIDUO, inicializar, usuarioPorEmail, usuarioOAuth,
    usuarioPorSesion, eliminarSesion, cargarBootstrap,
    transaccion, guardarAuditoria, obtenerPunto, insertarPunto, actualizarPunto, eliminarPunto,
    obtenerReporte, formatearReporte
};
