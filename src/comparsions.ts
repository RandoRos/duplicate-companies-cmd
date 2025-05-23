import { distance } from 'fastest-levenshtein'
import compare from 'string-comparison'
import { normalizeCompanyName, isSingleWorld } from '@/utils'

const jaro = compare.jaroWinkler

export const lengthBaseIncludes = (a: string, b: string) => {
  const [shorter, longer] = a.length < b.length ? [a, b] : [b, a]

  // If both strings contain only one word, use Jaro-Winkler similarity
  if (isSingleWorld(shorter) && isSingleWorld(longer)) {
    return jaro.similarity(shorter, longer) >= 0.8
  }

  // If one string have only single world and other has many, check if the longer string first word contains the shorter one
  if (isSingleWorld(shorter) && !isSingleWorld(longer)) {
    const firstWord = longer.split('-')[0]
    return longer.includes(firstWord)
  }

  if (shorter.length < 3 && longer.length - shorter.length > 3) {
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
