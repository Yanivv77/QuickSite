import { Effect } from "effect";
import { products as products_table } from "../src/db/schema";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { del, list } from "@vercel/blob";

const main = Effect.gen(function* () {
  console.log("🚀 Starting cleanup process...");
  
  // Step 1: Count total products
  console.log("📊 Counting total products...");
  const countResult = yield* Effect.tryPromise(() =>
    db.select({ count: sql<number>`count(*)` }).from(products_table)
  );
  
  const totalProducts = countResult[0].count;
  console.log(`📈 Total products in database: ${totalProducts}`);
  
  if (totalProducts <= 10000) {
    console.log("✅ Already have 10,000 or fewer products. No cleanup needed.");
    return;
  }
  
  const toRemove = totalProducts - 10000;
  console.log(`🗑️ Need to remove ${toRemove} products to reach target of 10,000`);
  
  // Step 2: Get products to remove - selecting by slug order
  console.log("🔍 Finding products to remove...");
  const productsToRemove = yield* Effect.tryPromise(() =>
    db.select({
      slug: products_table.slug,
      image_url: products_table.image_url
    })
    .from(products_table)
    .orderBy(products_table.slug) // Order by slug
    .limit(toRemove)
  );
  
  console.log(`📋 Found ${productsToRemove.length} products to remove`);
  
  // Step 3: Delete images from blob storage
  console.log("🖼️ Deleting images from blob storage...");
  let deletedImages = 0;
  let failedImages = 0;
  
  // Create progress tracking
  const productsWithImages = productsToRemove.filter(p => p.image_url);
  const totalImages = productsWithImages.length;
  
  if (totalImages > 0) {
    const updateProgress = (current: number) => {
      const percent = Math.round((current / totalImages) * 100);
      process.stdout.write(`\r🔄 Progress: ${current}/${totalImages} (${percent}%) images processed`);
    };
    
    let processedImages = 0;
    
    yield* Effect.forEach(
      productsWithImages,
      (product, index) => Effect.gen(function* () {
        try {
          if (product.image_url) {
            // Extract the blob path from the URL
            const url = new URL(product.image_url);
            if (url.hostname.includes('vercel-storage.com')) {
              // Extract just the path part for deletion
              const pathMatch = url.pathname.match(/\/products\/(.+)$/);
              
              if (pathMatch && pathMatch[1]) {
                const path = `products/${pathMatch[1]}`;
                yield* Effect.tryPromise(() => del(path));
                deletedImages++;
              }
            }
          }
        } catch (error) {
          failedImages++;
          console.error(`\nError deleting image for ${product.slug}:`, error);
        }
        
        processedImages++;
        // Update progress every 10 items
        if (processedImages % 10 === 0) {
          updateProgress(processedImages);
        }
      }),
      { concurrency: 10 }
    );
    
    // Final progress update
    updateProgress(totalImages);
    console.log("\n");
    
    console.log(`✅ Deleted ${deletedImages} images from blob storage`);
    if (failedImages > 0) {
      console.log(`⚠️ Failed to delete ${failedImages} images`);
    }
  } else {
    console.log("No images to delete.");
  }
  
  // Step 4: Delete products from database
  console.log("🗄️ Deleting products from database...");
  
  // Get all slugs to remove
  const allSlugsToRemove = productsToRemove.map(p => p.slug);
  
  console.log(`🗑️ Total products to remove: ${allSlugsToRemove.length}`);
  
  // Delete in smaller batches to avoid overwhelming the database
  const batchSize = 100; // Smaller batch size
  const totalBatches = Math.ceil(allSlugsToRemove.length / batchSize);
  
  for (let i = 0; i < allSlugsToRemove.length; i += batchSize) {
    const batch = allSlugsToRemove.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    
    console.log(`🔄 Deleting batch ${batchNumber}/${totalBatches}...`);
    
    // Use a simpler approach with individual deletes
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
  
  if (finalCount <= 10000) {
    console.log("✅ Successfully reduced products to 10,000 or fewer.");
  } else {
    console.log(`⚠️ Warning: Still have ${finalCount} products, which is ${finalCount - 10000} more than the target.`);
  }
  
  console.log("✅ Cleanup process completed.");
});

// Run the effect
Effect.runPromiseExit(main).then(exit => {
  console.log(exit.toString());
});
