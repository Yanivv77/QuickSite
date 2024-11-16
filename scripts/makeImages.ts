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
    yield* Effect.flatMap(delay(DELAY_BETWEEN_REQUESTS), Effect.succeed);
    const res = yield* Effect.tryPromise(() =>
      fetch("https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GETIMG_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          negative_prompt: "blurry, low quality, distorted, pixelated, people, faces,books,book,home",
          width: 600,
          height: 904,
          response_format: "url",
        }),
      }),
    );
    
    if (!res.ok) {
      const errorData = yield* Effect.tryPromise(() => res.json());
      if (errorData.error?.code === 'rate_limit') {
        // If we hit rate limit, fail with special error that will trigger retry
        return yield* Effect.fail(new Error('RATE_LIMIT'));
      }
      console.error(`Failed to generate image:`, errorData);
      return yield* Effect.fail(errorData);
    }
    
    const json = yield* Effect.tryPromise(() => res.json());
    return json;
  }).pipe(
    Effect.retry({
      schedule: Schedule.exponential(Duration.seconds(5), 2.0) // Start with 5s delay, double each time
        .pipe(Schedule.intersect(Schedule.recurs(3))), // Retry up to 3 times
      while: (error) => error.message === 'RATE_LIMIT', // Only retry on rate limit errors
    })
  );
const uploadImage = (imageUrl: string, path: string) =>
  Effect.gen(function* () {
    try {
      console.log(`Starting upload for ${path}`);
      const res = yield* Effect.tryPromise(() => fetch(imageUrl));
      
      if (!res.ok) {
        console.error(`Failed to fetch image from URL: ${res.status} ${res.statusText}`);
        return yield* Effect.fail(`Failed to fetch image: ${res.status}`);
      }
      
      const blob = yield* Effect.tryPromise(() => res.blob());
      console.log(`Blob created for ${path}, size: ${blob.size} bytes`);
      
      const uploadResult = yield* Effect.tryPromise(() =>
        put(path, blob, { access: "public" }),
      );
      console.log(`Upload completed for ${path}: ${uploadResult.url}`);
      return uploadResult;
    } catch (error) {
      console.error(`Upload failed for ${path}:`, error);
      return yield* Effect.fail(error);
    }
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
        console.log(`generating image for ${product.slug}`);
        const imageRes = yield* generateImage(`
          Create a professional, high-quality book cover with the following specifications:
          Title: "${product.slug}"
          Book Description: ${product.description}
          Important:
          - it should be based on ${product.slug} and ${product.description} as much as possible

          Style Requirements:
          - Modern and professional book cover design
          - Clear, readable title typography
          - Appropriate for a professional/academic book
          - Balanced composition with proper visual hierarchy
          - Subtle use of relevant symbolic imagery
          - Clean and minimalist approach
          - Use a sophisticated color palette
          - Ensure text is clearly visible and properly contrasted
          - Be Creative

          Technical Requirements:
          - Vertical/Portrait orientation
          - Professional publishing quality
          - Sharp and clear imagery
          - No text distortion
          - Proper margins for title placement
            `);
        const imageUrl = imageRes.url;
        if (!imageUrl) {
          return yield* Effect.fail("No image URL returned from generateImage");
        }
        console.log(`uploading image for ${product.name} - ${imageUrl}`);
        const { url } = yield* uploadImage(
          imageUrl,
          `products/${product.slug}`,
        );
        console.log(`Uploaded image for ${product.name}`);
        yield* Effect.tryPromise(() =>
          db
            .update(products_table)
            .set({ image_url: url })
            .where(eq(products_table.slug, product.slug)),
        );
      }).pipe(Effect.catchAll((error) => {
        console.error(`Error processing product ${product.slug}:`, error);
        return Effect.succeed(undefined); 
      })),
    ),
    { concurrency: 5 },
  );

//   const categories = yield* Effect.tryPromise(() =>
//     db.query.categories.findMany({
//       where: (categories, { isNull }) => isNull(categories.image_url),
//     }),
//   );

//   console.log(`found ${categories.length} categories`);

//   yield* Effect.all(
//     categories.map((category) =>
//       Effect.gen(function* () {
//         console.log(`generating image for ${category.slug}`);
//         const imageRes = yield* generateImage(`
//           Create a professional, high-quality symbolic representation of ${category.slug} .
//           Mood: creative, professional ,sophisticated andrealistic
//         `);
//         const imageUrl = imageRes.url;
//         if (!imageUrl) {
//           return yield* Effect.fail("no image");
//         }
//         console.log(`uploading image for ${category.name} - ${imageUrl}`);
//         const { url } = yield* uploadImage(
//           imageUrl,
//           `categories/${category.slug}`,
//         );
//         console.log(`uploaded image for ${category.name}`);
//         yield* Effect.tryPromise(() =>
//           db
//             .update(categories_table)
//             .set({ image_url: url })
//             .where(eq(categories_table.slug, category.slug)),
//         );
//       }),
//     ),
//     { concurrency: 5 },
//   );

//   const subcategories = yield* Effect.tryPromise(() =>
//     db.query.subcategories.findMany({
//       where: (subcategories, { isNull }) => isNull(subcategories.image_url),
//     }),
//   );

//   console.log(`found ${subcategories.length} subcategories`);

//   yield* Effect.all(
//     subcategories.map((category) =>
//       Effect.gen(function* () {
//         console.log(`generating image for ${category.slug}`);
//         const imageRes = yield* generateImage(`
//           Create a professional, high-quality symbolic representation of ${category.slug} .
//           Mood: creative, professional , sophisticated and realistic
//         `);
//         const imageUrl = imageRes.url;
//         if (!imageUrl) {
//           return yield* Effect.fail("no image");
//         }
//         console.log(`uploading image for ${category.name} - ${imageUrl}`);
//         const { url } = yield* uploadImage(
//           imageUrl,
//           `subcategories/${category.slug}`,
//         );
//         console.log(`uploaded image for ${category.name}`);
//         yield* Effect.tryPromise(() =>
//           db
//             .update(subcategories_table)
//             .set({ image_url: url })
//             .where(eq(subcategories_table.slug, category.slug)),
//         );
//       }),
//     ),
//     { concurrency: 5 },
//   );
});

const exit = await Effect.runPromiseExit(
  main.pipe(
    Effect.retry({
      schedule: Schedule.exponential(Duration.seconds(2), 2.0)
        .pipe(Schedule.intersect(Schedule.recurs(10)))
    })
  )
);
console.log(exit.toString());
