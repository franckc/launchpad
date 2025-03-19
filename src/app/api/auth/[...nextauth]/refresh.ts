import prisma from '@/lib/prisma';


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
export async function refreshToken(account: Account): Promise<RefreshTokenResult> {
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