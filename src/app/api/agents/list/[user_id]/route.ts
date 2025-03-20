import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { user_id: string } }) {
  const userId = params.user_id;
  try {
    const agents = await prisma.agent.findMany({
      where: {
        userId: userId // Added where clause on user_id
      },
      include: {
        image: true,
        runs: {
          orderBy: {
            createdAt: 'desc'
          },
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const agentsWithLatestTask = agents.map(agent => ({
      ...agent,
      latestRun: agent.runs ? agent.runs[0] : null
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