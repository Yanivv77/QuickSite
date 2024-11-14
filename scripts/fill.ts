import slugify from "slugify";
import { products, subcategories } from "../src/db/schema";
import { db } from "../src/db";
import { eq, isNull } from "drizzle-orm";


const readline = require("readline");
const fs = require("fs");

const getEmptySubcategories = async () => {
  const subcategoriesWithoutProducts = await db
    .select()
    .from(subcategories)
    .leftJoin(products, eq(products.subcategory_slug, subcategories.slug))
    .where(isNull(products.subcategory_slug));

  return subcategoriesWithoutProducts.map((s) => s.subcategories.slug);
};

function getRandomObjects(arr: any[], count: number) {
  const result = [];
  const takenIndices = new Set();
  const arrLength = arr.length;

  while (result.length < count) {
    const randomIndex = Math.floor(Math.random() * arrLength);

    if (!takenIndices.has(randomIndex)) {
      result.push(arr[randomIndex]);
      takenIndices.add(randomIndex);
    }
  }

  return result;
}

const getBody = async () => {
  const fileStream = fs.createReadStream("scripts/output.jsonl");
  const rl = readline.createInterface({
    input: fileStream,
  });

  const body = [] as any[];

  // Wrap the event handling in a Promise
  await new Promise<void>((resolve, reject) => {
    rl.on("line", (line: string) => {
      try {
        const parsedLine = JSON.parse(line);
        const subcategory_slug = parsedLine.custom_id;
        const response = JSON.parse(
          parsedLine.response.body.choices[0].message.content,
        );

        

        const products = response.products;
        console.log("Products:", products);

        const productsToAdd = products.map(
          (product: { name: string; description: string; author: string; slug: string }) => {
            const price = parseFloat((Math.random() * 20 + 5).toFixed(1));
            return {
              slug: product.slug,
              name: product.name,
              description: product.description ?? "",
              price,
              subcategory_slug,
              author: product.author,
            };
          },
        );
        body.push(...productsToAdd);
      } catch (err) {
        console.error("Error parsing JSON:", err);
        fs.appendFile("scripts/errors.txt", line + "\n", (err: any) => {
          if (err) console.error(err);
        });
      }
    });

    rl.on("close", async () => {
      try {
        console.log(`Total products to insert: ${body.length}`);
        // Insert original products
        for (let i = 0; i < body.length; i += 10000) {
          const chunk = body.slice(i, i + 10000);
          await db.insert(products).values(chunk).onConflictDoNothing();
          console.log(`Inserted products ${i} to ${i + chunk.length}`);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Handle empty subcategories
        const emptySubcategories = await getEmptySubcategories();
        const additionalData = [] as any[];

        emptySubcategories.forEach((subcat) => {
          const randomProducts = getRandomObjects(body, 30).map((product) => ({
            ...product,
            subcategory_slug: subcat,
            slug: slugify(product.name, { lower: true }) + "-1",
            author: "system",
          }));
          additionalData.push(...randomProducts);
        });

        // Insert products for empty subcategories
        for (let i = 0; i < additionalData.length; i += 10000) {
          const chunk = additionalData.slice(i, i + 10000);
          await db.insert(products).values(chunk).onConflictDoNothing();
          console.log(`Inserted additional products ${i} to ${i + chunk.length}`);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        resolve();
      } catch (err) {
        reject(err);
      }
    });

    rl.on("error", (err: any) => {
      reject(err);
    });
  });
};

getBody();

const duplicateProducts = async () => {
  for (let i = 0; i < 13; i += 1) {
    const p = await db
      .select()
      .from(products)
      .limit(10000)
      .offset(i * 10000);

    const productsToAdd = p.map((product) => {
      return {
        ...product,
        name: product.name + " V2",
        slug: product.slug + "-v2",
      };
    });

    await db.insert(products).values(productsToAdd).onConflictDoNothing();
    console.log(`Inserted products ${i * 10000} to ${(i + 1) * 10000}`);
  }
  console.log("Inserted products");
};

// duplicateProducts();
