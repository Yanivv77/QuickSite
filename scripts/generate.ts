import OpenAI from "openai";
import slugify from "slugify";
import { db } from "../src/db";
import {
  categories,
  collections,
  subcategories,
  subcollections,
} from "../src/db/schema";
import { eq, isNull } from "drizzle-orm";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
const fs = require("fs");

const openai = new OpenAI();
const client = createOpenAI();

const system = `
You are given the name of a collection for products in a book store.
Your task is to generate 20 unique, broad categories relevant to this collection, focusing on common genres, topics, and themes.

OUTPUT ONLY IN JSON.

EXAMPLE:

INPUT:
Collection Name: Fiction

OUTPUT:
{ "categories": ["Mystery", "Science Fiction", "Romance", "Adventure", "Historical Fiction", "Fantasy", ...] }

REMEMBER: ONLY RETURN THE JSON output with 20 unique categories. The categories must be appropriate for a book store, covering a variety of reader interests.
`;

const getCollections = async () => {
  return await db.select().from(collections);
};

// generate 20 categories per each collection
const generateCategories = async () => {
  const data = [] as any;
  const c = await getCollections();

  const promises = c.map(async (col) => {
    const { object } = await generateObject({
      model: client.languageModel("gpt-3.5-turbo", { structuredOutputs: true }),
      schema: z.object({
        categories: z.array(z.string()),
      }),
      system,
      prompt: `Collection Name: ${col.name}`,
    });

    const { categories: cats } = object;
    console.log(`Categories generated: ${cats.length}`);

    const categoriesToAdd = cats.map((category: string) => ({
      name: category,
      collection_id: col.id,
      slug: slugify(category, { lower: true }),
    }));
    data.push(...categoriesToAdd);
  });

  await Promise.all(promises);
  await db.insert(categories).values(data).onConflictDoNothing();
};

// generateCategories();

const getCategories = async () => {
  return await db.select().from(categories);
};

