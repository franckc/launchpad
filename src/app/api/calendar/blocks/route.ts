import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/options";

// @ts-ignore
import LLM from "@themaximalist/llm.js";

// Submit calendar a list of historical calendar events for a given taxonomy category.
// Returns a list of suggested time blocks for scheduling similar events in the future
export async function POST(request: Request) {

  // Check the user is authenticated
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ message: 'Authentication failed' },{ status: 401 })
  }

  const body = await request.json();
  const events: Array<any> = body.events;
  const taxonomy: Array<any> = body.taxonomy;

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
    // Extract day of the week. Ex: 'Monday'
    const dayOfWeek = formattedDate.split(' ')[0];
    // Extract time of day. Ex: '10:30 AM'
    const timeOfDay = formattedDate.split(' ').slice(1,3).join(' ');
    // Compute length in hours, with 30min granularity. Ex: 1h 30min -> 1.5h
    const lengthInHours = Math.round((endDate.getTime() - startDate.getTime()) / (30 * 60 * 1000)) / 2
    eventsPrompt.push({
      category: event.category,
      summary: event.summary,
      day_of_the_week: dayOfWeek,
      time_start: timeOfDay,
      length_in_hours: event.length_in_hours
    });
  }
  // console.log("JSONEVENTS FOR PROMPT=" + JSON.stringify(eventsPrompt, null, 4));

  const prompt = `
Analyze the following historical calendar event data.
The events are in the following JSON format:
{
  "category": "string", // Event category.
  "summary": "string", // Event summary.
  "day_of_the_week": "string", // Day of the week for the event. E.g., "Monday"
  "time_start": "string", // Start time of the event. E.g., "10:30 AM"
  "length_in_hours": "number" // Length of the event in hours. E.g., 1.5
}
${JSON.stringify(eventsPrompt, null, 4)}

I want you to do the following:
- First, group the events by category and then by day of the week.
- Then for each group of events, suggest optimal time blocks for scheduling similar events. 
Prioritize recurring patterns and time blocks with multiple events, disregarding outliers.
Each time block should be at least two hours long and no longer than 4 hours.

Once you are finished suggesting the time blocks, you must review your proposal to make sure that none of the suggested time blocks overlap with each other.
If two time blocks overlap, push out one of them to a later or earlier time to avoid overlap.

Return a JSON array of objects representing the time blocks. The JSON schema for a time block is:
{
  "category": "string", // Event category.
  "short_description": "string", // E.g., "Personal time block"
  "rationale": "string", // Explanation for why this time block exists based on historical event data. Include a few examples.
  "day_of_the_week": "string", // E.g., "Monday"
  "block_time_start": "string", // E.g., "5 PM"
  "block_time_end": "string"  // E.g., "6 PM"
}
`;

  //console.log("PROMPT=", prompt);

  // FIXME: it looks like LLM.js is not sending the system to the LLM? Add logging in LLM.js to confirm.
  // For now passing the system in the chat call.
  const llm = new LLM();
  const config = {
    temperature: 1.0,
    model:  'gemini-2.0-flash', // 'gemini-1.5-flash','gpt-4o' 'deepseek-r1-distill-llama-70b'
    service: 'google',
    parser: LLM.parsers.json,
  }
  const blocks = await llm.chat(prompt, config);

  //console.log("RESULTS=" + JSON.stringify(blocks, null, 4));

  // Store the blocks and categories in the DB. The data will be used when scheduling future events.
  const userId = session.user.id;
  const calPrefs = await prisma.calPrefs.findFirst({ where: { userId } });
  if (!calPrefs) {
    console.log("Inserting new calPrefs row for userId " + userId);
    await prisma.calPrefs.create( {
      data: {
        userId,
        data: {
          taxonomy,
          blocks,
        }
      }
    })
  } else {
    console.log("Updating calPrefs row for userId " + userId);
    await prisma.calPrefs.update({
      where: { userId },
      data: {
        data: {
          taxonomy,
          blocks,
        }
      }
    });
  }

  return Response.json({ status: 'ok', blocks});
}