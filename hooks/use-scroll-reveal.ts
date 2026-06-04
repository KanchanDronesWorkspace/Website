"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export function useScrollReveal(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(element)
                }
            },
            { threshold }
        )

        observer.observe(element)

        return () => observer.disconnect()
    }, [threshold])

    return { ref, isVisible }
}

export function useStaggerReveal(count: number, threshold = 0.1, staggerDelay = 100) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(count).fill(false))

    useEffect(() => {
        const element = containerRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Stagger reveal each item
                    for (let i = 0; i < count; i++) {
                        setTimeout(() => {
                            setVisibleItems(prev => {
                                const next = [...prev]
                                next[i] = true
                                return next
                            })
                        }, i * staggerDelay)
                    }
                    observer.unobserve(element)
                }
            },
            { threshold }
        )

        observer.observe(element)

        return () => observer.disconnect()
    }, [count, threshold, staggerDelay])

    return { containerRef, visibleItems }
}
