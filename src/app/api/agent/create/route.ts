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
  const url = process.env.AI_ENGINE_URL + '/api/job/start';
  console.log('Calling /api/job/start on server at URL:', url);

/*
    const payload = {
      agentHash,
      agentName,
      lifeExpectancyType,
      isHosted,
      role, // agent role
      goal, // agent goal
      backstory, // agent backstory
      taskDescription, // task description
      expectedOutput, // task expected output
      startTime,
      frequency,
      connectedService,
      notificationMethods,
      additionalQuestions,
    };
*/

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agent_id: agent.id,
      agent_config: {
        'role': body.role,
        'goal': body.goal,
        'backstory': body.backstory,
      },
      task_config: {
        'description': body.taskDescription,
        'expected_output': body.expectedOutput,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to start agent job on the AI engine.');
  }

  return Response.json({ status: 'ok', agentId: agent.id });
}