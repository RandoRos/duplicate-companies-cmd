import {
  lengthBaseIncludes,
  levenshteinDistance,
} from '../comparsions'
import { isSingleWord } from '@/utils'

describe('isSingleWord', () => {
  test('should identify single words without hyphens', () => {
    expect(isSingleWord('apple')).toBe(true)
  })

  test('should identify hyphenated words', () => {
    expect(isSingleWord('apple-pie')).toBe(false)
  })
})

describe('lengthBaseIncludes', () => {
  test('should handle single words with high similarity', () => {
    expect(lengthBaseIncludes('apple', 'appl')).toBe(true)
    expect(lengthBaseIncludes('appl', 'apple')).toBe(true)
  })

  test('should handle hyphenated strings', () => {
    expect(lengthBaseIncludes('apple', 'apple-pie')).toBe(true)
    expect(lengthBaseIncludes('apple-pie', 'apple')).toBe(true)
  })

  test('should reject short strings with big length difference', () => {
    expect(lengthBaseIncludes('ab', 'abcdefgh')).toBe(false)
  })

  test('should check if longer string contains shorter string', () => {
    expect(lengthBaseIncludes('tech', 'techsolutions')).toBe(false)
    expect(lengthBaseIncludes('techsolutions', 'tech')).toBe(false)
  })
})

describe('levenshteinDistance', () => {
  test('should return 1 for identical normalized strings', () => {
    expect(levenshteinDistance('Apple Inc', 'apple inc')).toBe(1)
    expect(levenshteinDistance('Tech, Inc.', 'Tech Inc')).toBe(1)
  })

  test('should calculate match ratio for similar strings', () => {
    const result = levenshteinDistance('Apple Technologies', 'Apple Tech');
    console.log(result)
    expect(result).toBeGreaterThan(0)
    expect(result).toBeLessThan(1)
  })

  test('should match words with small Levenshtein distance', () => {
    // Word "technologies" has length >= 6 and should match with "technology" with distance 1
    expect(
      levenshteinDistance('Apple Technologies', 'Apple Technology')
    ).toBeGreaterThan(0.5)
  })

  test('should handle completely different strings', () => {
    expect(levenshteinDistance('Apple Computer', 'Microsoft Software')).toBe(0)
  })
  
  test('should handle threshold comparison correctly', () => {
    const similarity = levenshteinDistance('Acme Software Solutions', 'Acme Solutions');
    // Check if the similarity value would pass different thresholds
    expect(similarity >= 0.5).toBe(true)  // Should pass with threshold 0.5
    expect(similarity >= 0.8).toBe(false) // Should fail with threshold 0.8
  })
})
