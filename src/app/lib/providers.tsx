'use client'
import { SessionProvider } from "next-auth/react"
import React from 'react'

type ProvidersProps = {
   children?: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
   return (
      <SessionProvider>
         {children}
      </SessionProvider>
   )
}