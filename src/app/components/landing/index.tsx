//@/app/components/landing/index.tsx
'use client'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getRating } from '@/app/lib/payload'
import Image from 'next/image'
import styles from './page.module.css'
import Spinner from '@/app/components/spinner'
import Markdown from 'markdown-to-jsx'

export default function LandingPage() {
   const { status } = useSession()
   const router = useRouter()
   const [welcomeMsg, setWelcomeMsg] = useState<string>('')

   useEffect(() => {
      if (status === 'authenticated') {
         router.push('/profile')
      }
   }, [status, router])

   useEffect(() => {
      if (status === 'unauthenticated') {
         getRating([], [], 'friend', 'nice')
            .then((msg) => {
               setWelcomeMsg(msg)
            })
            .catch(() => {
               setWelcomeMsg('Would you show me your incredible musical taste?')
            })
      }
   }, [status])


   if (status === 'loading' || welcomeMsg === '') {
      return (
         <div className={styles.landingContainer}>
               <Spinner size={70} />
        </div>
      )
   }

   if (status === 'unauthenticated') {
      return (
         <div className={styles.landingContainer}>

            <div className={styles.title}>
               <span>The</span>
               <span>Auditor</span></div>
            <div className={styles.description}>
               <Markdown>{welcomeMsg}</Markdown>
            </div>
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