export async function GET(req: Request) {
  try {
   console.log('GET', req);
    return Response.json({ message: 'Veritai server' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}