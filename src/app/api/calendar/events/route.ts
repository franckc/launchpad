import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/options";


interface Account {
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
}

interface NewTokens {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

interface RefreshTokenResult {
  access_token: string;
  expires_at: number;
  refresh_token?: string;
}

// Handle refreshing an expired OAuth token
async function refreshToken(account: Account): Promise<RefreshTokenResult> {
  console.log("Refreshing token for account:", account.provider, account.providerAccountId);
  const response: Response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ID!,
      client_secret: process.env.GOOGLE_SECRET!,
      grant_type: "refresh_token",
      refresh_token: account.refresh_token!,
    }),
  });

  const tokensOrError: unknown = await response.json();

  if (!response.ok) throw tokensOrError;

  const newTokens = tokensOrError as NewTokens;

  // Some providers only issue refresh tokens once, so preserve if we did not get a new one
  const refresh_token = newTokens.refresh_token ?? account.refresh_token ?? undefined

  // Update the tokens in the DB
  await prisma.account.update({
    where: {
      provider_providerAccountId: {
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      }
    },
    data: {
      access_token: newTokens.access_token,
      expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
      refresh_token,
    },
  });

  return {
    access_token: newTokens.access_token,
    expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
    refresh_token,
  };
}


//
// Fetch the user's Google Calendar events
//
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ message: 'Authentication failed' },{ status: 401 })
  }

  // Load the user from the DB to get the access token.
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    include: {
      accounts: true
    }
  });
  
  if (!user) {
    return Response.json({ message: 'User not found' },{ status: 404 })
  }
  if (user.accounts.length === 0) {
    return Response.json({ message: 'User has no accounts' },{ status: 404 })
  }
  if (user.accounts[0].provider !== "google") {
    return Response.json({ message: 'User has no Google account' },{ status: 404 })
  }

  var accessToken = user.accounts[0].access_token; // Note the schema has the field as access_token, not accessToken.

  // Check whether the access token is still valid. Note: expires_at is in seconds while Date.now() is in milliseconds.
  const expiresAt = user.accounts[0].expires_at;
  if (expiresAt && (expiresAt * 1000 < Date.now())) {
    // Refresh the OAuth token. See https://authjs.dev/guides/refresh-token-rotation?framework=next-js
    const newTokens = await refreshToken(user.accounts[0]);
    accessToken = newTokens.access_token;
  }

  // Google Calendar API call
  // See API reference https://developers.google.com/calendar/api/v3/reference/events/list
  const timeMin = new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString(); // current time minus 30 days
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

  console.log(`Fetched ${jsonResp.items?.length} calendar events`);

  return Response.json(jsonResp);
}