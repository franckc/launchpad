// @ts-ignore
import LLM from "@themaximalist/llm.js";

interface ClassificationResult {
  event: string;
  category: string;
}

const BATCH_SIZE = 200;

async function processBatch(taxonomyStr: string, batch: Array<any>): Promise<ClassificationResult[]> {
  console.log("Calling LLM with batch size: ", batch.length);
  const eventsStr = batch.map((event: any) => ` -  ${event.summary}`).join('\n');

  const system = `
You are a classification expert.
I will give you a list of categories in JSON format.
Each category will have a "category" name, a "description", and "examples".
Your job is to classify events into the correct category from this list.
${taxonomyStr}
You never use a category that is not in the taxonomy.
`;

  const prompt = `
Here are the events I want you to classify:
${eventsStr}

Give your answer as a JSON list of objects.
Each object should have two fields: "event" (the event you were given) and "category" (the category you chose).
Here is the JSON schema:
{
"event": "string",
"category": "string"
}
`;

  const llm = new LLM();
  const config = {
    temperature: 1.0,
    model: 'gemini-2.0-flash', // 'gemini-1.5-flash','gpt-4o' 'deepseek-r1-distill-llama-70b'
    service: 'google',
    parser: LLM.parsers.json,
  };

  return await llm.chat(system + prompt, config);
};


// Submit calendar events + event taxonomy for LLM to categorize each event.
// Returns the events decorated with a new "category" field
export async function POST(request: Request) {
  const body = await request.json();
  const events: Array<any> = body.events;
  const taxonomy: Array<any> = body.taxonomy;

  const taxonomyStr = JSON.stringify(taxonomy, null, 4);

  const batchSize = BATCH_SIZE;
  const results: Array<any> = [];

  // Create batches of events to classify.
  const batchPromises = [];
  for (let i = 0; i < events.length; i += batchSize) {
    const batch = events.slice(i, i + batchSize);
    batchPromises.push(processBatch(taxonomyStr, batch));
  }
  // Send the batched events to the LLM for classification
  const batchResults = await Promise.all(batchPromises);
  batchResults.forEach((result: ClassificationResult[]) => results.push(...result));

  // Make a dictionary of the categories for faster lookup
  const categoriesByEvent: any = {};
  results.forEach((item: any) => {
    categoriesByEvent[item.event] = item.category;
  });

  // Decorate each event with the classification result
  events.forEach((event: any) => {
    event.category = categoriesByEvent[event.summary] || 'Unclassified';
  });

  return Response.json({ status: 'ok', events });
}