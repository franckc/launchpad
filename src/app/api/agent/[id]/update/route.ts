import prisma from '@/lib/prisma';
import { enqueue_job } from '@/lib/ai-engine';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const agentId = parseInt(params.id);
    const url = new URL(request.url);
    const rerun = url.searchParams.get("rerun");
    const body = await request.json();
  
    console.log("RERUN=", rerun)

    console.log('Updating agent ID:', agentId);
    const agent = await prisma.agent.update({ 
      where: {
        id: agentId,
      },
      data: {
        name: body.agentName,
        // FIXME: sanitize the body so that we don't persist unexpected fields
        // or overwrite fields that should not get updated.
        config: body,
      }
    });

    if (rerun) {
      // Call the AI engine to enqueue an agent run.
      const response = await enqueue_job(agent.id, body);
      if (!response.ok) {
        throw new Error('Failed to start agent job on the AI engine.');
      }
    }
  
    return Response.json({ status: 'ok', agentId });
  } catch (error) {
    console.log('Error updating agent:', error);
    return new Response(JSON.stringify({ error: 'Failed to update agent ID' + params.id}), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}