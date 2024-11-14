// Importing Necessary Modules and Setting Up
import OpenAI from 'openai';
import { db } from '../src/db';
import { products, subcategories } from '../src/db/schema';
import fs from 'fs';
import { isNull, eq } from 'drizzle-orm/expressions';

const openai = new OpenAI()
const productSystemMessage = `
You are given the name of a category of books in a book store.
Your task is to generate 8 unique books that belong to this category, each with a funny, unique, and niche name. Make each book super specific.
Ensure each product has a name, a brief description, and an author.

OUTPUT ONLY IN JSON.

EXAMPLE:

INPUT:
Category Name: שירה רומנטית מהמאות ה-18

OUTPUT:
{
  "products": [
    {
      "name": "אמנות המשיכות הנועזות",
      "description": "ספר מרתק על אהבה ותשוקה במאה ה-18",
      "author": "סמנתה אינק",
      "slug": "the-art-of-bold-attractions"
    },
    ... // 7 more products
  ]
}

REQUIREMENTS:
1. Name and author must be in Hebrew
2. Description must be in Hebrew
3. Slug must be in English and be URL-friendly (only lowercase letters, numbers, and hyphens)
4. ONLY RETURN VALID JSON with exactly 8 unique products
5. Each product must have all fields filled
`;

// Retrieving Subcategories Without Products
const getSubcategoriesWithoutProducts = async () => {
  const result = await db
    .select({
      slug: subcategories.slug,
      name: subcategories.name,
    })
    .from(subcategories)
    .leftJoin(products, eq(subcategories.slug, products.subcategory_slug))
    .where(isNull(products.slug));

  console.log(`Number of subcategories without products: ${result.length}`);
  return result;
};

// Generating Batch Files with Limited Request Size
const generateBatchFiles = async () => {
  const arr = await getSubcategoriesWithoutProducts();

  // Ensure the directory exists
  if (!fs.existsSync('scripts')) {
    fs.mkdirSync('scripts');
  }

  arr.forEach((subcat) => {
    const custom_id = subcat.slug;
    const method = "POST";
    const url = "/v1/chat/completions";
    const body = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: productSystemMessage },
        { role: "user", content: `Category name: ${subcat.name}` },
      ],
      temperature: 0.8,
    };

 
    const line = `{"custom_id": "${custom_id}", "method": "${method}", "url": "${url}", "body": ${JSON.stringify(body)}}`;

    fs.appendFile("scripts/req.jsonl", line + "\n", (err: any) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });
  console.log(`Generated batch file with ${arr.length} requests`);
};

const uploadAndCreateBatch = async () => {
  try {
    const uploadedFile = await openai.files.create({
      file: fs.createReadStream("scripts/req.jsonl"),
      purpose: "batch",
    });
    console.log(`Uploaded file: ${uploadedFile.id}`);

    const batch = await openai.batches.create({
      input_file_id: uploadedFile.id,
      endpoint: "/v1/chat/completions",
      completion_window: "24h",
    });
    console.log(`Created batch: ${batch.id}`);

  } catch (error) {
    console.error(`Error processing batch:`, error);
  }
};

const checkBatchStatus = async () => {
  const batch = await openai.batches.retrieve("batch_6734e8cb34388190be9f303a7ccc36fe");
  console.log(batch);
  
};

const downloadBatchResults = async () => {
  try {
    // Download successful results
    const outputFileResponse = await openai.files.content("file-iS4v2xnvoYfJYnS5A6rSVHPa");
    const outputContents = await outputFileResponse.text();
    fs.writeFileSync("scripts/successful_results.jsonl", outputContents);
    console.log("Successfully downloaded results");

    // Download error file
    const errorFileResponse = await openai.files.content("file-wWClUyKMXdHKaLcvj4QuLvYP");
    const errorContents = await errorFileResponse.text();
    fs.writeFileSync("scripts/failed_results.jsonl", errorContents);
    console.log("Successfully downloaded error file");
  } catch (error) {
    console.error("Error downloading batch results:", error);
  }
};

// Monitoring Batch Progress
const monitorBatch = async (batchId: string) => {
  try {
    let isCompleted = false;

    while (!isCompleted) {
      const status = await openai.batches.retrieve(batchId);
      console.log(`
        Batch ID: ${batchId}
        Status: ${status.status}
        Requests - Total: ${status.request_counts?.total ?? 0}, Completed: ${status.request_counts?.completed ?? 0}, Failed: ${status.request_counts?.failed ?? 0}
        Errors: ${JSON.stringify(status.errors)}
        Time: ${new Date().toISOString()}
      `);

      if (status.status === 'completed' || status.status === 'failed') {
        isCompleted = true;
        console.log('Final status:', status);
      } else {
        // Wait before checking again to avoid hitting rate limits
        await new Promise((resolve) => setTimeout(resolve, 20000)); // Wait 60 seconds
      }
    }
  } catch (error) {
    console.error(`Error monitoring batch ${batchId}:`, error);
  }
};

const cancelBatch = async (batchId: string) => {
  try {
    const canceledBatch = await openai.batches.cancel(batchId);
    console.log(`Batch ${batchId} cancelled successfully:`, canceledBatch.status);
  } catch (error) {
    console.error(`Error cancelling batch ${batchId}:`, error);
  }
};

const cancelAllBatches = async () => {
  try {
    // List all batches
    const batches = await openai.batches.list();
    
    // Cancel each active batch
    for (const batch of batches.data) {
      if (batch.status === 'in_progress' || batch.status === 'validating') {
        console.log(`Cancelling batch ${batch.id}...`);
        await cancelBatch(batch.id);
      }
    }
    console.log('All active batches have been cancelled.');
  } catch (error) {
    console.error('Error cancelling batches:', error);
  }
};

// Orchestrating the Entire Process
const main = async () => {
  try {
    console.log('Starting product generation process...');
    
    // Step 1: Generate batch files
    await generateBatchFiles();

    // Step 2: Upload files and create batches
    // await uploadAndCreateBatch();

    // Step 3: Download batch results after all batches are processed and append to one file
    // await downloadBatchResults();

    //  Check batch status
    // await checkBatchStatus();

    // Cancel batch
    // await cancelBatch("batch_6730e5c5e2508190a198997f7f15ed2b");

    // Cancel all batches
    // await cancelAllBatches();

    console.log('All processes completed successfully.');
  } catch (error) {
    console.error('An error occurred during processing:', error);
  }
};

main();
