import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    host: 'postgres',
    port: 5432,
    database: 'requests',
    user: 'postgres',
    password: 'postgres',
});

export async function getIdRange() {
    const { rows } = await pool.query(
        'SELECT MIN(id) AS min_id, MAX(id) AS max_id, COUNT(*) AS total FROM requests',
    );

    return rows[0];
}

export async function getRequestById(id) {
    const { rows } = await pool.query(
        'SELECT id, full_name, phone, email, message, created_at FROM requests WHERE id = $1',
        [id],
    );

    return rows[0] || null;
}