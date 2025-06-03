//@/app/components/spinner/index.tsx
import React from 'react'
import styles from './page.module.css'

interface spinnerProps {
   size?: number
}

const Spinner: React.FC<spinnerProps> = ({ size = 44 }) => {
   const ticks = Array.from(Array(12))

   return (
      <div
         className={styles.spinner}
         style={{ width: size, height: size }}
      >
         {ticks.map((_, i) => (
            <div
               key={i}
               className={styles.tickWrapper}
               style={{ transform: `rotate(${i * 30}deg)`}}
            >
               <div
                  className={styles.tick}
                  style={{ animationDelay: `${-0.9167 + (i * 0.08333)}s` }}
               />
            </div>
         ))}
      </div>
   )
}

export default Spinner