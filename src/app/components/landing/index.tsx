'use client'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { use, useEffect } from 'react'
import Image from 'next/image'
import styles from './page.module.css'
import Spinner from '@/app/components/spinner'

export default function LandingPage() {
   const { data: session, status } = useSession()
   const router = useRouter()

   useEffect(() => {
      if (status === 'authenticated') {
         router.push('/profile')
      }
   }, [status, router])

   if (status === 'loading') {
      return (
         <div className={styles.landingContainer}>
            <Spinner size={40} />
         </div>
      )
   }

   if (status === 'unauthenticated') {
      return (
         <div className={styles.landingContainer}>
            <div className={styles.title}>Auditor</div>
            <div className={styles.description}>Internet's busiest music nerd.</div>
            <div
               className={styles.loginButton}
               onClick={() => signIn('spotify', { callbackUrl: '/profile' })}
            >
               <Image
                  src='/images/Spotify_icon.svg'
                  alt='spotify icon'
                  height={20}
                  width={20}
               />
               <div className={styles.buttonText}>
                  Log in with Spotify
               </div>
            </div>
         </div>
      )
   }
   return null
}