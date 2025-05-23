import { distance } from 'fastest-levenshtein'
import compare from 'string-comparison'
import { normalizeCompanyName } from '@/utils'

const jaro = compare.jaroWinkler

export const isSingleWorld = (a: string, b: string) => {
  return a.split(/-/).length === 1 && b.split(/-/).length === 1
}

export const lengthBaseIncludes = (a: string, b: string) => {
  const [shorter, longer] = a.length < b.length ? [a, b] : [b, a]

  if (isSingleWorld(shorter, longer)) {
    return jaro.similarity(shorter, longer) >= 0.8
  }

  if (!shorter.includes('-') && longer.includes('-')) {
    const firstWord = longer.split('-')[0]
    return longer.includes(firstWord)
  }

  const lengthDifference = longer.length - shorter.length
  if (shorter.length < 3 && lengthDifference > 3) {
    return false
  }

  return longer.includes(shorter)
}

// Calculate Levenshtein distance ratio between two strings for each word in the string
export const levenshteinDistance = (a: string, b: string) => {
  const normalizedA = normalizeCompanyName(a)
  const normalizedB = normalizeCompanyName(b)

  if (normalizedA === normalizedB) {
    return 1
  }

  const wordsA = normalizedA.split(/\s+/)
  const wordsB = normalizedB.split(/\s+/)

  let matchedWords = 0

  for (const aw of wordsA) {
    const bestMatch = Math.min(...wordsB.map((bw) => distance(aw, bw)))
    if (bestMatch === 0 || (aw.length >= 6 && bestMatch <= 1)) {
      matchedWords++
    }
  }

  const matchRatio = matchedWords / wordsA.length

  return matchRatio
}
