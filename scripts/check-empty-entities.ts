import { Effect } from "effect";
import { 
  products as products_table,
  subcategories as subcategories_table,
  subcollections as subcollections_table,
  categories as categories_table
} from "../src/db/schema";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import fs from "fs";

const main = Effect.gen(function* () {
  console.log("🚀 Starting empty entities check...");
  
  // Create a report object to store all findings
  const report = {
    emptySubcategories: [] as any[],
    emptySubcollections: [] as any[],
    emptyCategories: [] as any[],
    summary: {
      totalCategories: 0,
      totalSubcollections: 0,
      totalSubcategories: 0,
      emptyCategories: 0,
      emptySubcollections: 0,
      emptySubcategories: 0
    }
  };
  
  // Step 1: Find subcategories without products
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
    .groupBy(subcategories_table.slug, subcategories_table.name, subcategories_table.subcollection_id)
    .having(sql`COUNT(${products_table.slug}) = 0`)
  );
  
  // Get total subcategories count
  const totalSubcategoriesResult = yield* Effect.tryPromise(() =>
    db.select({ count: sql<number>`count(*)` }).from(subcategories_table)
  );
  report.summary.totalSubcategories = totalSubcategoriesResult[0].count;
  
  console.log(`📋 Found ${subcategoriesWithoutProducts.length} subcategories without products (out of ${report.summary.totalSubcategories} total)`);
  report.emptySubcategories = subcategoriesWithoutProducts;
  report.summary.emptySubcategories = subcategoriesWithoutProducts.length;
  
  // Step 2: Find subcollections without subcategories that have products
  console.log("🔍 Finding subcollections without active subcategories...");
  
  const subcollectionsWithoutActiveSubcategories = yield* Effect.tryPromise(() =>
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
    .leftJoin(
      products_table,
      sql`${products_table.subcategory_slug} = ${subcategories_table.slug}`
    )
    .groupBy(subcollections_table.id, subcollections_table.name, subcollections_table.category_slug)
    .having(sql`COUNT(DISTINCT ${products_table.slug}) = 0`)
  );
  
  // Get total subcollections count
  const totalSubcollectionsResult = yield* Effect.tryPromise(() =>
    db.select({ count: sql<number>`count(*)` }).from(subcollections_table)
  );
  report.summary.totalSubcollections = totalSubcollectionsResult[0].count;
  
  console.log(`📋 Found ${subcollectionsWithoutActiveSubcategories.length} subcollections without active subcategories (out of ${report.summary.totalSubcollections} total)`);
  report.emptySubcollections = subcollectionsWithoutActiveSubcategories;
  report.summary.emptySubcollections = subcollectionsWithoutActiveSubcategories.length;
  
  // Step 3: Find categories without subcollections that have products
  console.log("🔍 Finding categories without active subcollections...");
  
  const categoriesWithoutActiveSubcollections = yield* Effect.tryPromise(() =>
    db.select({
      slug: categories_table.slug,
      name: categories_table.name
    })
    .from(categories_table)
    .leftJoin(
      subcollections_table,
      sql`${subcollections_table.category_slug} = ${categories_table.slug}`
    )
    .leftJoin(
      subcategories_table,
      sql`${subcategories_table.subcollection_id} = ${subcollections_table.id}`
    )
    .leftJoin(
      products_table,
      sql`${products_table.subcategory_slug} = ${subcategories_table.slug}`
    )
    .groupBy(categories_table.slug, categories_table.name)
    .having(sql`COUNT(DISTINCT ${products_table.slug}) = 0`)
  );
  
  // Get total categories count
  const totalCategoriesResult = yield* Effect.tryPromise(() =>
    db.select({ count: sql<number>`count(*)` }).from(categories_table)
  );
  report.summary.totalCategories = totalCategoriesResult[0].count;
  
  console.log(`📋 Found ${categoriesWithoutActiveSubcollections.length} categories without active subcollections (out of ${report.summary.totalCategories} total)`);
  report.emptyCategories = categoriesWithoutActiveSubcollections;
  report.summary.emptyCategories = categoriesWithoutActiveSubcollections.length;
  
  // Generate a detailed report
  console.log("\n📊 Summary Report:");
  console.log(`Total Categories: ${report.summary.totalCategories}`);
  console.log(`Empty Categories: ${report.summary.emptyCategories} (${Math.round(report.summary.emptyCategories / report.summary.totalCategories * 100)}%)`);
  console.log(`Total Subcollections: ${report.summary.totalSubcollections}`);
  console.log(`Empty Subcollections: ${report.summary.emptySubcollections} (${Math.round(report.summary.emptySubcollections / report.summary.totalSubcollections * 100)}%)`);
  console.log(`Total Subcategories: ${report.summary.totalSubcategories}`);
  console.log(`Empty Subcategories: ${report.summary.emptySubcategories} (${Math.round(report.summary.emptySubcategories / report.summary.totalSubcategories * 100)}%)`);
  
  // Save the report to a file
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const reportPath = `empty-entities-report-${timestamp}.json`;
  
  yield* Effect.tryPromise(() => 
    fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2))
  );
  
  console.log(`\n✅ Report saved to ${reportPath}`);
  
  // Return the report for further processing if needed
  return report;
});

// Run the effect
Effect.runPromiseExit(main).then(exit => {
  console.log(exit.toString());
}); 