import { Effect } from "effect";
import { products as products_table } from "../src/db/schema";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { list } from "@vercel/blob";

const main = Effect.gen(function* () {
  console.log("🚀 Starting cleanup process for products without blob images...");
  
  // Step 1: Count total products
  console.log("📊 Counting total products...");
  const countResult = yield* Effect.tryPromise(() =>
    db.select({ count: sql<number>`count(*)` }).from(products_table)
  );
  
  const totalProducts = countResult[0].count;
  console.log(`📈 Total products in database: ${totalProducts}`);
  
  // Step 2: Get list of existing blob images
  console.log("🔍 Fetching list of images in blob storage...");
  const blobList = yield* Effect.tryPromise(() => list({ prefix: "products/" }));
  
  // Create a set of image paths that exist in blob storage
  const existingBlobPaths = new Set(blobList.blobs.map(blob => blob.url));
  console.log(`📊 Found ${existingBlobPaths.size} images in blob storage`);
  
  // Step 3: Find products with missing images (image_url exists but file doesn't)
  console.log("🔍 Finding products with missing images...");
  const productsWithImageUrls = yield* Effect.tryPromise(() =>
    db.select({
      slug: products_table.slug,
      image_url: products_table.image_url
    })
    .from(products_table)
    .where(sql`${products_table.image_url} IS NOT NULL AND ${products_table.image_url} != ''`)
  );
  
  // Filter to find products whose images don't exist in blob storage
  const productsWithMissingImages = productsWithImageUrls.filter(product => {
    if (!product.image_url) return false;
    
    try {
      // Try to parse the URL
      const url = new URL(product.image_url);
      
      // Check if it's a vercel blob URL
      if (url.hostname.includes('vercel-storage.com')) {
        return !existingBlobPaths.has(product.image_url);
      }
      
      // For other URLs, consider them as missing
      return true;
    } catch (error) {
      // If URL parsing fails, consider it as missing
      console.log(`Invalid URL format for product ${product.slug}: ${product.image_url}`);
      return true;
    }
  });
  
  console.log(`📋 Found ${productsWithMissingImages.length} products with missing images`);
  
  if (productsWithMissingImages.length === 0) {
    console.log("✅ No products with missing images found. Nothing to clean up.");
    return;
  }
  
  // Step 4: Delete products with missing images from database
  console.log("🗄️ Deleting products with missing images from database...");
  
  // Get all slugs to remove
  const slugsToRemove = productsWithMissingImages.map(p => p.slug);
  
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
  console.log(`✅ Successfully removed ${totalProducts - finalCount} products with missing images.`);
  
  console.log("✅ Cleanup process completed.");
});

// Run the effect
Effect.runPromiseExit(main).then(exit => {
  console.log(exit.toString());
}); 