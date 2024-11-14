import OpenAI from "openai";
import slugify from "slugify";
import { db } from "../src/db";
import {
  categories,
  subcategories,
  subcollections,
} from "../src/db/schema";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { getCategories, getCollections, getSubcollections } from "@/db/scripts_utils";
const fs = require("fs");

const openai = new OpenAI()
const client = createOpenAI();

const system = `
You are given the name of a collection for products in a book store.
Your task is to generate 6 unique, broad categories relevant to this collection, focusing on common genres, topics, and themes.

OUTPUT ONLY IN JSON.

EXAMPLE:

INPUT:
Collection Name: בדיוני

OUTPUT:
{
  "categories": [
    { "name": "בדיוני מסתורין", "slug": "mystery" },
    { "name": "מדע בדיוני", "slug": "science-fiction" },
    { "name": "רומנטיקה", "slug": "romance" },
    { "name": "הרפתקאות", "slug": "adventure" },
    { "name": "בדיוני היסטורי", "slug": "historical-fiction" },
    { "name": "פנטזיה", "slug": "fantasy" },
    { "name": "דרמה", "slug": "drama" },
    { "name": "הומור", "slug": "humor" },
    { "name": "פסיכולוגיה", "slug": "psychology" },
    { "name": "אימה", "slug": "horror" }
  ]
}

REMEMBER: ONLY RETURN THE JSON output with 6 unique categories. The categories must be appropriate for a book store, covering a variety of reader interests.
name (in Hebrew)
`; 



const generateCategories = async () => {
  const data = [] as any;
  const c = await getCollections();

  const promises = c.map(async (col) => {
    const { object } = await generateObject({
      model: client.languageModel("gpt-4o-mini", { structuredOutputs: true }),
      schema: z.object({
        categories: z.array(z.object({
          name: z.string(),
          slug: z.string()
        })),
      }),
      system,
      prompt: `Collection Name: ${col.name}`,
    });
    console.log(object);

    const { categories: cats } = object;
    console.log(`Categories generated: ${cats.length}`);

    const categoriesToAdd = cats.map((category) => ({
      name: category.name,
      collection_id: col.id,
      slug: slugify(category.slug, { lower: true }),
    }));
    data.push(...categoriesToAdd);
  });

  await Promise.all(promises);
  await db.insert(categories).values(data).onConflictDoNothing();
};


const generateSubCollections = async () => {
  const data = [] as any;
  const c = await getCategories();

  const promises = c.map(async (cat: any) => {
    const { object } = await generateObject({
      model: client.languageModel("gpt-4o-mini", { structuredOutputs: true }),
      schema: z.object({
        subcollections: z.array(z.string()),
      }),
      system: `You are given the name of a category for books in a book store.
                Generate 6 unique subcollections for this category, focusing on commonly found sub-genres or topics within this main category.

                OUTPUT ONLY IN JSON.

                EXAMPLE:

                INPUT:
                Category Name: כימיה

                OUTPUT:
                { "subcollections": ["כימיה קוטנטית", "כימיה חישובית "," כימיה מוזרה", ...] }
                
                REMEMBER: ONLY RETURN JSON of 6 unique subcollections, appropriate for a book store, with names that reflect common themes in the main category.name (in Hebrew)
                `,
      prompt: `Category Name: ${cat.name}`,
    });

    console.log(object);
 

    const { subcollections: sc } = object;
    console.log(`Subcollections generated: ${sc.length}`);

    const categoriesToAdd = sc.map((subcol: string) => ({
      name: subcol,
      category_slug: cat.slug,
    }));
    data.push(...categoriesToAdd);
  });

  await Promise.all(promises);
  await db.insert(subcollections).values(data).onConflictDoNothing();
};

const generateSubcategories = async () => {
  const data = [] as any[];
  const allSubcollections = await getSubcollections();
  console.log(`Total subcollections retrieved: ${allSubcollections.length}`);
  
  const subcollections = allSubcollections.flatMap(
    (c) => c.subcollections,
  );
  console.log(`Total subcollections after flattening: ${subcollections.length}`);

  const batchSize = 10; 
  for (let i = 0; i < subcollections.length; i += batchSize) {
    const batch = subcollections.slice(i, i + batchSize);

    const promises = batch.map(async (subcol) => {
      let retries = 0;
      const maxRetries = 3;
      let success = false;
      while (retries < maxRetries && !success) {
        try {
          const { object } = await generateObject({
            model: client.languageModel("gpt-4o-mini", { structuredOutputs: true }),
            schema: z.object({
              subcategories: z.array(z.object({
                name: z.string(),
                slug: z.string()
              })),
            }),
            system: `You are given the name of a subcollection in a book store.
                      Generate exactly 5 super specific and niche unique and funny subcategories within this subcollection, which represent specific types, themes, or formats commonly found under this subcollection. Make them super specific and niche, including different countries, time periods, and events.

                      OUTPUT ONLY IN JSON.

                      REMEMBER: ONLY RETURN JSON with exactly 5 unique subcategories. Names must fit within the scope of the subcollection and be relevant to a book store.
                      Each subcategory must include: name (in Hebrew), slug (in English)
                      `,
            prompt: `Subcollection Name: ${subcol.name}`,
          });

          const sc = object.subcategories;
          if (!sc || sc.length !== 5) {
            throw new Error(`Expected 5 subcategories, got ${sc ? sc.length : 0}`);
          }

          console.log(`Subcategories generated for "${subcol.name}": ${sc.length}`);

          const subcategoriesToAdd = sc.map((subcat) => ({
            name: subcat.name,
            slug: subcat.slug,
            subcollection_id: subcol.id,
          }));
          data.push(...subcategoriesToAdd);
          success = true;
        } catch (error) {
          retries++;
          console.error(`Error generating subcategories for "${subcol.name}" (Attempt ${retries}):`, error);
          await new Promise(resolve => setTimeout(resolve, 2000 * retries));
        }
      }
      if (!success) {
        console.error(`Failed to generate subcategories for "${subcol.name}" after ${maxRetries} attempts.`);
      }
    });

    await Promise.all(promises);

    // Insert data into the database after each batch
    if (data.length > 0) {
      console.log(`Inserting ${data.length} subcategories into the database.`);
      await db.insert(subcategories).values(data).onConflictDoNothing();
      data.length = 0; // Clear the data array
    }

    // Wait before processing the next batch to respect rate limits
    console.log(`Processed batch ${i / batchSize + 1}. Waiting before next batch...`);
    await new Promise(resolve => setTimeout(resolve, 5000)); 
  }

  console.log('All subcollections have been processed.');
};


// generateCategories();
// generateSubCollections();
// generateSubcategories();





  