import { useMemo } from 'react'

function normalize(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[^\w\s]/g, '')
}

function score(text: string, query: string) {
  const normalizedText = normalize(text)
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return 1
  if (normalizedText.includes(normalizedQuery)) return 2

  const chars = normalizedQuery.split('')
  let index = 0
  for (const char of chars) {
    index = normalizedText.indexOf(char, index)
    if (index === -1) return 0
    index += 1
  }
  return 1
}

export function useFuzzySearch<T extends { name: string; category?: string }>(items: T[], query: string) {
  return useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return [...items]
      .map((item) => ({ item, score: score(`${item.name} ${item.category || ''}`, q) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item)
  }, [items, query])
}
