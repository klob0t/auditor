//@/app/lib/hooks/textAnim.ts
'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useRef } from 'react'
import { RefObject } from 'react'

gsap.registerPlugin(SplitText)

interface TextAnimationProps {
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
}: TextAnimationProps) => {
  const splitRef = useRef<SplitText | null>(null)


  useGSAP(() => {
    if (!trigger) return

    const target = scope.current?.querySelectorAll(selector);
    if (!target) {
      return;
    }

    if (!scope.current) {
      console.log("TextAnimation: Scope element is not available.");
      return
    }

    if (target.length === 0) {
      console.log(`TextAnimation: No elements found for selector "${selector}" within the provided scope.`);
      return;
    }

    if (splitRef.current) {
      splitRef.current.revert()
    }

    const split = new SplitText(target, { type: 'words' })
    splitRef.current = split

    if (split.words && split.words.length > 0) {
      gsap.fromTo(split.words, {
        opacity: 0,
        visibility: 'visible',
        y: 5,
      }, {
        opacity: 1,
        y: 0,
        duration: duration,
        stagger: stagger,
        delay: delay,
        ease: 'power3.out'
      })
    } else {
      console.log(`No characters found: ${selector}`)
    }

  }, {
    scope: scope,
    dependencies: [trigger, selector, delay, stagger, duration],
    revertOnUpdate: true
  })
}

export const useTextExitAnimation = ({
  selector,
  delay,
  stagger,
  duration,
  trigger,
  scope
}: TextAnimationProps) => {
  const splitRef = useRef<SplitText | null>(null)


  useGSAP(() => {
    if (!trigger) return

    const target = scope.current?.querySelectorAll(selector);
    if (!target) {
      return;
    }

    if (!scope.current) {
      console.log("TextAnimation: Scope element is not available.");
      return
    }

    if (target.length === 0) {
      console.log(`TextAnimation: No elements found for selector "${selector}" within the provided scope.`);
      return;
    }

    if (splitRef.current) {
      splitRef.current.revert()
    }

    const split = new SplitText(target, { type: 'words' })
    splitRef.current = split

    if (split.words && split.words.length > 0) {
      gsap.fromTo(split.words, {
        opacity: 1,
        y: 0,
      }, {
        opacity: 0,
        y: -5,
        duration: duration,
        stagger: stagger,
        delay: delay,
        ease: 'power3.out'
      })
    } else {
      console.log(`No characters found: ${selector}`)
    }

  }, {
    scope: scope,
    dependencies: [trigger, selector, delay, stagger, duration],
    revertOnUpdate: true
  })
}