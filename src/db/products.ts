import { db } from '.';
import { sql, eq } from 'drizzle-orm';
import {
  products,
  subcategories,
  subcollections,
  categories,
  Product,
} from './schema';

export type ProductWithCategory = Product & {
  category_slug: string | null;
};

export async function getRandomProducts(
  limit: number
): Promise<ProductWithCategory[]> {
  const result = await db
    .select({
      product: products,
      category_slug: categories.slug,
    })
    .from(products)
    .leftJoin(
      subcategories,
      eq(products.subcategory_slug, subcategories.slug)
    )
    .leftJoin(
      subcollections,
      eq(subcategories.subcollection_id, subcollections.id)
    )
    .leftJoin(
      categories,
      eq(subcollections.category_slug, categories.slug)
    )
    .orderBy(sql`RANDOM()`)
    .limit(limit)
    .execute();

  // Map the result to match the ProductWithCategory type
  return result.map((row) => ({
    ...row.product,
    category_slug: row.category_slug,
  }));
}