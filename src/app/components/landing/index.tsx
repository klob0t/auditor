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
import { motion } from 'framer-motion'

export default function LandingPage() {
   const { data: session, status } = useSession()
   const router = useRouter()
   const [welcomeMsg, setWelcomeMsg] = useState<string>('')
   const [showPage, setShowPage] = useState(false)

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

   const welcomeMessageVar = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2}}
   }

   if (!showPage || status === 'loading' || welcomeMsg === '') {
      return (
         <div className={styles.landingContainer}>
            <motion.div
               initial={{ scale: 1, rotate: 0, transformOrigin: 'center' }}
               animate={{
                  scale: welcomeMsg !== '' ? 0 : 1,
                  rotate: welcomeMsg !== '' ? 1440 : 0
               }}
               transition={{
                  duration: 0.5,
                  ease: 'easeOut'
               }}
               onAnimationComplete={() => {
                  if (welcomeMsg !== '') setShowPage(true)
               }}
            >
               <Spinner size={70} />
            </motion.div></div>
      )
   }

   if (status === 'unauthenticated') {
      return (
         <div className={styles.landingContainer}>

            <div className={styles.title}>
               <span>The</span>
               <span>Auditor</span></div>
            <motion.div 
               className={styles.description}
               initial='hidden'
               animate='visible'
               variants={welcomeMessageVar}>
               <Markdown>{welcomeMsg}</Markdown>
            </motion.div>
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