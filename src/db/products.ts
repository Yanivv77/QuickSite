import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function getRandomProducts(limit: number = 2) {
  return await db.query.products.findMany({
    columns: {
      name: true,
      image_url: true,
      slug: true,
    },
    orderBy: sql`RANDOM()`,
    limit,
  });
}