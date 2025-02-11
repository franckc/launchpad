// Return a user/s information, include access token for API calls

import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        accounts: true
      }
    });

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.log('Error fetching agents:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch user'}), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}