import prisma from '@/lib/prisma';

import { get_agent_run_status, get_agent_run_output } from '@/lib/be';

// TODO: add authentication check
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const runId = parseInt(params.run_id);
    const run = await prisma.run.findUnique({
      where: {
        id: runId
      },
      include: {
        image: true,
        agent: true,
      }
    });

    if (!run) {
      return new Response(JSON.stringify({ error: 'Run not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // FIXME: these 2 calls should be combined into a single call to the backend server
    if (run.status === 'RUNNING') {
      // Call the backend server to get the latest output of the run.
      // Note: the server handles updating the output in the database as needed.
      const latestOutput = await get_agent_run_output(run.agentId, run.id);
      run.output = latestOutput;

      // Call the backend server to get the latest status of the run.
      // Note: the server handles updating the status in the database as needed.
      const latestStatus = await get_agent_run_status(run.agentId, run.id);
      run.status = latestStatus;
    }

    return new Response(JSON.stringify(run), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.log('Error fetching run ID', params.id, error);
    return new Response(JSON.stringify({ error: 'Failed to fetch run with params' + params }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}