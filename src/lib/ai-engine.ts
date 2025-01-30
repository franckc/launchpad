// Interface with the AI engine service.

import { object } from "zod";

// IMPORTANT: keep these roles definitions in sync with the ones in the AI engine.



export async function enqueue_job(agentId: number, data: Record<string, any>) {
  const url = process.env.AI_ENGINE_URL + '/api/job/start';
  console.log(`Calling ${url} to enqueue job for agent ${agentId}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agent_id: agentId,
      ...data
    }),
  });

  return response;
}

export async function draft_plan(objective: string) {
  const url = process.env.AI_ENGINE_URL + '/api/plan/draft';
  console.log(`Calling ${url} to draft plan for objective ${objective}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      objective,
    }),
  });

  return response;
}