import { distance } from 'fastest-levenshtein'
import compare from 'string-comparison'
import { normalizeCompanyName, isSingleWord } from '@/utils'

const jaro = compare.jaroWinkler

export const jaroWinklerSimilarity = (a: string, b: string) => {
  const similarity = jaro.similarity(a, b)
  return similarity
}

export const lengthBaseIncludes = (a: string, b: string) => {
  const [shorter, longer] = a.length < b.length ? [a, b] : [b, a]

  // If both strings contain only one word, use Jaro-Winkler similarity
  if (isSingleWord(shorter) && isSingleWord(longer)) {
    const diff = Math.abs(shorter.length - longer.length)
    if (diff > 3) {
      return false
    }
    return jaroWinklerSimilarity(shorter, longer) >= 0.8
  }

  // If one string have only single world and other has many, check if the longer string first word contains the shorter one
  if (isSingleWord(shorter) && !isSingleWord(longer)) {
    const firstWord = longer.split('-')[0]
    if (firstWord.length < shorter.length) {
      return shorter.includes(firstWord)
    }
    return firstWord.includes(shorter)
  }

  if (shorter.length < 3 && longer.length - shorter.length > 3) {
    return false
  }

  return longer.includes(shorter)
}

// Calculate Levenshtein distance ratio between two strings for each word in the string
export const levenshteinDistance = (hashA: string, hashB: string) => {
  const normalizedA = normalizeCompanyName(hashA, false)
  const normalizedB = normalizeCompanyName(hashB, false)

  if (normalizedA === normalizedB) {
    return 1
  }

  const wordsA = normalizedA.split(/\s+/)
  const wordsB = normalizedB.split(/\s+/)

  let matchedWords = 0
  const totalWords = wordsA.length

  for (const aw of wordsA) {
    if (aw.trim() === '') continue

    const bestMatch = Math.min(...wordsB.map((bw) => distance(aw, bw)))

    if (bestMatch === 0) {
      matchedWords++
    } else if (
      (aw.length >= 6 && bestMatch <= 1) ||
      (aw.length >= 8 && bestMatch <= 2)
    ) {
      matchedWords += 0.8 // Partial credit
    } 
    else if (
      (aw.length >= 5 && bestMatch <= 2) ||
      (aw.length >= 7 && bestMatch <= 3)
    ) {
      matchedWords += 0.5 // Less credit
    }
  }

  if (totalWords === 0) return 0

  const matchRatio = matchedWords / totalWords

  return matchRatio
}
