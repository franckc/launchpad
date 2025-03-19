
import prisma from '@/lib/prisma';

// @ts-ignore
import LLM from "@themaximalist/llm.js";

const DEFAULT_RECEIVER = 'franckc@gmail.com';

// Submit meeting request. Returns a link to the meeting block for scheduling
export async function POST(request: Request) {
  const body = await request.json();
  const sender = body.sender; // Email of the meeting requester.
  const message = body.message;
  const receiver = body.email || DEFAULT_RECEIVER; // Email of the meeting request receiver. Default to Franck's email for demo purposes.

  const user = await prisma.user.findFirst({ where: { email: receiver } });
  if (!user) {
    return Response.json({ message: 'user not found' },{ status: 500 })
  }

  // Load the user's event categories from the database.
  const calPrefs = await prisma.calPrefs.findFirst({ where: { userId: user.id } });
  if (!calPrefs) {
    return Response.json({ message: 'calprefs not found' },{ status: 500 })
  }
  
  // Analyze the message to determine what event category it belongs to.
  const taxonomy = (typeof calPrefs?.data === 'object' ? (calPrefs.data as any).taxonomy : null);
  if (!taxonomy) {
    return Response.json({ message: 'taxonomy not found' },{ status: 500 })
  }
  const taxonomyStr = JSON.stringify(taxonomy, null, 4);

  const prompt = `
  You are a classification expert.
  I will give you a list of categories in JSON format.
  Each category will have a "category" name, a "description", and "examples".
  Here is a list of categories:
  ${taxonomyStr}

  Your job is to classify the following message into the correct category from the list I gave you.
  ${message}
  
  The output must be a JSON object with the following schema:
  {
    "category": "string"
  }
  `;

  console.log("PROMPT=", prompt);

  const llm = new LLM();
  const config = {
    temperature: 0.6, // Lower temperature means more deterministic results.
    model:  'gemini-2.0-flash', // 'gemini-1.5-flash','gpt-4o' 'deepseek-r1-distill-llama-70b'
    service: 'google',
    parser: LLM.parsers.json,
  }
  const output = await llm.chat(prompt, config);
  var category = output?.category || 'Default'

  // sanitize and normalize the category.
  // Some categories have non alphanumeric chars (ex space, / , (, ...) and it breaks the link.
  // Convert category to lowercase and replace any non-alphanumeric character with a dash.
  // For example: "Family Time (DND)" -> "family-time-dnd"
  category = category
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // TODO: in the future, we'll want to make sure as part of the setup phase
  // that calendars are created for each category. For now, we'll just assume.

  // Get a calendar link based on the category.
  const booking_link = `https://cal.com/franck-chastagnol/${category}`

  return Response.json({
    status: 'ok',
    sender,
    receiver,
    reply: 'Sounds good. Please pick a time that works for you on my calendar.',
    booking_link,
  });
}
