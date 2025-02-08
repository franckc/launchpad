
// @ts-ignore
import LLM from "@themaximalist/llm.js";

// Submit calendar a list of historical calendar events for a given taxonomy category.
// Returns a list of suggested time blocks for scheduling similar events in the future
export async function POST(request: Request) {
  const body = await request.json();
  const events: Array<any> = body.events;
  const category: string = body.category;

  const eventsPrompt = [];
  for (const event of events) {
    // Format date to <day of week> <hour>:<minute> AM/PM
    const startDate = new Date(event.start?.dateTime || event.start?.date);
    const endDate = new Date(event.end?.dateTime || event.end?.date);
    const formattedDate = startDate.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      weekday: "long",
      hour: "numeric",
      minute: "numeric"
    })
    // Compute length in hours, with 30min granularity. Ex: 1h 30min -> 1.5h
    const lengthInHours = Math.round((endDate.getTime() - startDate.getTime()) / (30 * 60 * 1000)) / 2
    eventsPrompt.push({
      summary: event.summary,
      time_start: formattedDate,
      length_in_hours: event.length_in_hours
    });
  }


  console.log("JSONEVENTS FOR PROMPT=" + JSON.stringify(eventsPrompt, null, 4));

  // Note: for now only sending the event title.
  // We could send more info like full description, attendees, start time, length, to improve classification.
  const eventsStr = events.map((event: any) => ` -  ${event.summary}`).join('\n');

  const prompt = `
Analyze the historical calendar event data and suggest optimal days and
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
Here are the historical events in JSON format, with each event having a title, start time, and length in hours:
${JSON.stringify(eventsPrompt, null, 4)}
`;

  // FIXME: it looks like LLM.js is not sending the system to the LLM? Add logging in LLM.js to confirm.
  // For now passing the system in the chat call.
  const llm = new LLM();
  const config = {
    temperature: 1.0,
    model:  'gemini-2.0-flash', // 'gemini-1.5-flash','gpt-4o' 'deepseek-r1-distill-llama-70b'
    service: 'google',
    parser: LLM.parsers.json,
  }
  const results = await llm.chat(prompt, config);

  console.log("RESULTS=" + JSON.stringify(results, null, 4));

  return Response.json({ status: 'ok', results});
}