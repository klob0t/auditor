//@/app/lib/hooks/textAnim.ts
'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useRef } from 'react'
import { RefObject } from 'react'

gsap.registerPlugin(SplitText)

interface UseTextAnimation {
  selector: string
  delay?: number
  stagger?: number
  duration?: number
  trigger: string | number | boolean | null | undefined
  scope: RefObject<HTMLElement | null>
}

export const useTextAnimation = ({
  selector,
  delay,
  stagger,
  duration,
  trigger,
  scope
}: UseTextAnimation) => {
  const splitRef = useRef<SplitText | null>(null)

  useGSAP(() => {
    if (!trigger) return

    const target = scope.current?.querySelectorAll(selector);
    if (!target) {
        return;
    }

    if (splitRef.current) {
      splitRef.current.revert()
    }

    const split = new SplitText(target, { type: 'words' })
    splitRef.current = split

    if (split.words && split.words.length > 0) {
      console.log(`characters found: ${selector}`)
      gsap.from(split.words, {
        opacity: 0,
        y: 5,
        duration: (split.words.length * 0.02) * 0.1,
        stagger,
        delay,
        ease: 'power3.out'
      })
    } else {
      console.log(`No characters found: ${selector}`)
    }

  },{ 
    scope: scope,
    dependencies: [trigger, selector, delay, stagger, duration],
    revertOnUpdate: true })
}

interface UseSlideAnimationProps {
  target: RefObject<HTMLElement | null>
  play: boolean
  direction: string
  duration: number
  ease: string
  onComplete: () => void
}

type AnimationProps = {
  yPercent?: number;
  xPercent?: number;
};

export const useSlideAnimation = ({
  target,
  play,
  direction = 'up',
  duration = 0.8,
  ease = 'power2.inOut',
  onComplete
}: UseSlideAnimationProps) => {
  useGSAP(() => {
    if (play && target.current) {
      const animationProps : AnimationProps = {}

      switch (direction) {
        case 'up':
          animationProps.yPercent = -100
          break
        case 'down':
          animationProps.yPercent = 100
          break
        case 'left':
          animationProps.xPercent = -100
          break
        case 'right':
          animationProps.xPercent = 100
          break
        default:
          animationProps.yPercent = -100
      }

      gsap.to(target.current, {
        ...animationProps,
        duration: duration,
        ease: ease,
        onComplete: () => {
          if (onComplete) {
            onComplete()
          }
        }
      })
    }
  }, {
    dependencies: [target, play, direction, duration, ease, onComplete],
    revertOnUpdate: true
  })
}

interface UseSpinAnimationProps {
  target: RefObject<HTMLElement | null>
  play: boolean
  duration: number
  ease: string
  onComplete: () => void
}

export const useSpinAnimation = ({
  target,
  play,
  duration = 0.8,
  ease = 'power2.inOut',
  onComplete
}: UseSpinAnimationProps) => {
  useGSAP(() => {
    if (play && target.current) {
      gsap.to(target.current, {
        rotation: 1440,
        scale: 0,
        duration: duration,
        ease: ease,
        onComplete: () => {
          if (onComplete) {
            onComplete()
          }
        }
      })
    } 
  }, {
    dependencies: [target, play, duration, ease, onComplete],
    revertOnUpdate: true
  })
}

// export const useImageAnimation = ({

// }) => {
//   useGSAP(() => {
    
//   })
// }
