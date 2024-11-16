import { products } from './schema'
import { db } from '.'
import { sql } from 'drizzle-orm'

export async function getRandomProducts(limit: number) {
  // Using SQL RANDOM() with LIMIT is more efficient than fetching all and filtering
  return await db.select()
    .from(products)
    .orderBy(sql`RANDOM()`)
    .limit(limit)
    .execute()
}