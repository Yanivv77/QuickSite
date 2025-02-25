import { Effect } from "effect";
import { 
  products as products_table,
  subcategories as subcategories_table,
  subcollections as subcollections_table,
  categories as categories_table
} from "../src/db/schema";
import { db } from "@/db";
import { sql } from "drizzle-orm";

const main = Effect.gen(function* () {
  console.log("🚀 Starting deep cleanup process...");
  
  let totalRemovedSubcategories = 0;
  let totalRemovedSubcollections = 0;
  let totalRemovedCategories = 0;
  let continueCleanup = true;
  let passCount = 0;
  
  // Run multiple passes until no more entities are removed
  while (continueCleanup) {
    passCount++;
    console.log(`\n🔄 Starting cleanup pass #${passCount}...`);
    let removedInThisPass = 0;
    
    // Step 1: Find and delete empty subcategories
    console.log("🔍 Finding subcategories without products...");
    
    const subcategoriesWithoutProducts = yield* Effect.tryPromise(() =>
      db.select({
        slug: subcategories_table.slug,
        name: subcategories_table.name
      })
      .from(subcategories_table)
      .leftJoin(
        products_table,
        sql`${products_table.subcategory_slug} = ${subcategories_table.slug}`
      )
      .groupBy(subcategories_table.slug, subcategories_table.name)
      .having(sql`COUNT(${products_table.slug}) = 0`)
    );
    
    console.log(`📋 Found ${subcategoriesWithoutProducts.length} subcategories without products`);
    
    if (subcategoriesWithoutProducts.length > 0) {
      console.log("🗄️ Deleting empty subcategories...");
      
      const subcategorySlugsToRemove = subcategoriesWithoutProducts.map(s => s.slug);
      
      for (const slug of subcategorySlugsToRemove) {
        try {
          const result = yield* Effect.tryPromise(() =>
            db.delete(subcategories_table)
              .where(sql`${subcategories_table.slug} = ${slug}`)
              .returning({ deleted: sql<number>`1` })
          );
          
          if (result.length > 0) {
            removedInThisPass++;
            totalRemovedSubcategories++;
          }
        } catch (error) {
          console.error(`Error deleting subcategory ${slug}:`, error);
        }
      }
      
      console.log(`✅ Deleted ${subcategorySlugsToRemove.length} empty subcategories`);
    }
    
    // Step 2: Find and delete empty subcollections
    console.log("🔍 Finding subcollections without subcategories...");
    
    const subcollectionsWithoutSubcategories = yield* Effect.tryPromise(() =>
      db.select({
        id: subcollections_table.id,
        name: subcollections_table.name
      })
      .from(subcollections_table)
      .leftJoin(
        subcategories_table,
        sql`${subcategories_table.subcollection_id} = ${subcollections_table.id}`
      )
      .groupBy(subcollections_table.id, subcollections_table.name)
      .having(sql`COUNT(${subcategories_table.slug}) = 0`)
    );
    
    console.log(`📋 Found ${subcollectionsWithoutSubcategories.length} subcollections without subcategories`);
    
    if (subcollectionsWithoutSubcategories.length > 0) {
      console.log("🗄️ Deleting empty subcollections...");
      
      const subcollectionIdsToRemove = subcollectionsWithoutSubcategories.map(s => s.id);
      
      for (const id of subcollectionIdsToRemove) {
        try {
          const result = yield* Effect.tryPromise(() =>
            db.delete(subcollections_table)
              .where(sql`${subcollections_table.id} = ${id}`)
              .returning({ deleted: sql<number>`1` })
          );
          
          if (result.length > 0) {
            removedInThisPass++;
            totalRemovedSubcollections++;
          }
        } catch (error) {
          console.error(`Error deleting subcollection ${id}:`, error);
        }
      }
      
      console.log(`✅ Deleted ${subcollectionIdsToRemove.length} empty subcollections`);
    }
    
    // Step 3: Find and delete empty categories
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
      .groupBy(categories_table.slug, categories_table.name)
      .having(sql`COUNT(${subcollections_table.id}) = 0`)
    );
    
    console.log(`📋 Found ${categoriesWithoutSubcollections.length} categories without subcollections`);
    
    if (categoriesWithoutSubcollections.length > 0) {
      console.log("🗄️ Deleting empty categories...");
      
      const categorySlugsToRemove = categoriesWithoutSubcollections.map(c => c.slug);
      
      for (const slug of categorySlugsToRemove) {
        try {
          const result = yield* Effect.tryPromise(() =>
            db.delete(categories_table)
              .where(sql`${categories_table.slug} = ${slug}`)
              .returning({ deleted: sql<number>`1` })
          );
          
          if (result.length > 0) {
            removedInThisPass++;
            totalRemovedCategories++;
          }
        } catch (error) {
          console.error(`Error deleting category ${slug}:`, error);
        }
      }
      
      console.log(`✅ Deleted ${categorySlugsToRemove.length} empty categories`);
    }
    
    // Check if we should continue with another pass
    continueCleanup = removedInThisPass > 0 && passCount < 5; // Limit to 5 passes to prevent infinite loops
    
    console.log(`📊 Pass #${passCount} summary: Removed ${removedInThisPass} entities`);
  }
  
  console.log("\n📈 Final cleanup summary:");
  console.log(`🗑️ Removed ${totalRemovedSubcategories} empty subcategories`);
  console.log(`🗑️ Removed ${totalRemovedSubcollections} empty subcollections`);
  console.log(`🗑️ Removed ${totalRemovedCategories} empty categories`);
  console.log(`🔄 Total passes: ${passCount}`);
  
  console.log("✅ Deep cleanup process completed successfully.");
});

// Run the effect
Effect.runPromiseExit(main).then(exit => {
  console.log(exit.toString());
}); 