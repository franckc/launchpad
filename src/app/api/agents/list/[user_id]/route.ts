import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { user_id: string } }) {
  const userId = parseInt(params.user_id);
  try {
    const agents = await prisma.agent.findMany({
      // TODO: add where clause on user_id
      include: {
        jobs: true,
      }
      // include: {
      //   jobs: {
      //     orderBy: {
      //       createdAt: 'desc'
      //     },
      //     take: 1
      //   }
      // }
    });

    const agentsWithLatestTask = agents.map(agent => ({
      ...agent,
      latestJob: agent.jobs ? agent.jobs[0] : null
    }));

    return new Response(JSON.stringify(agentsWithLatestTask), {
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