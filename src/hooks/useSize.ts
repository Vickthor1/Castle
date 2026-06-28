import { useEffect, useState, useRef } from 'react'

export function useSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(() => {
      if (!ref.current) return
      setSize({ width: ref.current.offsetWidth, height: ref.current.offsetHeight })
    })
    ro.observe(ref.current)
    setSize({ width: ref.current.offsetWidth, height: ref.current.offsetHeight })
    return () => ro.disconnect()
  }, [])

  return { ref, size }
}
