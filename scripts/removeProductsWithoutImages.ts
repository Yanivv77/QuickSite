import { Effect } from "effect";
import { products as products_table } from "../src/db/schema";
import { db } from "@/db";
import { sql } from "drizzle-orm";

const main = Effect.gen(function* () {
  console.log("🚀 Starting cleanup process for products without any images...");
  
  // Step 1: Count total products
  console.log("📊 Counting total products...");
  const countResult = yield* Effect.tryPromise(() =>
    db.select({ count: sql<number>`count(*)` }).from(products_table)
  );
  
  const totalProducts = countResult[0].count;
  console.log(`📈 Total products in database: ${totalProducts}`);
  
  // Step 2: Count products without images
  console.log("🔍 Counting products without images...");
  const noImageCountResult = yield* Effect.tryPromise(() =>
    db.select({ count: sql<number>`count(*)` })
      .from(products_table)
      .where(sql`${products_table.image_url} IS NULL OR ${products_table.image_url} = ''`)
  );
  
  const productsWithoutImages = noImageCountResult[0].count;
  console.log(`📋 Found ${productsWithoutImages} products without images`);
  
  if (productsWithoutImages === 0) {
    console.log("✅ No products without images found. Nothing to clean up.");
    return;
  }
  
  // Step 3: Get products without images
  console.log("🔍 Getting products without images...");
  const productsToRemove = yield* Effect.tryPromise(() =>
    db.select({
      slug: products_table.slug
    })
    .from(products_table)
    .where(sql`${products_table.image_url} IS NULL OR ${products_table.image_url} = ''`)
    .orderBy(products_table.slug)
  );
  
  // Step 4: Delete products without images from database
  console.log("🗄️ Deleting products without images from database...");
  
  // Get all slugs to remove
  const slugsToRemove = productsToRemove.map(p => p.slug);
  
  // Delete in smaller batches to avoid overwhelming the database
  const batchSize = 100;
  const totalBatches = Math.ceil(slugsToRemove.length / batchSize);
  
  for (let i = 0; i < slugsToRemove.length; i += batchSize) {
    const batch = slugsToRemove.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    
    console.log(`🔄 Deleting batch ${batchNumber}/${totalBatches}...`);
    
    // Use individual deletes for reliability
    for (const slug of batch) {
      try {
        yield* Effect.tryPromise(() =>
          db.delete(products_table)
            .where(sql`${products_table.slug} = ${slug}`)
        );
      } catch (error) {
        console.error(`Error deleting product ${slug}:`, error);
      }
    }
  }
  
  // Verify the deletion worked
  const finalCountResult = yield* Effect.tryPromise(() =>
    db.select({ count: sql<number>`count(*)` }).from(products_table)
  );
  
  const finalCount = finalCountResult[0].count;
  console.log(`📈 Final product count: ${finalCount}`);
  console.log(`✅ Successfully removed ${totalProducts - finalCount} products without images.`);
  
  console.log("✅ Cleanup process completed.");
});

// Run the effect
Effect.runPromiseExit(main).then(exit => {
  console.log(exit.toString());
}); 