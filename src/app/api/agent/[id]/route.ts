import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const agentId = parseInt(params.id);
    const agent = await prisma.agent.findUnique({
      where: {
        id: agentId
      },
      include: {
        jobs: {
          orderBy: {
            id: 'desc',
          },
        }
      }
    });

    return new Response(JSON.stringify(agent), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.log('Error fetching agents:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch agent with params' + params }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}