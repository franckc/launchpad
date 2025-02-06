
import LLM from "@themaximalist/llm.js";

// Submit calendar events + event taxonomy for LLM to categorize each event.
// Returns the events decorated with a new "event_type" field
export async function POST(request: Request) {
  const body = await request.json();
  const events: Array<any> = body.events;
  const taxonomy: string = body.taxonomy;

  // Note: for now only sending the event title.
  // We could send more info like full description, attendees, start time, length, to improve classification.
  const eventsStr = events.map((event: any) => event.summary).join('\n');

  const system =
    `You are a classification expert. You use the following taxonomy to classify events:\n${taxonomy}`
  const prompt =
    `Classify each of the following events\n${eventsStr}\n` +
    `The output must be a list of pairs (event, type) in JSON format.`

  console.log("CALLING THE LLM...")
  const results = await LLM(prompt, {
    system,
    model: 'gemini-1.5-flash',
    parser: LLM.parsers.json,
  });

  //console.log("RESULTS=" + JSON.stringify(results, null, 4));

  // Decorate each event with the classification result
  results.forEach((item: any, index: number) => {
    events[index].event_type = item.type;
  });

  return Response.json({ status: 'ok', events});
}