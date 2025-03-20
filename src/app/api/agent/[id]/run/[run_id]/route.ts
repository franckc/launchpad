import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const runId = parseInt(params.id);
    const run = await prisma.run.findUnique({
      where: {
        id: runId
      },
      include: {
        image: true,
        agent: true,
      }
    });

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