// Interface with the back-end server.

import { object } from "zod";


// Call the back-end server for creating an image for an agent that
// is already recorded in the database.
// This may take a few minutes to complete. This call will return immediately.
// Client should poll the server to check the status of the image creation.
export async function create_agent_image(agentId: number, data: Record<string, any>) {
  const url = process.env.SERVER_URL + '/api/agent/' + agentId + '/image/create';
  console.log(`Calling ${url} to create an image for agent ${agentId}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data
    }),
  });

  return response;
}

export async function start_agent_run(agentId: number, data: Record<string, any>) {
  const url = process.env.SERVER_URL + '/api/agent/' + agentId + '/run/start';
  console.log(`Calling ${url} to start a run for agent ${agentId}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data
    }),
  });

  return response;
}

export async function get_agent_run_status(agentId: number, runId: number) {
  const url = process.env.SERVER_URL + '/api/agent/' + agentId + '/run/' + runId + '/status';
  console.log('Fetching latest status of run ID from the server:', runId);
  const response = await fetch(url, { 
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
  const data = await response.json();
  const latestStatus = data?.status;
  console.log('latestStatus', latestStatus);
  return latestStatus;
}

export async function get_agent_run_output(agentId: number, runId: number) {
  const url = process.env.SERVER_URL + '/api/agent/' + agentId + '/run/' + runId + '/output';
  console.log('Fetching latest output of run ID from the server:', runId);
  const response = await fetch(url, { 
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
  const data = await response.json();
  const latestOutput = data?.output;
  return latestOutput;
}