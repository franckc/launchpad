import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const agents = await prisma.agent.findMany({
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