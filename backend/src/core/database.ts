import { Pool } from 'pg';
import * as v from 'valibot';
import { Kysely, PostgresDialect, type SelectQueryBuilder, type Generated } from 'kysely';
import type { EndpointResponse } from './types';

export const valPagination = v.partial(
  v.object({
    page: v.pipe(v.number()),
    limit: v.pipe(v.number()),
    order: v.array(v.string()),
  })
)

export const valUUID = v.object({
  uuid: v.pipe(v.string(), v.uuid()),
})

export type Pagination = v.InferInput<typeof valPagination>

export type UUID = v.InferInput<typeof valUUID>

export type Auditory = {
  uuid: string;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
  deleted_at: Date | null;
  deleted_by: string | null;
}

const pools = new Map<string, Pool>();

export const getPool = (database = "postgres"): Pool => {
  // 2. Verificamos si ya existe un pool para esta base de datos
  if (!pools.has(database)) {
    console.log(`--- Creando nuevo pool para: ${database} ---`);

    const newPool = new Pool({
      database,
      host: Bun.env.DB_HOST,
      user: Bun.env.DB_USER,
      password: Bun.env.DB_PASSWORD,
      port: Number(Bun.env.DB_PORT)
    });

    newPool.on('error', (err) => {
      console.error('Error inesperado en el pool de Postgres', err);
    });

    pools.set(database, newPool);
  }

  // 3. Retornamos el pool existente (garantizado por el check anterior)
  return pools.get(database)!;
};

export const dbConnection = (database: string) =>
  new PostgresDialect({
    pool: getPool(database),
  });

export const useDb = <T>(database: string): Kysely<T> =>
  new Kysely<T>({ dialect: dbConnection(database) });


export const getData = async <DB, TB extends keyof DB, O>(query: SelectQueryBuilder<DB, TB, O>, payload?: Record<string, any>): Promise<EndpointResponse> => {


  const { page, limit, order, ...filters } = payload || {};


  const currentPage = Number(page) || 1;
  const rows = Number(limit) || 0;
  const offset = (currentPage - 1) * rows;

  let baseQuery = query;
  let countQuery = query.clearSelect().select(({ fn }) => fn.countAll().as('total'));

  // 🔎 Filtros
  const applyFilter = (qb: any, key: string, value: string) => {

    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
    const isISODate = /^\d{4}-\d{2}-\d{2}T/.test(value);

    if (isDateOnly) {
      const from = new Date(`${value}T00:00:00.000Z`);
      const to = new Date(`${value}T23:59:59.999Z`);

      return qb
        .where(key, '>=', from)
        .where(key, '<=', to);
    }

    if (isISODate) {
      return qb.where(key, '=', new Date(value));
    }

    if (value.length === 36) {
      return qb.where(key as any, '=', value);
    }

    return qb.where(key as any, 'ilike', `%${value}%`);
  };

  if (Object.keys(filters).length > 0) {
    for (const [key, value] of Object.entries(filters)) {
      baseQuery = applyFilter(baseQuery, key, value);
      countQuery = applyFilter(countQuery, key, value);
    }
  }

  // 🔃 Ordenamiento
  if (Array.isArray(order)) {
    for (const item of order) {
      const [field, direction] = Object.entries(item)[0] as [
        keyof O & string,
        'asc' | 'desc'
      ];
      baseQuery = baseQuery.orderBy(field as any, direction === 'desc' ? 'desc' : 'asc');
    }
  }

  // 📄 Paginación
  if (rows > 0) {
    baseQuery = baseQuery.limit(rows).offset(offset);
  }

  // 🚀 Ejecutar
  const [totalResult, data] = await Promise.all([
    countQuery.executeTakeFirst(),
    baseQuery.execute(),
  ]);

  const totalRows = Number(totalResult ?? 0);

  let response: EndpointResponse

  rows > 0 && totalRows > rows ? response = {
    pagination: {
      total: totalRows,
      pages: rows > 0 ? Math.ceil(totalRows / rows) : 1,
    },
    data: data.map((row: any) => {
      const { created_at, updated_at, deleted_at, created_by, updated_by, deleted_by, ...rest } = row;
      return rest;
    })
  } : response = {
    data: data.map((row: any) => {
      const { created_at, updated_at, deleted_at, created_by, updated_by, deleted_by, ...rest } = row;
      return rest;
    })
  };

  console.log(response)

  return response
};