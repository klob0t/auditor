import 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
   interface Session {
      accessToken?: string
      error?: string
      userId?: string
   }

   interface User {
      id: string
   }
}

declare module 'next-auth/jwt' {
   interface JWT {
      accessToken?: string
      refreshToken?: string
      accessTokenExpires?: number
      error?: string
      userId?: string
   }
}