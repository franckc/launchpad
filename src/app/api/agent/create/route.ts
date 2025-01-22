import prisma from '@/lib/prisma';

export async function PUT(request: Request) {
  const body = await request.json();

  // Create the agent in the DB
  const agent = await prisma.agent.create({ data: {
    name: body.name,
    config: body.config,
  }});

  return Response.json({ status: 'ok', agentId: agent.id });
}