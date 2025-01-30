import prisma from '@/lib/prisma';
import { enqueue_job } from '@/lib/ai-engine';


export async function PUT(request: Request) {
  const body = await request.json();

  console.log('Creating agent in DB with name:', body.agentName);

  // Create the agent in the DB
  const agent = await prisma.agent.create({ data: {
    name: body.agentName,
    config: body,
  }});

  console.log("BODY", body);
  // Call the AI engine to enqueue an agent run.
  const response = await enqueue_job(agent.id, body);
  if (!response.ok) {
    throw new Error('Failed to start agent job on the AI engine.');
  }

  return Response.json({ status: 'ok', agentId: agent.id });
}