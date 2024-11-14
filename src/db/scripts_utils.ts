import { db } from ".";
import {
  categories,
  collections,
  subcategories,
  subcollections,
} from "./schema";
import { eq, isNull } from "drizzle-orm";


export const getCollections = async () => {
  const result = await db.select({
    id: collections.id,
    name: collections.name,
  }).from(collections)
  .leftJoin(categories, eq(collections.id, categories.collection_id))
  .where(isNull(categories.collection_id));
  
  console.log(`Found ${result.length} collections without categories`);
  return result;
};

export const getCategories = async () => {
  const result = await db.select().from(categories);
  console.log(`Found ${result.length} categories without subcollections`);
  return result;
};

export const getSubcollections = async () => {
  const result = await db
    .select()
    .from(subcollections)
    .leftJoin(
      subcategories,
      eq(subcollections.id, subcategories.subcollection_id),
    )
    .where(isNull(subcategories.subcollection_id))
  console.log(result.length);
  return result;
};