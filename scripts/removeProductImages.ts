import { Effect } from "effect";
import { products as products_table } from "../src/db/schema";
import { db } from "@/db";

const main = Effect.gen(function* () {
  // Clear products image_urls
  const productsResult = yield* Effect.tryPromise(() =>
    db
      .update(products_table)
      .set({ image_url: null })
      .returning({ name: products_table.name })
  );

  console.log(`Cleared images for ${productsResult.length} products`);
});

// Run the effect
const exit = await Effect.runPromiseExit(main);
console.log(exit.toString());