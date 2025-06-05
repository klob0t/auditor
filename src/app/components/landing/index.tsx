//@/app/components/landing/index.tsx
'use client'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { getRating } from '@/app/lib/payload'
import Image from 'next/image'
import styles from './index.module.css'
import Markdown from 'markdown-to-jsx'
import { useTextAnimation } from '@/app/lib/hooks/animations'
import LoadingScreen from '../loading'

export default function LandingPage() {
   const { status } = useSession()
   const router = useRouter()
   const [showPage, setShowPage] = useState(false)
   const [isLoading, setIsLoading] = useState(true)
   const [welcomeMsg, setWelcomeMsg] = useState<string>('')
   const landingContainerRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      if (status === 'authenticated') {
         router.push('/profile')
      }
   }, [status, router])

   useEffect(() => {
      if (status === 'unauthenticated') {
         getRating([], [], 'friend', 'nice')
            .then((msg) => {
               setIsLoading(false)
               setWelcomeMsg(msg)
            })
            .catch(() => {
               setWelcomeMsg('Would you show me your incredible musical taste?')
            })
      }
   }, [status])

  
    useTextAnimation({
      selector: '#welcome-text span',
      delay: 0,
      duration: 1,
      trigger: showPage && welcomeMsg ? welcomeMsg : undefined,
      scope: landingContainerRef,
      stagger: 0.1
   })

   if (isLoading || !showPage) {
      return (
         <LoadingScreen
            trigger={!isLoading}
            onExitComplete={() => setShowPage(true)}
            loadingText=''
         />
      )
   }

   if (status === 'unauthenticated') {
      
      return (
         <div className={styles.landingContainer} ref={landingContainerRef}>
            <div className={styles.title}>
               <span>The</span>
               <span>Auditor</span></div>
            <div id='welcome-text' className={styles.description}>
               <Markdown>{welcomeMsg}</Markdown>
            </div>
            <div
               className={styles.loginButton}
               onClick={() => signIn('spotify', { callbackUrl: '/profile' })}>
               <div className={styles.logoWrapper}>
                  <Image
                     src='/images/Spotify_icon.svg'
                     alt='spotify icon'
                     fill />
               </div>
               <div className={styles.buttonText}>
                  Log in with Spotify
               </div>
            </div>
         </div>
      )
   }
   return null
}