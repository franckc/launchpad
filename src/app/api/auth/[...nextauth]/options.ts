import GoogleProvider from 'next-auth/providers/google'
import { Session } from 'next-auth'
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from '@/lib/prisma';


if (!process.env.GOOGLE_ID) {
  throw new Error("Missing GOOGLE_ID environment variable ");
}
if (!process.env.GOOGLE_SECRET) {
  throw new Error("Missing GOOGLE_SECRET environment variable ");
}


export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // OAuth authentication provider(s)
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          scope: [
            "openid",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/calendar.readonly"
          ].join(" "),
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    session({ session, user }: { session: Session, user: any }) {
      // Add the user id to the session data. This way the back-end gets the user id when it retrieves the session by calling getServerSession.
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  },
  // TODO: handle refresh token. See https://authjs.dev/guides/refresh-token-rotation?framework=next-js
  // Capture the access token for use when calling the Google API
  //
  // NOTE: this does not work when persisting the session in the database.
  //
  
  // async jwt({ token, account }) {
  //   if (account?.accessToken) {
  //     token.accessToken = account.accessToken;
  //   }
  //   return token;
  // },
  // async session({ session, token, user }) {
  //   session.accessToken = token.accessToken;
  //   return session;
  // },
  //},
}