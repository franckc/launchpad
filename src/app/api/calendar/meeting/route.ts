
// @ts-ignore
import LLM from "@themaximalist/llm.js";

// Submit meeting request. Returns a link to the meeting block for scheduling
export async function POST(request: Request) {
  const body = await request.json();
  const sender = body.sender;
  const message = body.message;


  // const system =
  //   `You are a classification expert. You use the following taxonomy to classify events:\n${taxonomy}`
  // const prompt =
  //   `Classify each of the following events\n${eventsStr}\n` +
  //   `The output must be a list of pairs (event, type) in JSON format.`

  // //console.log("CALLING THE LLM...")
  // const results = await LLM(prompt, {
  //   system,
  //   model: 'gemini-1.5-flash',
  //   parser: LLM.parsers.json,
  // });

  return Response.json({
    status: 'ok',
    sender,
    reply: 'Sounds great dude. Pick a time that works for ya.',
    booking_link: 'https://cal.com/franck-chastagnol/30min'
  });
}