// generate 10 subcollections per each category
const generateSubCollections = async () => {
  const data = [] as any;
  const c = await getCategories();

  const promises = c.map(async (cat) => {
    const { object } = await generateObject({
      model: client.languageModel("gpt-4o-mini", { structuredOutputs: true }),
      schema: z.object({
        subcollections: z.array(z.string()),
      }),
      system: `You are given the name of a category for books in a book store.
                Generate 10 unique subcollections for this category, focusing on commonly found sub-genres or topics within this main category.

                OUTPUT ONLY IN JSON.

                EXAMPLE:

                INPUT:
                Category Name: Mystery

                OUTPUT:
                { "subcollections": ["Crime Mystery", "Historical Mystery", "Cozy Mystery", "Psychological Thriller", "Police Procedural", ...] }
                
                REMEMBER: ONLY RETURN JSON of 10 unique subcollections, appropriate for a book store, with names that reflect common themes in the main category.
                `,
      prompt: `Category Name: ${cat.name}`,
    });
 

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

// generateSubCollections();

const getSubcollections = async () => {
  // only get subcollections that have no subcategories
  const result = await db
    .select()
    .from(subcollections)
    .leftJoin(
      subcategories,
      eq(subcollections.id, subcategories.subcollection_id),
    )
    .where(isNull(subcategories.subcollection_id))
    .limit(300);
  console.log(result.length);
  return result;
};

const generateSubcategories = async () => {
  const data = [] as any;
  const subcollections = (await getSubcollections()).map(
    (c) => c.subcollections,
  );

  const promises = subcollections.map(async (subcol) => {
    const { object } = await generateObject({
      model: client.languageModel("gpt-4o-mini", { structuredOutputs: true }),
      schema: z.object({
        subcategories: z.array(z.string()),
      }),
      system: `You are given the name of a subcollection in a book store.
                Generate 20 unique subcategories within this subcollection, which can represent specific types, themes, or formats commonly found under this subcollection make it super specific and niche also extra specific.
                more types, themes, or formats commonly found under this subcollection make it super specific and niche also extra specific. make like for every country or time period and every event

                OUTPUT ONLY IN JSON.

                EXAMPLE:

                INPUT:
                Subcollection Name: War History

                OUTPUT:
                { "subcategories": ["World War I", "World War II", "Vietnam War", "Cold War", "Ancient Warfare", ...] }

                REMEMBER: ONLY RETURN JSON with 20 unique subcategories. Names must fit within the scope of the subcollection and be relevant to a book store.
                `,
      prompt: `Subcollection Name: ${subcol}`,
    });

    const { subcategories: sc } = object;
    console.log(`Subcategories generated: ${sc.length}`);

    const subcategoriesToAdd = sc.map((subcat: string) => ({
      name: subcat,
      slug: slugify(subcat, { lower: true }),
      subcollection_id: subcol.id,
    }));
    data.push(...subcategoriesToAdd);
    
    // Adding a delay to slow down the processing
    await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
  });

  await Promise.all(promises);
  await db.insert(subcategories).values(data).onConflictDoNothing();
};

// getSubcollections();
// generateSubcategories();

  const productSystemMessage = `
  You are given the name of a category of books in a book store super unique.
  Your task is to generate 50 unique books super specific and niche unique extra very time  and amazing that belong to this category.
  Ensure each product has a name and brief description.

  OUTPUT ONLY IN JSON.

  EXAMPLE:

  INPUT:
  Category Name: Mystery

  OUTPUT:
  { "products": [{ "name": "The Silent Patient", "description": "A suspenseful psychological thriller by Alex Michaelides, exploring trauma and mystery..." }, { "name": "Gone Girl", "description": "A dark psychological thriller by Gillian Flynn with twists and unreliable narrators..." }] }

  REMEMBER: ONLY RETURN JSON with 50 unique books. 
  MAKE SURE YOUR JSON IS VALID. ALL JSON MUST BE CORRECT.
  `;

  const generateBatchFile = async () => {
    const arr = await db.select().from(subcategories);
  
    for (const subcat of arr) {
      const custom_id = `${subcat.subcollection_id}_${subcat.slug}`;
      const method = "POST";
      const url = "/v1/chat/completions";
      const body = {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: productSystemMessage },
          { role: "user", content: `Category name: ${subcat.name}` },
        ],
      };
  
      const line = `{"custom_id": "${custom_id}", "method": "${method}", "url": "${url}", "body": ${JSON.stringify(body)}}`;
      // await new Promise(resolve => setTimeout(resolve, 250)); // 200ms delay
      await fs.promises.appendFile("scripts/req.jsonl", line + "\n");
    }
  };
  
  // generateBatchFile();

  
  const uploadBatchFile = async () => {
    const file = await openai.files.create({
      file: fs.createReadStream("scripts/req.jsonl"),
      purpose: "batch",
    });
  
    console.log(file);
  };
  
  // uploadBatchFile();
  
  const createAndMonitorBatch = async () => {
    // Create batch with new file ID
    const batch = await openai.batches.create({
      input_file_id: "file-ZaqdIJFSbK15TADlUbLKvUsu",
      endpoint: "/v1/chat/completions",
      completion_window: "24h"
    });
    console.log("Initial batch status:", batch);
  
    // Monitor progress
    while (true) {
      const status = await openai.batches.retrieve(batch.id);
      console.log(`
  Status: ${status.status}
  Requests - Total: ${status.request_counts?.total ?? 0}, Completed: ${status.request_counts?.completed ?? 0}, Failed: ${status.request_counts?.failed ?? 0}
  Errors: ${JSON.stringify(status.errors)}
  Time: ${new Date().toISOString()}
      `);
      
      if (status.status === 'completed' || status.status === 'failed') {
        console.log("Final status:", status);
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  };
  
  createAndMonitorBatch().catch(console.error);
  
  const checkBatchStatus = async () => {
    const batch = await openai.batches.retrieve("batch_672e9888b9108190864197118f7a69e3");
    console.log(batch);
  };
  
  // checkBatchStatus();
  
  const downloadBatch = async () => {
    const fileResponse = await openai.files.content("");
    const fileContents = await fileResponse.text();
  
    fs.appendFile("scripts/out.jsonl", fileContents, (err: any) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("File has been saved");
    });
  };
  
  // downloadBatch();

 
  