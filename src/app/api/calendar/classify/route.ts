

import { Gateway } from "@adaline/gateway";
import { Config, MessageType } from "@adaline/types";


const gateway = new Gateway();

//import { OpenAI } from "@adaline/openai";
//const openai = new OpenAI();

import { Google } from "@adaline/google";
const google = new Google();

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const gemini = google.chatModel({
  modelName: 'gemini-1.5-flash',
  apiKey: process.env.GEMINI_API_KEY,
});

const config = Config().parse({
   //maxTokens: 200,
   temperature: 1.0,
});

// Submit calendar events + event taxonomy for LLM to categorize each event.
// Returns the events decorated with a new "event_type" field
export async function POST(request: Request) {
  const body = await request.json();
  const events: Array<any> = body.events;
  const taxonomy: string = body.taxonomy;

  // Note: for now only sending the event title.
  // We could send more info like full description, attendees, start time, length, to improve classification.
  const eventsStr = events.map((event: any) => event.summary).join('\n');

  const messages: MessageType[] = [
    {
      role: "system",
      content: [{
        modality: "text",
        value: `You are a classification expert. You use the following taxaonomy to classify events:\n${taxonomy}`,
      }],
    },
    {
      role: "user",
      content: [{
        modality: "text",
        value: `Classify each of the following events\n${eventsStr}\nThe output must be a list of pairs (event, type) in JSON format`,
      }],
    },
  ];

  const data = await gateway.completeChat({
    model: gemini,
    config: config,
    messages: messages,
  });

    //console.log("RESPONSE", JSON.stringify(data, null, 4));


  if (!data.response || !data.response.messages || !data.response.messages[0].content) {
    throw new Error('Failed to classify events - no content returned');
  }
  const content = data.response.messages[0].content[0];
  if (content.modality !== "text" || typeof content.value !== "string") {
    throw new Error('Failed to classify events - unexpected content format');
  }
  const classification = content.value;
  if (!classification.startsWith('```json')) {
    throw new Error('Failed to classify events - no JSON returned');
  }

  const cleanedClassification = classification.replace('```json', '').replace('```', '');
  //console.log("CLEANED CLASSIFICATION", cleanedClassification);
  const parsed = JSON.parse(cleanedClassification);
  //console.log("PARSED CLASSIFICATION", parsed);

  parsed.forEach((item: any, index: number) => {
    events[index].event_type = item.type;
  });

  // const response = await draft_plan(objective);
  // if (!response.ok) {
  //   throw new Error('Failed to get plan from the AI engine.');
  // }
  // const data = await response.json();
  return Response.json({ status: 'ok', events});
}