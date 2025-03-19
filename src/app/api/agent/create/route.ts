import prisma from '@/lib/prisma';
import { create_agent_image } from '@/lib/be';


// Relay a request to the server to create a new agent.
// TODO: enforce the user is authenticated
export async function PUT(request: Request) {
  const body = await request.json();

  console.log('Creating agent in DB with name:', body.config.agentName);

  // Create the agent in the DB
  const agent = await prisma.agent.create({ data: {
    userId: body.userId,
    config: body.config,
  }});
  console.log('Created agent in the DB with id:', agent.id);

  // Call the backend server to create an image for the agent.
  const response = await create_agent_image(agent.id, body);
  if (!response.ok) {
    throw new Error('Failed to create agent image on the back-end server.');
  }

  return Response.json({ status: 'ok', agentId: agent.id });
}