// Copia una sola vez los datos de MySQL a tablas PostgreSQL ya creadas.
// Por seguridad, el destino debe estar vacío antes de correr el importador.
require('dotenv').config({ path: require('node:path').join(__dirname, '../../.env') });
const mysql = require('mysql2/promise');
const { Pool } = require('pg');

const TABLAS = [
    { nombre: 'users', id: true },
    { nombre: 'residuos', id: true },
    { nombre: 'puntos', id: true, json: ['residuos', 'horarios', 'ficha'] },
    { nombre: 'sessions' },
    { nombre: 'reportes', id: true },
    { nombre: 'bitacora', id: true }
];

async function main() {
    if (!process.env.DATABASE_URL) throw new Error('Configura DATABASE_URL en .env con la conexión Postgres de Supabase.');
    let origen;
    let destino;
    let pg;
    try {
        origen = await mysql.createConnection({
            host: process.env.MYSQL_HOST || '127.0.0.1',
            port: Number(process.env.MYSQL_PORT || 3306),
            user: process.env.MYSQL_USER || 'reciclame_esta',
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE || 'reciclame_esta',
            ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: true } : undefined
        });
        destino = new Pool({ connectionString: process.env.DATABASE_URL, max: 2, connectionTimeoutMillis: 10000 });
        pg = await destino.connect();
        for (const tabla of TABLAS) {
            const { rows } = await pg.query(`SELECT COUNT(*)::int AS total FROM ${tabla.nombre}`);
            if (rows[0].total !== 0) {
                throw new Error(`La tabla destino ${tabla.nombre} ya tiene datos. No se modificó ninguna tabla; usa un proyecto Supabase vacío para importar.`);
            }
        }

        await pg.query('BEGIN');
        for (const tabla of TABLAS) {
            const [filas] = await origen.query(`SELECT * FROM ${tabla.nombre}`);
            if (!filas.length) {
                console.log(`${tabla.nombre}: 0 filas`);
                continue;
            }
            const columnas = Object.keys(filas[0]);
            const listaColumnas = columnas.map((col) => `"${col.replace(/"/g, '""')}"`).join(', ');
            for (const fila of filas) {
                const valores = columnas.map((columna) => {
                    const valor = fila[columna];
                    return tabla.json && tabla.json.includes(columna) && valor != null
                        ? (typeof valor === 'string' ? valor : JSON.stringify(valor))
                        : valor;
                });
                const marcas = columnas.map((columna, indice) => {
                    const marca = `$${indice + 1}`;
                    return tabla.json && tabla.json.includes(columna) ? `${marca}::jsonb` : marca;
                }).join(', ');
                await pg.query(`INSERT INTO ${tabla.nombre} (${listaColumnas}) VALUES (${marcas})`, valores);
            }
            console.log(`${tabla.nombre}: ${filas.length} filas copiadas`);
        }
        for (const tabla of TABLAS.filter((item) => item.id)) {
            await pg.query(`SELECT setval(pg_get_serial_sequence('${tabla.nombre}', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM ${tabla.nombre}`);
        }
        await pg.query('COMMIT');
        console.log('Importación completada.');
    } catch (error) {
        if (pg) await pg.query('ROLLBACK').catch(() => {});
        throw error;
    } finally {
        if (pg) pg.release();
        if (destino) await destino.end();
        if (origen) await origen.end();
    }
}

main().catch((error) => {
    console.error('No se completó la importación:', error.message);
    process.exitCode = 1;
});
