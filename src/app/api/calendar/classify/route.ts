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
Here is the taxonomy you use to classify events into a specific category.
Each line has a category and its associated description.
${taxonomyStr}
You never use a category that is not in the taxonomy.
`;

  const prompt = `
Use the taxonomy to classify each of the following events into a category:
${eventsStr}

If you are unsure, assign the category "Unknown" to the event.
The output must be a list of objects in JSON format. The JSON schema for each object is:
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

  const taxonomyStr = taxonomy.map((item: any) => ` - ${item.category}: ${item.description}`).join('\n');

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

  // Decorate each event with the classification result
  results.forEach((item: any, index: number) => {
    events[index].category = item.category;
  });

  return Response.json({ status: 'ok', events });
}