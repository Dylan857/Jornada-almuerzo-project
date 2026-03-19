import { Pool, PoolClient, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

function createPool(): Pool {
  return new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

const pool = createPool();

export async function readSession(
  query: string,
  params: any[] = [],
  options?: {
    transaction?: boolean;
    lock?: boolean;
  },
): Promise<QueryResult<any>> {
  const client = await pool.connect();

  try {
    if (options?.transaction) {
      await client.query('BEGIN');
    }

    let finalQuery = query;

    if (options?.lock) {
      finalQuery += ' FOR UPDATE';
    }

    const result = await client.query(finalQuery, params);

    if (options?.transaction) {
      await client.query('COMMIT');
    }

    return result;
  } catch (error) {
    if (options?.transaction) {
      await client.query('ROLLBACK');
    }

    throw error;
  } finally {
    client.release();
  }
}

export async function writeSession(
  query: string,
  params: any[] = [],
): Promise<QueryResult<any>> {
  const client: PoolClient = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(query, params);

    await client.query('COMMIT');

    return result;
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  } finally {
    client.release();
  }
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await callback(client);

    await client.query('COMMIT');

    return result;
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  } finally {
    client.release();
  }
}
