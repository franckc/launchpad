
// @ts-ignore
import LLM from "@themaximalist/llm.js";

// Submit calendar a list of historical calendar events for a given taxonomy category.
// Returns a list of suggested time blocks for scheduling similar events in the future
export async function POST(request: Request) {
  const body = await request.json();
  const events: Array<any> = body.events;
  const category: string = body.category;

  console.log("EVENTS=" + JSON.stringify(events, null, 4));
  console.log("CATEGORY=" + category);

  // Note: for now only sending the event title.
  // We could send more info like full description, attendees, start time, length, to improve classification.
  const eventsStr = events.map((event: any) => ` -  ${event.summary}`).join('\n');


  const prompt = `
Analyze the following historical calendar event data and suggest optimal days and
time blocks (minimum 30 minutes, maximum several hours) for scheduling similar events.
Prioritize recurring patterns and time blocks with multiple events, disregarding outliers.
There should not be more than 2 time blocks per day.
Return a JSON array of objects, each with this schema:
{
  "short_description": "string", // E.g., "Weekday Evening Events"
  "rationale": "string", // Explanation for why this time block exists based on historical event data. Include a few examples.
  "day_of_the_week": "string", // E.g., "Monday"
  "block_time_start": "string", // E.g., "5 PM"
  "block_time_end": "string"  // E.g., "6 PM"
}
`
  
  
  console.log("PROMPT=", prompt);

  const config = {
    temperature: 1.0,
    model:  'deepseek-r1-distill-llama-70b', // 'gemini-1.5-flash','gpt-4o' 'deepseek-r1-distill-llama-70b'
    service: 'groq',
    parser: LLM.parsers.json,
  }
  const llm = new LLM();
  // FIXME: it looks like LLM.js is not sending the system to the LLM? Add logging in LLM.js to confirm.
  // For now passing the system in the chat call.
  //llm.system = system;
  const blocks = await llm.chat(prompt, config);

  // const results = await LLM(prompt, {
  //   system,
  //   temperature: 1.0,
  //   model:  'gemini-1.5-flash', //'gpt-4o' 'deepseek-r1-distill-llama-70b'
  //   service: 'google',
  //   parser: LLM.parsers.json,
  // });



  return Response.json({ status: 'ok', blocks});
}