import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/options";
import { getAccessToken } from '../../auth/[...nextauth]/token';

const NUM_DAYS = 12 * 30; // Fetch 12 months worth of calendar events


//
// Fetch the user's Google Calendar events
//
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ message: 'Authentication failed' },{ status: 401 })
  }

  // Get the user's access token.
  const accessToken = await getAccessToken(session.user.id);

  // Google Calendar API call
  // See API reference https://developers.google.com/calendar/api/v3/reference/events/list
  const timeMin = new Date(Date.now() -  NUM_DAYS * 24 * 60 * 60 * 1000).toISOString(); // current time minus X days
  const timeMax = new Date(Date.now()).toISOString(); // current time

  const calendarResponse = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events' +
    `?singleEvents=true&timeMin=${timeMin}&timeMax=${timeMax}&maxResults=2500&orderBy=startTime`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  const jsonResp = await calendarResponse.json();  
  if (calendarResponse.status !== 200) {
    console.log("Google Calendar API error:", calendarResponse.status, JSON.stringify(jsonResp));
    return Response.json({ message: 'Failed to fetch calendar events' + JSON.stringify(jsonResp) }, { status: 500 })
  }

  //console.log("EVENTS", JSON.stringify(jsonResp.items, null, 4));
  console.log(`Fetched ${jsonResp.items?.length} calendar events`);

  // Filter out event that are more than 8 hrs long. These are likely all day events or similar that are not useful for scheduling.
  jsonResp.items = jsonResp.items.filter((event: any) => {
    const startDate = new Date(event.start.date || event.start.dateTime);
    const endDate = new Date(event.end.date || event.end.dateTime);
    const lengthInHours = Math.round((endDate.getTime() - startDate.getTime()) / (60 * 60 * 1000));
    return lengthInHours < 8;
  });

  console.log(`After filtering: ${jsonResp.items?.length} calendar events`);

  return Response.json(jsonResp);
}