import prisma from '@/lib/prisma';

export async function PUT(request: Request) {
  const body = await request.json();

  console.log('Creating agent in DB with name:', body.agentName);

  // Create the agent in the DB
  const agent = await prisma.agent.create({ data: {
    name: body.agentName,
    config: body,
  }});

  // Call AI engine to kickoff the agent run.
  const url = process.env.AI_ENGINE_URL + '/api/job/start'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agent_config: {'key1': 'val1', 'key2': 'val2'},
      task_config: {'key1': 'val1', 'key2': 'val2'},
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to start agent job on the AI engine.');
  }

  return Response.json({ status: 'ok', agentId: agent.id });
}