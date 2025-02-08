
// @ts-ignore
import LLM from "@themaximalist/llm.js";

// Submit calendar events + event taxonomy for LLM to categorize each event.
// Returns the events decorated with a new "event_type" field
export async function POST(request: Request) {
  const body = await request.json();
  const events: Array<any> = body.events;
  const taxonomy: string = body.taxonomy;

  //console.log("EVENTS=" + JSON.stringify(events, null, 4));

  const taxonomyStr = taxonomy.trimEnd().split('\n').map((line: string) => ` - ${line}`).join('\n');

  // Note: for now only sending the event title.
  // We could send more info like full description, attendees, start time, length, to improve classification.
  const eventsStr = events.map((event: any) => ` -  ${event.summary}`).join('\n');

  const system = `
You are a classification expert.
Here is the taxonomy you use to classify events into a specific type. Each line has a type and its associated description.\n${taxonomyStr}
You never use a type that is not in the taxonomy.`
  const prompt = `
Use the taxonomy to classify each of the following events\n${eventsStr}
If you are unsure, assign the type "Unknown" to the event.
The output must be a list of objects in JSON format. The JSON schema for each object is:
{
  "event": "string",
  "type": "string"
}
`
  
  //console.log("SYSTEM=", system);
  //console.log("PROMPT=", prompt);

  const config = {
    temperature: 1.0,
    model:  'gemini-2.0-flash', // 'gemini-1.5-flash','gpt-4o' 'deepseek-r1-distill-llama-70b'
    service: 'google',
    parser: LLM.parsers.json,
  }
  const llm = new LLM();
  // FIXME: it looks like LLM.js is not sending the system to the LLM? Add logging in LLM.js to confirm.
  // For now passing the system in the chat call.
  //llm.system = system;
  const results = await llm.chat(system + prompt, config);

  // const results = await LLM(prompt, {
  //   system,
  //   temperature: 1.0,
  //   model:  'gemini-1.5-flash', //'gpt-4o' 'deepseek-r1-distill-llama-70b'
  //   service: 'google',
  //   parser: LLM.parsers.json,
  // });

  //console.log("RESULTS=" + JSON.stringify(results, null, 4));

  // Decorate each event with the classification result
  results.forEach((item: any, index: number) => {
    events[index].event_type = item.type;
  });

  const eventsBytype: Record<string, Array<any>> = {};
  for (const event of events) {
    if (!eventsBytype[event.event_type]) {
      eventsBytype[event.event_type] = [];
    }
    eventsBytype[event.event_type].push(event);
  }

  for (const [type, events] of Object.entries(eventsBytype)) {
    for (const event of events) {
      const weekDayAndTime = new Date(event.start?.dateTime || event.start?.date).toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
        weekday: "long",
        hour: "numeric",
        minute: "numeric"
      })
      console.log(`${type} | ${event.summary} | ${weekDayAndTime}`);
    }
  }

  return Response.json({ status: 'ok', events});
}