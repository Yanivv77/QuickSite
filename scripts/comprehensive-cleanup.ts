import { Effect } from "effect";
import { 
  products as products_table,
  subcategories as subcategories_table,
  subcollections as subcollections_table,
  categories as categories_table
} from "../src/db/schema";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { list, del } from "@vercel/blob";

const main = Effect.gen(function* () {
  console.log("🚀 Starting comprehensive cleanup process...");
  
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
  console.log("🔍 Finding products with missing or invalid images...");
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
  
  console.log(`📋 Found ${productsWithMissingImages.length} products with missing or invalid images`);
  
  // Step 4: Find products without any images
  console.log("🔍 Finding products without any images...");
  const productsWithoutImages = yield* Effect.tryPromise(() =>
    db.select({
      slug: products_table.slug
    })
    .from(products_table)
    .where(sql`${products_table.image_url} IS NULL OR ${products_table.image_url} = ''`)
  );
  
  console.log(`📋 Found ${productsWithoutImages.length} products without any images`);
  
  // Step 5: Combine all products to remove
  const allProductsToRemove = [
    ...productsWithMissingImages,
    ...productsWithoutImages
  ];
  
  const uniqueSlugsToRemove = [...new Set(allProductsToRemove.map(p => p.slug))];
  
  console.log(`🗑️ Total unique products to remove: ${uniqueSlugsToRemove.length}`);
  
  if (uniqueSlugsToRemove.length === 0) {
    console.log("✅ No products to remove. Proceeding to check for empty entities.");
  } else {
    // Step 6: Delete products from database
    console.log("🗄️ Deleting products from database...");
    
    // Delete in smaller batches to avoid overwhelming the database
    const batchSize = 100;
    const totalBatches = Math.ceil(uniqueSlugsToRemove.length / batchSize);
    
    for (let i = 0; i < uniqueSlugsToRemove.length; i += batchSize) {
      const batch = uniqueSlugsToRemove.slice(i, i + batchSize);
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
  }
  
  // Step 7: Find and delete empty subcategories
  console.log("🔍 Finding subcategories without products...");
  
  const subcategoriesWithoutProducts = yield* Effect.tryPromise(() =>
    db.select({
      slug: subcategories_table.slug,
      name: subcategories_table.name,
      subcollection_id: subcategories_table.subcollection_id
    })
    .from(subcategories_table)
    .leftJoin(
      products_table,
      sql`${products_table.subcategory_slug} = ${subcategories_table.slug}`
    )
    .where(sql`${products_table.slug} IS NULL`)
  );
  
  console.log(`📋 Found ${subcategoriesWithoutProducts.length} subcategories without products`);
  
  if (subcategoriesWithoutProducts.length > 0) {
    console.log("🗄️ Deleting empty subcategories...");
    
    const subcategorySlugsToRemove = subcategoriesWithoutProducts.map(s => s.slug);
    
    for (const slug of subcategorySlugsToRemove) {
      try {
        yield* Effect.tryPromise(() =>
          db.delete(subcategories_table)
            .where(sql`${subcategories_table.slug} = ${slug}`)
        );
      } catch (error) {
        console.error(`Error deleting subcategory ${slug}:`, error);
      }
    }
    
    console.log(`✅ Deleted ${subcategorySlugsToRemove.length} empty subcategories`);
  }
  
  // Step 8: Find and delete empty subcollections
  console.log("🔍 Finding subcollections without subcategories...");
  
  const subcollectionsWithoutSubcategories = yield* Effect.tryPromise(() =>
    db.select({
      id: subcollections_table.id,
      name: subcollections_table.name,
      category_slug: subcollections_table.category_slug
    })
    .from(subcollections_table)
    .leftJoin(
      subcategories_table,
      sql`${subcategories_table.subcollection_id} = ${subcollections_table.id}`
    )
    .where(sql`${subcategories_table.slug} IS NULL`)
  );
  
  console.log(`📋 Found ${subcollectionsWithoutSubcategories.length} subcollections without subcategories`);
  
  if (subcollectionsWithoutSubcategories.length > 0) {
    console.log("🗄️ Deleting empty subcollections...");
    
    const subcollectionIdsToRemove = subcollectionsWithoutSubcategories.map(s => s.id);
    
    for (const id of subcollectionIdsToRemove) {
      try {
        yield* Effect.tryPromise(() =>
          db.delete(subcollections_table)
            .where(sql`${subcollections_table.id} = ${id}`)
        );
      } catch (error) {
        console.error(`Error deleting subcollection ${id}:`, error);
      }
    }
    
    console.log(`✅ Deleted ${subcollectionIdsToRemove.length} empty subcollections`);
  }
  
  // Step 9: Find and delete empty categories
  console.log("🔍 Finding categories without subcollections...");
  
  const categoriesWithoutSubcollections = yield* Effect.tryPromise(() =>
    db.select({
      slug: categories_table.slug,
      name: categories_table.name
    })
    .from(categories_table)
    .leftJoin(
      subcollections_table,
      sql`${subcollections_table.category_slug} = ${categories_table.slug}`
    )
    .where(sql`${subcollections_table.id} IS NULL`)
  );
  
  console.log(`📋 Found ${categoriesWithoutSubcollections.length} categories without subcollections`);
  
  if (categoriesWithoutSubcollections.length > 0) {
    console.log("🗄️ Deleting empty categories...");
    
    const categorySlugsToRemove = categoriesWithoutSubcollections.map(c => c.slug);
    
    for (const slug of categorySlugsToRemove) {
      try {
        yield* Effect.tryPromise(() =>
          db.delete(categories_table)
            .where(sql`${categories_table.slug} = ${slug}`)
        );
      } catch (error) {
        console.error(`Error deleting category ${slug}:`, error);
      }
    }
    
    console.log(`✅ Deleted ${categorySlugsToRemove.length} empty categories`);
  }
  
  // Step 10: Verify final product count
  const finalCountResult = yield* Effect.tryPromise(() =>
    db.select({ count: sql<number>`count(*)` }).from(products_table)
  );
  
  const finalCount = finalCountResult[0].count;
  console.log(`📈 Final product count: ${finalCount}`);
  console.log(`✅ Successfully removed ${totalProducts - finalCount} products in total.`);
  
  console.log("✅ Comprehensive cleanup process completed successfully.");
});

// Run the effect
Effect.runPromiseExit(main).then(exit => {
  console.log(exit.toString());
}); 