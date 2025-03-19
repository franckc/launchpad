import prisma from '@/lib/prisma';
import { refreshToken } from './refresh';

//
// Retrieve and possibly refresh the user's access token.
//
export async function getAccessToken(userId: string): Promise<string> {
   // Load the user from the DB to get the access token.
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      accounts: true
    }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  if (user.accounts.length === 0) {
    throw new Error('User has no accounts');
  }
  if (user.accounts[0].provider !== "google") {
    throw new Error('User has no Google account');
  }

  var accessToken = user.accounts[0].access_token; // Note the schema has the field as access_token, not accessToken.

  // Check whether the access token is still valid. Note: expires_at is in seconds while Date.now() is in milliseconds.
  const expiresAt = user.accounts[0].expires_at;
  if (expiresAt && (expiresAt * 1000 < Date.now())) {
    // Refresh the OAuth token. See https://authjs.dev/guides/refresh-token-rotation?framework=next-js
    const newTokens = await refreshToken(user.accounts[0]);
    accessToken = newTokens.access_token;
  }

  // Paranoia - should never happen.
  if (!accessToken) {
    throw new Error('Access token not found');
  }

  return accessToken;
}