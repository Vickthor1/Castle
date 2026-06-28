import { useEffect, useState } from 'react'

export function useAsync<T>(factory: () => Promise<T>, deps: React.DependencyList = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    void factory().then((value) => {
      if (active) setData(value)
    }).catch((err) => {
      if (active) setError(err instanceof Error ? err : new Error(String(err)))
    }).finally(() => {
      if (active) setLoading(false)
    })

    return () => {
      active = false
    }
  }, deps)

  return { data, loading, error }
}
