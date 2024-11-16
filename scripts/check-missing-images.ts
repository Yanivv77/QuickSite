import { isNull } from "drizzle-orm";
import { db } from "../src/db";
import { products } from "../src/db/schema";

async function checkMissingImages() {
    console.log("⏳ Checking for products without images...");
    const start = Date.now();

    const productsWithoutImage = await db
        .select({
            slug: products.slug,
            name: products.name
        })
        .from(products)
        .where(isNull(products.image_url));

    const end = Date.now();
    
    console.log("📊 Results:");
    console.log(`Found ${productsWithoutImage.length} products without images`);
    console.log(`\n✅ Check completed in ${end - start}ms`);
    
    process.exit(0);
}

checkMissingImages().catch((err) => {
    console.error("❌ Check failed");
    console.error(err);
    process.exit(1);
});
