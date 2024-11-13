import { sql } from "drizzle-orm";
import { db } from "../src/db";

if (!("POSTGRES_URL" in process.env)) throw new Error("POSTGRES_URL not found on .env.development");

async function resetCategories() {
    console.log("⏳ Deleting all categories...");
    const start = Date.now();

    const query = sql`TRUNCATE TABLE subcategories CASCADE;`;

    await db.execute(query);

    const end = Date.now();
    console.log(`✅ Categories deleted in ${end - start}ms`);
    console.log("");
    process.exit(0);
}

resetCategories().catch((err) => {
    console.error("❌ Categories deletion failed");
    console.error(err);
    process.exit(1);
}); 