import prisma from '@/lib/prisma';

const statusToContent = {
  'DONE': 'Agent run finished',
  'ERROR': 'An error occurred while running the agent',
  'WAITING_FOR_FEEDBACK': 'Agent run is waiting for your input'
}

export async function GET(request: Request, { params }: { params: { user_id: string } }) {
  const userId = parseInt(params.user_id);
  try {
    // Note: For now inbiox items are only made og jobs.
    // In the future it may be data from various sources.
    const jobs = await prisma.job.findMany({
      where: {
        status: { in: ['DONE', 'ERROR', 'WAITING_FOR_FEEDBACK'] }
      },
      orderBy: {
        id: 'desc'
      },
      take: 25,
      include: {
        agent: true
      }
    });

    const inboxItems = jobs.map(job => ({
      id: job.id,
      type: "JOB_RUN",
      status: job.status,
      content: statusToContent[job.status as keyof typeof statusToContent],
      agentName: job.agent.name,
      timestamp: job.updatedAt,
    }));

    return new Response(JSON.stringify(inboxItems), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.log('Error fetching agents:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch agents' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}