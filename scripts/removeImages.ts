import { Effect } from "effect";
import {
  categories as categories_table,
  subcategories as subcategories_table,
} from "../src/db/schema";
import { db } from "@/db";

const main = Effect.gen(function* () {
  // Clear categories image_urls
  const categoriesResult = yield* Effect.tryPromise(() =>
    db
      .update(categories_table)
      .set({ image_url: null })
      .returning({ name: categories_table.name })
  );
  
  console.log(`Cleared images for ${categoriesResult.length} categories`);

  // Clear subcategories image_urls
  const subcategoriesResult = yield* Effect.tryPromise(() =>
    db
      .update(subcategories_table)
      .set({ image_url: null })
      .returning({ name: subcategories_table.name })
  );

  console.log(`Cleared images for ${subcategoriesResult.length} subcategories`);
});

// Run the effect
const exit = await Effect.runPromiseExit(main);
console.log(exit.toString());