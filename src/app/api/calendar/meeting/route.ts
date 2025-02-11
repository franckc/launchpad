
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
  const taxonomyStr = taxonomy.map((item: any) => ` - ${item.category}: ${item.description}`).join('\n');

  const prompt = `
  Here are the event categories you can choose from:
  ${taxonomyStr}

  Analyze the following message to determine the category of the event:
  ${message}
  
  The output must be a JSON object with the following schema:
  {
    "category": "string"
  }
  `;

  console.log("PROMPT=", prompt);

  const llm = new LLM();
  const config = {
    temperature: 1.0,
    model:  'gemini-2.0-flash', // 'gemini-1.5-flash','gpt-4o' 'deepseek-r1-distill-llama-70b'
    service: 'google',
    parser: LLM.parsers.json,
  }
  const output = await llm.chat(prompt, config);
  const category = output?.category || 'Default'

  // Some categories have space in them and it breaks the link.
  // Replace space with a dash.
  category.replace(/\s+/g, '-')

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
