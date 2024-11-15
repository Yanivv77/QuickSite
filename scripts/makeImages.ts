import { Effect, Schedule, Duration } from "effect";
import { put } from "@vercel/blob";
import {
  products as products_table,
  categories as categories_table,
  subcategories as subcategories_table,
} from "../src/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";

// Update RPM control constants to be even more conservative
const REQUESTS_PER_MINUTE = 50; // Reduced further for safety
const DELAY_BETWEEN_REQUESTS = (60 * 1000) / REQUESTS_PER_MINUTE; // = 1200ms between requests

const delay = (ms: number) => Effect.promise(() => new Promise(resolve => setTimeout(resolve, ms)));

const generateImage = (prompt: string) =>
  Effect.gen(function* () {
    // Ensure delay is properly yielded before the API call
    yield* Effect.flatMap(delay(DELAY_BETWEEN_REQUESTS), Effect.succeed);
    
    const res = yield* Effect.tryPromise(() =>
      fetch("https://api.getimg.ai/v1/stable-diffusion/text-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GETIMG_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          negative_prompt: "blurry, low quality, distorted, pixelated",
          width: 800,
          height: 800,
          response_format: "url",
        }),
      }),
    );
    
    // Add error handling for rate limits
    if (!res.ok) {
      const errorData = yield* Effect.tryPromise(() => res.json());
      if (errorData.error?.code === 'rate_limit') {
        // Add extra delay on rate limit
        yield* Effect.flatMap(delay(5000), Effect.succeed);
        return yield* Effect.fail('rate_limited');
      }
      return yield* Effect.fail(errorData);
    }
    
    const json = yield* Effect.tryPromise(() => res.json());
    return json;
  });
const uploadImage = (imageUrl: string, path: string) =>
  Effect.gen(function* () {
    const res = yield* Effect.tryPromise(() => fetch(imageUrl));
    const blob = yield* Effect.tryPromise(() => res.blob());
    return yield* Effect.tryPromise(() =>
      put(path, blob, { access: "public" }),
    );
  });

const main = Effect.gen(function* () {
  const products = yield* Effect.tryPromise(() =>
    db.query.products.findMany({
      where: (products, { isNull }) => isNull(products.image_url),
    }),
  );
  console.log(`found ${products.length} products`);

  yield* Effect.all(
    products.map((product) =>
      Effect.gen(function* () {
        console.log(`generating image for ${product.name}`);
        const imageRes = yield* generateImage(`
            Generate this book cover:
            Book Title: ${product.name}
            Book Description: ${product.description}
            `);
        const imageUrl = imageRes.url;
        if (!imageUrl) {
          return yield* Effect.fail("no image");
        }
        console.log(`uploading image for ${product.name} - ${imageUrl}`);
        const { url } = yield* uploadImage(
          imageUrl,
          `products/${product.slug}`,
        );
        console.log(`uploaded image for ${product.name}`);
        yield* Effect.tryPromise(() =>
          db
            .update(products_table)
            .set({ image_url: url })
            .where(eq(products_table.slug, product.slug)),
        );
      }),
    ),
    { concurrency: 5 },
  );

  const categories = yield* Effect.tryPromise(() =>
    db.query.categories.findMany({
      where: (categories, { isNull }) => isNull(categories.image_url),
    }),
  );

  console.log(`found ${categories.length} categories`);

  yield* Effect.all(
    categories.map((category) =>
      Effect.gen(function* () {
        console.log(`generating image for ${category.name}`);
        const imageRes = yield* generateImage(`
            generating image for Category: ${category.name}
            `);
        const imageUrl = imageRes.url;
        if (!imageUrl) {
          return yield* Effect.fail("no image");
        }
        console.log(`uploading image for ${category.name} - ${imageUrl}`);
        const { url } = yield* uploadImage(
          imageUrl,
          `categories/${category.slug}`,
        );
        console.log(`uploaded image for ${category.name}`);
        yield* Effect.tryPromise(() =>
          db
            .update(categories_table)
            .set({ image_url: url })
            .where(eq(categories_table.slug, category.slug)),
        );
      }),
    ),
    { concurrency: 5 },
  );

  const subcategories = yield* Effect.tryPromise(() =>
    db.query.subcategories.findMany({
      where: (subcategories, { isNull }) => isNull(subcategories.image_url),
    }),
  );

  console.log(`found ${subcategories.length} subcategories`);

  yield* Effect.all(
    subcategories.map((category) =>
      Effect.gen(function* () {
        console.log(`generating image for ${category.name}`);
        const imageRes = yield* generateImage(`
            generating image for
            Category: ${category.name}
            `);
        const imageUrl = imageRes.url;
        if (!imageUrl) {
          return yield* Effect.fail("no image");
        }
        console.log(`uploading image for ${category.name} - ${imageUrl}`);
        const { url } = yield* uploadImage(
          imageUrl,
          `subcategories/${category.slug}`,
        );
        console.log(`uploaded image for ${category.name}`);
        yield* Effect.tryPromise(() =>
          db
            .update(subcategories_table)
            .set({ image_url: url })
            .where(eq(subcategories_table.slug, category.slug)),
        );
      }),
    ),
    { concurrency: 5 },
  );
});

const exit = await Effect.runPromiseExit(
  main.pipe(
    Effect.retry({
      schedule: Schedule.exponential(Duration.seconds(2), 2.0) // Increased initial delay
        .pipe(Schedule.intersect(Schedule.recurs(10))) // Increased retry attempts
    })
  ),
);
console.log(exit.toString());
