//@/app/components/loading/index.tsx
'use client'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './index.module.css'
import { useTextAnimation } from '@/app/lib/hooks/animations'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

interface LoadingProps {
   onExitComplete: () => void
   loadingText?: string
   trigger: boolean
}

export default function LoadingScreen({
   onExitComplete,
   loadingText,
   trigger }: LoadingProps) {
   const loadingRef = useRef<HTMLDivElement>(null)
   const spinnerRef = useRef<HTMLDivElement>(null)

   const ticks = Array.from(Array(10))

   useTextAnimation({
      selector: '#loading-text p',
      delay: 0.6,
      stagger: 0.02,
      duration: 1,
      trigger: loadingText,
      scope: loadingRef
   })
   useGSAP(() => {

      if (trigger && loadingRef.current && spinnerRef.current) {
         const tl = gsap.timeline({ onComplete: onExitComplete })
         tl.to(spinnerRef.current, {
            rotation: 720,
            duration: 0.4,
            opacity: 0,
            ease: 'power3.in'
         }).to(loadingRef.current, {
            yPercent: -100,
            duration: 1,
            scale: 0,
            ease: 'power3.in'
         }, '+=1')
      }
   }, {
      dependencies: [trigger, onExitComplete]
   })


   return (
      <div className={styles.loadingContainer} ref={loadingRef}>
         <div className={styles.spinnerContainer} ref={spinnerRef}>
            <div className={styles.spinner} style={{ width: 60, height: 60 }}>
               {ticks.map((_, i) => (
                  <div
                     key={i}
                     className={styles.tickWrapper}
                     style={{ transform: `rotate(${i * 360 / ticks.length}deg)` }}>
                     <div
                        className={styles.tick}
                        style={{ animationDelay: `${-1 + (i * 1 / ticks.length)}s` }}
                     /></div>
               ))}
            </div>
         </div>
         <div className={styles.placeholder} id='loading-text'>
            <p key={loadingText}>{loadingText}</p>
         </div>
      </div>
   )
}
