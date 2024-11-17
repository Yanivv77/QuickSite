import { db } from "@/db"
import { products, subcategories } from "@/db/schema"
import { eq } from "drizzle-orm"

async function removeEmptySubcategories() {
  try {
    // Get all subcategories
    const allSubcategories = await db.select().from(subcategories)
    
    // For each subcategory, check if it has products
    for (const subcategory of allSubcategories) {
      const productsCount = await db
        .select()
        .from(products)
        .where(eq(products.subcategory_slug, subcategory.slug))
        .execute()

      // If no products found, delete the subcategory
      if (productsCount.length === 0) {
        console.log(`Removing empty subcategory: ${subcategory.name} (${subcategory.slug})`)
        await db
          .delete(subcategories)
          .where(eq(subcategories.slug, subcategory.slug))
          .execute()
      }
    }

    console.log('Finished removing empty subcategories')
  } catch (error) {
    console.error('Error removing empty subcategories:', error)
  }
}

// Run the script
removeEmptySubcategories()
