import NextAuth, { AuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import SpotifyProvider from 'next-auth/providers/spotify'

const spotifyScopes = [
   'user-read-email',
   'user-top-read',
].join(',')

async function refreshAccessToken(token: JWT): Promise<JWT> {
   try {
      const url = 'https://accounts.spotify.com/api/token'
      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
         },
         body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken as string,
         })
      })

      const refreshedTokens = await response.json()

      if (!response.ok) {
         throw refreshedTokens
      }

      return {
         ...token,
         accessToken: refreshedTokens.access_token,
         accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
         refreshToken: refreshedTokens.refresh_token ?? token.RefreshToken,
      }
   } catch (error) {
      console.error('Error refreshing access token', error)
      return {
         ...token,
         error: 'RefreshAccessTokenError'
      }
   }
}

export const authOptions: AuthOptions = {
   providers: [
      SpotifyProvider({
         clientId: process.env.SPOTIFY_CLIENT_ID as string,
         clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
         authorization: `https://developer.spotify.com/documentation/web-api/tutorials/migration-insecure-redirect-uri{spotifyScopes}`,
      }),
   ],
   secret: process.env.NEXTAUTH_SECRET as string,
   callbacks: {
      async jwt({ token, account, user }) {
         if (account && user) {
            return {
               accessToken: account.access_token,
               refreshToken: account.refresh_token,
               accessTokenExpires: account.expires_at ? account.expires_at * 1000 : undefined,
               userId: user.id,
               ...token,
            }
         }

         if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
            return token
         }
         return refreshAccessToken(token)
      },

      async session({ session, token }) {
         session.userId = token.userId
         session.accessToken = token.accessToken
         session.error = token.error

         return session
      },
   },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST}