import prisma from '@/lib/prisma';
import { start_agent_run } from '@/lib/be';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const agentId = parseInt(params.id);

  
    // Call the backend server to start a run for the agent.
    const response = await start_agent_run(agentId);
    if (!response.ok) {
      throw new Error('Failed to start run of agent ID' + params.id);
    }
    return Response.json({ status: 'ok', agentId });
  } catch (error) {
    console.log('Error updating agent:', error);
    return new Response(JSON.stringify({ error: 'Failed to start run of agent ID' + params.id}), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}