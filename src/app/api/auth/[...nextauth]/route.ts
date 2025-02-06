import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import { Session } from 'next-auth'


if (!process.env.GOOGLE_ID) {
  throw new Error("Missing GOOGLE_ID environment variable ");
}
if (!process.env.GOOGLE_SECRET) {
  throw new Error("Missing GOOGLE_SECRET environment variable ");
}

const handler = NextAuth({
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
  // Capture the access token for use when calling the Google API
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token } : { session: any, token: any }) {
      session.accessToken = token.accessToken;
      return session;
    }
  }
})

export { handler as GET, handler as POST }